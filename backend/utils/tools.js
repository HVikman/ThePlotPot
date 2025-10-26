const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)
const { checkBanned } = require('./cache.js')

/**
 * Extracts the first IP address from a potential header value.
 *
 * @param {string|string[]} value - The header value to parse.
 * @returns {string|null}
 */
const normalizeIpValue = (value) => {
  if (!value) {
    return null
  }

  const raw = Array.isArray(value) ? value[0] : value
  if (typeof raw !== 'string') {
    return null
  }

  const ip = raw
    .split(',')
    .map(part => part.trim())
    .find(Boolean)

  return ip || null
}

/**
 * Determines the best available client IP address from a request object.
 *
 * @param {import('express').Request} req - The incoming HTTP request.
 * @returns {string|null} - The resolved client IP address, or null if unavailable.
 */
const getClientIp = (req) => {
  if (!req) {
    return null
  }

  const headers = req.headers || {}

  const candidates = [
    normalizeIpValue(headers['x-forwarded-for']),
    normalizeIpValue(headers['cf-connecting-ip']),
    normalizeIpValue(headers['x-real-ip']),
    req.ip,
    req.connection?.remoteAddress,
    req.socket?.remoteAddress,
    req.connection?.socket?.remoteAddress,
  ]

  const ip = candidates.find(Boolean) || null

  if (!ip) {
    return null
  }

  if (ip === '::1' || ip === '127.0.0.1') {
    return 'localhost'
  }

  return ip
}

/**
 * Checks if a user is logged in by verifying their session and decoding the user ID.
 * Also checks if the user is banned. If the user is not logged in or banned, throws an error.
 *
 * @param {object} context - The GraphQL context object, containing session and request info.
 * @param {boolean} [message=true] - Whether to show an error message if the user is not logged in.
 * @returns {number} - The decoded user ID.
 */
const checkLoggedIn = async (context, message = true) => {
  const userId = context.req.session?.user
  const original = hashids.decode(userId)

  if (!userId && message) {
    createUserError('You must be logged in to access this')
  }

  const decodedUserId = original[0]
  const { isBanned } = await checkBanned(userId)
  if (isBanned) {
    createUserError('Your account is banned')
  }

  return decodedUserId
}

/**
 * Creates a custom error and throws it, to be used in resolvers.
 *
 * @param {string} message - The error message to display.
 */
const createUserError = (message) => {
  const error = new Error(message)
  error.isUserError = true
  console.log(error)
  throw error
}

/**
 * Validates whether the provided value is a valid number (either string or number).
 * Optionally allows control over whether the result should be an integer.
 *
 * @param {string|number} value - The value to validate and convert to a number.
 * @param {boolean} [isInteger=true] - If true, ensures the value is an integer. If false, allows floats.
 * @param {string} [errorMessage='Invalid number'] - Optional custom error message.
 * @returns {number} - The validated and parsed number.
 */
const validateNumber = (value, isInteger = true, errorMessage = 'Invalid number') => {
  const parsedValue = isInteger ? parseInt(value, 10) : parseFloat(value)

  // Check if the parsed value is a valid number
  if (isNaN(parsedValue) || (isInteger && !Number.isInteger(parsedValue))) {
    throw new Error(errorMessage)
  }

  return parsedValue
}

module.exports = {
  checkLoggedIn,
  createUserError,
  validateNumber,
  getClientIp,
}
