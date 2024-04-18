const queryDB = require('../db/query')
const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)

const { createClient } = require('redis')
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379
  },
  password: process.env.REDIS_PASS
})
redisClient.connect()

const getCachedBannedStatus = async (userId) => {
  const data = await redisClient.get(`bannedStatus:${userId}`)
  return data ? JSON.parse(data) : null
}

const setCachedBannedStatus = (userId, isBanned) => {
  const data = JSON.stringify({
    isBanned,
    lastChecked: Date.now(),
  })
  redisClient.set(`bannedStatus:${userId}`, data, 'PX', 5 * 60 * 1000) // Expires in 5 minutes
}
const isCacheStale = (lastChecked) => {
  const staleTime = 5 * 60 * 1000
  return (Date.now() - lastChecked) > staleTime
}

const clearUserFromCache = async (userId) => {
  await redisClient.del(`bannedStatus:${userId}`)
}

const checkBanned = async (userId) => {
  const original = hashids.decode(userId)
  userId = original[0]
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

  return { isBanned: false }
}

module.exports = {
  checkBanned,
  clearUserFromCache,
  setCachedBannedStatus
}