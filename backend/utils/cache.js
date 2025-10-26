const queryDB = require('../db/query')
const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)

const { createClient } = require('redis')

let redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379,
  },
  password: process.env.REDIS_PASS
})
redisClient.connect().catch((error) => {
  console.error('Redis connection error:', error)
})

const getCachedBannedStatus = async (userId) => {
  try {
    const data = await redisClient.get(`bannedStatus:${userId}`)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error retrieving banned status from Redis:', error)
    return null
  }
}


const setCachedBannedStatus = async (userId, isBanned) => {
  try {
    const data = JSON.stringify({
      isBanned,
      lastChecked: Date.now(),
    })
    await redisClient.set(`bannedStatus:${userId}`, data, 'PX', 5 * 60 * 1000) // Expires in 5 minutes
  } catch (error) {
    console.error('Failed to set banned status in Redis:', error)
  }
}

const clearUserFromCache = async (userId) => {
  try {
    await redisClient.del(`bannedStatus:${userId}`)
  } catch (error) {
    console.error('Failed to delete user from Redis cache:', error)
  }
}

const isCacheStale = (lastChecked) => {
  const staleTime = 5 * 60 * 1000
  return (Date.now() - lastChecked) > staleTime
}

const checkBanned = async (userId) => {
  const original = hashids.decode(userId)
  userId = original[0]
  try {
    const cachedStatus = await getCachedBannedStatus(userId)

    if (cachedStatus && !isCacheStale(cachedStatus.lastChecked)) {
      if (cachedStatus.isBanned) {
        return { isBanned: true }
      }
    } else {
      const user = await queryDB('SELECT * FROM users WHERE id = ?', [userId], true)
      if (user) {
        const isBanned = user.bannedAt !== null
        setCachedBannedStatus(userId, isBanned)
        console.log(user)
        return { isBanned }
      }
    }
  }catch(error) {
    console.error('Failed to check banned status default to not banned')
    return { isBanned: false }
  }
  return { isBanned: false }
}

const EMAIL_RATE_LIMIT_MS = 60 * 1000


const canSendEmail = async (email, ip) => {
  if (!email && !ip) {
    console.error('Email limiter: No email or IP provided — blocking by default')
    return false
  }

  try {
    const keys = []
    if (email) keys.push(`emailRate:${email}`)
    if (ip) keys.push(`emailRate:${ip}`)

    const existsResults = await Promise.all(keys.map(k => redisClient.exists(k)))
    if (existsResults.some(Boolean)) {
      return false
    }

    const pipeline = redisClient.multi()
    keys.forEach((key) => pipeline.set(key, '1', { PX: EMAIL_RATE_LIMIT_MS }))
    await pipeline.exec()

    return true
  } catch (error) {
    console.error('Email rate limit check failed — blocking by default:', error)
    return false
  }
}


module.exports = {
  checkBanned,
  clearUserFromCache,
  setCachedBannedStatus,
  canSendEmail
}