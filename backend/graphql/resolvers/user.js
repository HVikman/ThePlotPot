const bcrypt = require('bcrypt')
const queryDB = require('../../db/query')
const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)
const crypto = require('crypto')
const sanitizeHtml = require('sanitize-html')
const checkCaptcha = require('../../utils/captcha.js')
const { checkLoggedIn, createUserError, validateNumber } = require('../../utils/tools.js')
const { clearUserFromCache, setCachedBannedStatus } = require('../../utils/cache.js')
const { RateLimiterMemory } = require('rate-limiter-flexible')
const { sendActivationEmail, sendPasswordResetEmail } = require('../../utils/email.js')

// Define max length constants
const MAX_USERNAME_LENGTH = 50
const MAX_EMAIL_LENGTH = 100
const MAX_PASSWORD_LENGTH = 100
const MAX_LINK_LENGTH = 200
const MAX_TOKEN_LENGTH = 255

const loginRateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 15 * 60,
})

const UserResolvers = {
  // Queries
  Query: {
    // Fetch a user (admin only)
    getUser: async (_, { id }, context) => {
      await checkLoggedIn(context)
      if (!context.req.session.admin) createUserError('You are not admin')

      // Validate and decode the user ID
      const parsedId = validateNumber(id, true, 'Invalid user ID')

      const user = await queryDB('SELECT * FROM users WHERE id = ? AND deletedAt IS NULL', [parsedId], true)
      if (!user) createUserError('User not found')

      // Hash the email for privacy
      user.email = crypto.createHash('md5').update(user.email.toLowerCase()).digest('hex')

      return user
    },
    // Fetch all users (admin only)
    getAllUsers: async (_, __, context) => {
      await checkLoggedIn(context)
      if (!context.req.session.admin) createUserError('You are not admin')

      const users = await queryDB('SELECT * FROM users WHERE deletedAt IS NULL')

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
      const user = await queryDB('SELECT * FROM users WHERE id = ? AND deletedAt IS NULL', [userId], true)
      if (!user) createUserError('User not found')

      // Hash the email for privacy
      user.email = crypto.createHash('sha256').update(user.email.trim().toLowerCase()).digest('hex')
      user.id = hashids.encode(user.id)
      return user
    },
    // Fetch specified user profile data
    getUserProfile: async (_, { id }) => {
      const original = hashids.decode(id)
      const userId = original[0]
      const user = await queryDB('SELECT * FROM users WHERE id = ? AND deletedAt IS NULL', [userId], true)
      if (!user) createUserError('User not found')

      // Hash the email for privacy
      user.email = crypto.createHash('sha256').update(user.email.trim().toLowerCase()).digest('hex')
      user.id = hashids.encode(user.id)

      // Fetch user-related data (stories, chapters, comments)
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

      // Sanitize and validate inputs
      const sanitizedUsername = sanitizeHtml(username, { allowedTags: [], allowedAttributes: {} })
      const sanitizedEmail = sanitizeHtml(email.trim().toLowerCase(), { allowedTags: [], allowedAttributes: {} })

      if (sanitizedUsername.length > MAX_USERNAME_LENGTH) createUserError(`Username too long (max ${MAX_USERNAME_LENGTH} characters)`)
      if (sanitizedEmail.length > MAX_EMAIL_LENGTH) createUserError(`Email too long (max ${MAX_EMAIL_LENGTH} characters)`)
      if (password.length > MAX_PASSWORD_LENGTH) createUserError(`Password too long (max ${MAX_PASSWORD_LENGTH} characters)`)

      // Check for existing users with the same email
      const existingUser = await queryDB('SELECT * FROM users WHERE email = ?', [sanitizedEmail], true)
      if (existingUser) {
        return { success: false, message: 'Email already in use' }
      }

      // Hash the user's password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Insert the new user into the database
       const activationToken = crypto.randomBytes(32).toString('hex')

      // Insert the new user into the database
      await queryDB('INSERT INTO users (username, password, email, activation_token) VALUES (?, ?, ?, ?)', [sanitizedUsername, hashedPassword, sanitizedEmail, activationToken])
      const newUser = await queryDB('SELECT id, username, email, coffee, has_superpowers, bannedAt, deletedAt, is_activated FROM users WHERE email = ?', [sanitizedEmail], true)

      try {
        await sendActivationEmail(sanitizedEmail, activationToken, sanitizedUsername, context.req)
      } catch (error) {
        console.error('Failed to send activation email:', error)
        return { success: false, message: 'Failed to send activation email. Please try again later.' }
      }

      newUser.id = hashids.encode(newUser.id)
      newUser.email = crypto.createHash('sha256').update(newUser.email.trim().toLowerCase()).digest('hex')

      return { success: true, message: 'Sign up successful. Please check your email to activate your account.', user: newUser }
    },
    // Log in a user
    login: async (_, { email, password }, context) => {
      const clientIp = context.clientIp
      try {
        await loginRateLimiter.consume(clientIp)

        // Sanitize email input
        const sanitizedEmail = sanitizeHtml(email.trim().toLowerCase(), {
          allowedTags: [],
          allowedAttributes: {}
        })

        if (sanitizedEmail.length > MAX_EMAIL_LENGTH) {
          createUserError(`Email too long (max ${MAX_EMAIL_LENGTH} characters)`)
        }

        // Check if the email exists
        const user = await queryDB('SELECT * FROM users WHERE email = ?', [sanitizedEmail], true)
        if (!user) {
          return { success: false, message: 'Invalid credentials' } // Generic error message
        }

        // Check if the password is correct
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
          return { success: false, message: 'Invalid credentials' } // Generic error message
        }

        if (user.bannedAt !== null) {
          return { success: false, message: 'You are banned' }
        }
        
        const isActivated =
          user.is_activated === null || user.is_activated === undefined
            ? true
            : Boolean(user.is_activated)

        if (!isActivated) {
          try {
            const newToken = user.activation_token || crypto.randomBytes(32).toString('hex')
            if (!user.activation_token) {
              await queryDB('UPDATE users SET activation_token = ? WHERE id = ?', [newToken, user.id])
            }
            await sendActivationEmail(user.email, newToken, user.username, context.req)

            return {
              success: false,
              message:
                'Your account is not activated. A new activation link has been sent to your email address.'
            }
          } catch (error) {
            console.error('Activation email error:', error)
            if (error.message.includes('Too many email requests')) {
              return {
                success: false,
                message:
                  'Your account is not activated. Please check your email for the activation link.'
              }
            }

            return {
              success: false,
              message:
                'Your account is not activated and the activation email could not be sent. Please try again later.'
            }
          }
        }

        // Store user session
        context.req.session.user = hashids.encode(user.id)
        context.req.session.username = user.username
        context.req.session.email = user.email
        context.req.session.admin = user.has_superpowers ? true : false
        user.id = hashids.encode(user.id)

        // Hash the email for privacy
        user.email = crypto.createHash('sha256').update(user.email.trim().toLowerCase()).digest('hex')

        return { success: true, message: 'Logged in successfully', user }

      } catch (rateLimiterRes) {
        return {
          success: false,
          message: 'Too many login attempts. Please try again in 15 minutes.',
        }
      }
    },

    activateAccount: async (_, { token }, context) => {
      const sanitizedToken = sanitizeHtml(token, { allowedTags: [], allowedAttributes: {} }).trim()

      if (!sanitizedToken || sanitizedToken.length > MAX_TOKEN_LENGTH) {
        return { success: false, message: 'Invalid activation token' }
      }

      const user = await queryDB('SELECT id, username, email, has_superpowers FROM users WHERE activation_token = ?', [sanitizedToken], true)
      if (!user) {
        return { success: false, message: 'Invalid activation token' }
      }

      await queryDB('UPDATE users SET is_activated = 1, activation_token = NULL WHERE id = ?', [user.id])

      context.req.session.user = hashids.encode(user.id)
      context.req.session.username = user.username
      context.req.session.email = user.email
      context.req.session.admin = user.has_superpowers ? true : false

      return { success: true, message: 'Account activated successfully' }
    },

    requestPasswordReset: async (_, { email, token: captchaToken }, context) => {
      await checkCaptcha(captchaToken)
      const sanitizedEmail = sanitizeHtml(email.trim().toLowerCase(), { allowedTags: [], allowedAttributes: {} })

      if (sanitizedEmail.length > MAX_EMAIL_LENGTH) {
        createUserError(`Email too long (max ${MAX_EMAIL_LENGTH} characters)`)
      }

      const user = await queryDB('SELECT id, username, email FROM users WHERE email = ?', [sanitizedEmail], true)
      if (!user) {
        return { success: true, message: 'If an account with that email exists, a password reset link has been sent.' }
      }

      const resetToken = crypto.randomBytes(32).toString('hex')
      try {
        await queryDB('UPDATE users SET password_reset_token = ? WHERE id = ?', [resetToken, user.id])
        await sendPasswordResetEmail(user.email, resetToken, user.usernam, context.req)
      } catch (error) {
        console.error('Failed to send password reset email:', error)
        if (error.message && error.message.includes('Too many email requests')) {
          return { success: false, message: error.message }
        }
        return { success: false, message: 'Failed to send password reset email. Please try again later.' }
      }

      return { success: true, message: 'If an account with that email exists, a password reset link has been sent.' }
    },
    resetPassword: async (_, { token, newPassword }) => {
      if (newPassword.length > MAX_PASSWORD_LENGTH) createUserError(`Password too long (max ${MAX_PASSWORD_LENGTH} characters)`)

      const sanitizedToken = sanitizeHtml(token, { allowedTags: [], allowedAttributes: {} }).trim()
      if (!sanitizedToken || sanitizedToken.length > MAX_TOKEN_LENGTH) {
        return { success: false, message: 'Invalid or expired reset token' }
      }

      const user = await queryDB('SELECT id FROM users WHERE password_reset_token = ?', [sanitizedToken], true)
      if (!user) {
        return { success: false, message: 'Invalid or expired reset token' }
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await queryDB('UPDATE users SET password = ?, password_reset_token = NULL WHERE id = ?', [hashedPassword, user.id])
      return { success: true, message: 'Password reset successfully' }
    },

    // Change the user's password
    changePassword: async (_, { oldPassword, newPassword }, context) => {
      const userId = await checkLoggedIn(context)

      if (newPassword.length > MAX_PASSWORD_LENGTH) createUserError(`Password too long (max ${MAX_PASSWORD_LENGTH} characters)`)

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
      if (!link) createUserError('Link is required')

      // Sanitize and validate Buy Me a Coffee link
      const sanitizedLink = sanitizeHtml(link, { allowedTags: [], allowedAttributes: {} })

      if (sanitizedLink.length > MAX_LINK_LENGTH) createUserError(`Link too long (max ${MAX_LINK_LENGTH} characters)`)

      const buyMeACoffeeRegex = /^https:\/\/www\.buymeacoffee\.com\/[a-zA-Z0-9_-]+$/
      if (!buyMeACoffeeRegex.test(sanitizedLink)) {
        createUserError('Invalid Buy Me a Coffee link. Please provide a valid link in the format: https://www.buymeacoffee.com/yourname')
      }

      await queryDB('UPDATE users SET coffee = ? WHERE id = ?', [sanitizedLink, userId])
      return { success: true, message: 'Buy Me a Coffee link updated' }
    },
    // Ban user (admin only)
    banUser: async (_, { id }, context) => {
      await checkLoggedIn(context)
      if (!context.req.session.admin) createUserError('You are not admin')

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
    // Unban user (admin only)
    unbanUser: async (_, { id }, context) => {
      await checkLoggedIn(context)
      if (!context.req.session.admin) createUserError('You are not admin')

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
    },

    // Delete user (admin only)
    deleteUser: async (_, { id }, context) => {
      await checkLoggedIn(context)
      if (!context.req.session.admin) createUserError('You are not an admin')
    
      const original = hashids.decode(id)
      const userId = original[0]
      if (!userId) createUserError('Invalid user ID')
    
      const deleteUserQuery = 'UPDATE users SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?'
      const deleteUserResult = await queryDB(deleteUserQuery, [userId])
    
      if (deleteUserResult.affectedRows > 0) {
        clearUserFromCache(userId)
    
        const deleteCommentsQuery = 'UPDATE comments SET deletedAt = CURRENT_TIMESTAMP WHERE userId = ?'
        await queryDB(deleteCommentsQuery, [userId]);
    
        return {
          success: true,
          message: 'User deleted successfully',
        }
      }
    
      createUserError('Failed to delete user.')
    },
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
