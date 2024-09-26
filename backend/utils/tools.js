const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)
const { checkBanned } = require('./cache.js')

const checkLoggedIn = async (context, message=true) => {
  const userId = context.req.session?.user
  const original = hashids.decode(context.req.session.user)

  if (!userId && message) {
    createUserError('You must be logged in to access this ')
  }
  const { isBanned } = await checkBanned(context.req.session.user)
  if (isBanned) {
    createUserError('Your account has been banned.')
  }
  return original[0]
}

const createUserError = (message) => {
  const error = new Error(message)
  error.isUserError = true
  console.log(error)
  throw error
}

module.exports = {
  checkLoggedIn,
  createUserError
}