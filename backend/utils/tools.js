const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)
const { checkBanned } = require('./cache.js')

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
  throw new Error(message)
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
}
