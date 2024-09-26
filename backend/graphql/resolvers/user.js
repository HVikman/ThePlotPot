const bcrypt = require('bcrypt')
const queryDB = require('../../db/query')
const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)
const crypto = require('crypto')
const checkCaptcha = require('../../utils/captcha.js')
const { checkLoggedIn, createUserError } = require('../../utils/tools.js')
const { clearUserFromCache, setCachedBannedStatus } = require('../../utils/cache.js')

const UserResolvers = {
  // Queries
  Query: {
    // Fetch a user
    getUser: async (_, { id }, context) => {
      await checkLoggedIn(context)
      if(!context.req.session.admin) createUserError('You are not admin')
      const user = await queryDB('SELECT * FROM users WHERE id = ?', [id], true)
      // Hash the email for privacy
      user.email = require('crypto').createHash('md5').update(user.email.toLowerCase()).digest('hex')
      if (!user) createUserError('User not found')
      return user
    },
    // Fetch all users
    getAllUsers: async (_, __, context) => {
      await checkLoggedIn(context)
      if(!context.req.session.admin) createUserError('You are not admin')
      const users = await queryDB('SELECT * FROM users')

      // Encode each user's ID
      users.forEach(user => {
        user.id = hashids.encode(user.id)
      })
      return users
    },
    // Fetch the current logged-in user
    me: async (_, args, context) => {

      // Check if the user is logged in
      if (!context.req.session || !context.req.session.user) {
        return null
      }

      const original = hashids.decode(context.req.session.user)
      const userId = original[0]
      const user = await queryDB('SELECT * FROM users WHERE id = ?', [userId], true)
      if (!user) createUserError('User not found')
      user.email = crypto.createHash('sha256').update(user.email.trim().toLowerCase()).digest('hex')
      user.id = hashids.encode(user.id)
      return user
    },
    // Fetch specified user profile data
    getUserProfile: async (_, { id }) => {
      const original = hashids.decode(id)
      const userId = original[0]
      const user = await queryDB('SELECT * FROM users WHERE id = ?', [userId], true)
      if (!user) createUserError ('User not found')
      user.email = crypto.createHash('sha256').update(user.email.trim().toLowerCase()).digest('hex')
      user.id = hashids.encode(user.id)
      const chapters = await queryDB('SELECT * FROM chapters WHERE authorId = ? AND NOT branch=0 AND deleted_at IS NULL', [userId])
      const stories = await queryDB('SELECT * FROM stories WHERE authorId = ? AND deleted_at IS NULL', [userId])
      const comments = await queryDB('SELECT * FROM comments WHERE userId = ? AND deletedAt IS NULL', [userId])

      return {
        user,
        stories,
        chapters,
        comments
      }
    }
  },

  // Mutations
  Mutation: {
    // Create a new user
    createUser: async (_, { username, password, email, token }, context) => {
      await checkCaptcha(token)

      // Check for existing users with the same email
      const existingUser = await queryDB('SELECT * FROM users WHERE email = ?', [email], true)
      if (existingUser) {
        return { success: false, message: 'email already in use' }
      }
      // Hash the user's password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Insert the new user into the database
      await queryDB('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email])
      const newUser = await queryDB('SELECT * FROM users WHERE email = ?', [email], true)

      // Store user session
      context.req.session.user = hashids.encode(newUser.id)
      context.req.session.username = username
      context.req.session.email = email
      context.req.session.admin = false
      return { success: true, message: 'Sign up successful', user: newUser }
    },
    // Log in a user
    login: async (_, { email, password }, context) => {
      // Check if the email exists
      const user = await queryDB('SELECT * FROM users WHERE email = ?', [email], true)
      if (!user) {
        return { success: false, message: 'Email doesn\'t exist or incorrect password' }
      }
      // Check if the password is correct
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        return { success: false, message: 'Email doesn\'t exist or incorrect password'  }
      }
      if(user.bannedAt !== null) {
        return { success: false, message: 'You are banned' }
      }
      // Store user session
      context.req.session.user = hashids.encode(user.id)
      context.req.session.username = user.username
      context.req.session.email = user.email
      context.req.session.admin = user.has_superpowers ? true : false
      console.log(context.req.session)
      user.id = hashids.encode(user.id)
      user.email = crypto.createHash('sha256').update(user.email.trim().toLowerCase()).digest('hex')
      return { success: true, message: 'Logged in successfully', user }
    },
    // Change the user's password
    changePassword: async (_, { oldPassword, newPassword }, context) => {
      const userId = await checkLoggedIn(context)
      // Check if password is correct
      const user = await queryDB('SELECT password FROM users WHERE id = ?', [userId], true)
      const valid = await bcrypt.compare(oldPassword, user.password)
      if (!valid) return { success: false, message: 'Incorrect password' }
      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await queryDB('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId])
      return { success: true, message: 'Password changed' }
    },
    // Logout user
    logout: (_, __, context) => {
      return new Promise((resolve) => {
        // Destroy the session
        context.req.session.destroy((err) => {
          if (err) {
            resolve({ success: false, message: 'Failed to logout' })
            return
          }
          // Clear cookies
          context.res.clearCookie('plotpot_sid')
          resolve({ success: true, message: 'Logged out successfully' })
        })
      })
    },

    // Edit the user's Buy Me a Coffee link
    editCoffee: async (_, { link }, context) => {
      const userId = await checkLoggedIn(context)
      if (!link) createUserError ('Link is required')
      await queryDB('UPDATE users SET coffee = ? WHERE id = ?', [link, userId])
      return { success: true, message: 'Buy Me a Coffee link updated' }
    },
    //Ban user
    banUser: async (_, { id }, context) => {
      await checkLoggedIn(context)
      if(!context.req.session.admin) createUserError('You are not admin')
      const original = hashids.decode(id)
      const userId = original[0]
      const query = 'UPDATE users SET bannedAt = CURRENT_TIMESTAMP WHERE id = ?'
      const params = [userId]
      const result = await queryDB(query, params)

      if (result.affectedRows > 0) {
        setCachedBannedStatus(userId, true)
        return {
          success: true,
          message: 'User banned successfully'
        }
      } else {
        createUserError('Failed to ban user.')
      }
    },
    //unban user
    unbanUser: async (_, { id }, context) => {
      await checkLoggedIn(context)
      if(!context.req.session.admin) createUserError('You are not admin')
      const original = hashids.decode(id)
      const userId = original[0]
      const query = 'UPDATE users SET bannedAt = null WHERE id = ?'
      const params = [userId]
      const result = await queryDB(query, params)

      if (result.affectedRows > 0) {
        clearUserFromCache(userId)
        return {
          success: true,
          message: 'User unbanned successfully'
        }
      } else {
        createUserError('Failed to unban user.')
      }
    }
  },

  // Fetching stories where user is an author
  User: {
    stories: async (parent) => {
      const userId = parent.id
      return await queryDB('SELECT * FROM stories WHERE authorId = ?', [userId])
    }
  }
}

module.exports = UserResolvers
