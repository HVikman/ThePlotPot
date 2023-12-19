const queryDB = require('../db/query')
const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)

let userBannedStatusCache = {}

const getCachedBannedStatus = (userId) => userBannedStatusCache[userId]

const setCachedBannedStatus = (userId, isBanned) => {
  userBannedStatusCache[userId] = {
    isBanned,
    lastChecked: Date.now(),
  }
}

const isCacheStale = (lastChecked) => {
  const staleTime = 5 * 60 * 1000
  return (Date.now() - lastChecked) > staleTime
}

const clearUserFromCache = (userId) => {
  delete userBannedStatusCache[userId]
}

const checkBanned = async (userId) => {
  const original = hashids.decode(userId)
  userId = original[0]
  console.log(original)
  console.log(userId)
  console.log(userBannedStatusCache)
  const cachedStatus = getCachedBannedStatus(userId)

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