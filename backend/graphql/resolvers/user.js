const bcrypt = require('bcrypt')
const queryDB = require('../../db/query')
const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)

const UserResolvers = {
  // Queries
  Query: {
    // Fetch a user
    getUser: async (_, { id }) => {
      const user = await queryDB('SELECT * FROM users WHERE id = ?', [id], true)
      // Hash the email for privacy
      user.email = require('crypto').createHash('md5').update(user.email.toLowerCase()).digest('hex')
      return user
    },
    // Fetch all users
    getAllUsers: async () => {
      return await queryDB('SELECT * FROM users')
    },
    // Fetch the current logged-in user
    me: async (_, args, context) => {
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]
      if (!userId) throw new Error('You are not logged in.')
      const user = await queryDB('SELECT * FROM users WHERE id = ?', [userId], true)
      user.email = require('crypto').createHash('md5').update(user.email.toLowerCase()).digest('hex')
      user.id = hashids.encode(user.id)
      return user
    },
    getUserProfile: async (_, { id }) => {
      const original = hashids.decode(id)
      const userId = original[0]
      const user = await queryDB('SELECT * FROM users WHERE id = ?', [userId], true)
      console.log(id)
      if (!user) {
        //TODO: Handle user not found
      }
      user.email = require('crypto').createHash('md5').update(user.email.toLowerCase()).digest('hex')
      user.id = hashids.encode(user.id)
      const chapters = await queryDB('SELECT * FROM chapters WHERE authorId = ? AND NOT branch=0', [userId])
      const stories = await queryDB('SELECT * FROM stories WHERE authorId = ?', [userId])

      return {
        user,
        stories,
        chapters
      }
    }
  },

  // Mutations
  Mutation: {
    // Create a new user
    createUser: async (_, { username, password, email }, context) => {
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
      return { success: true, message: 'Sign up successful', user: newUser }
    },
    // Log in a user
    login: async (_, { email, password }, context) => {
      // Check if the email exists
      const user = await queryDB('SELECT * FROM users WHERE email = ?', [email], true)
      if (!user) {
        return { success: false, message: 'Email doesn\'t exist' }
      }
      // Check if the password is correct
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        return { success: false, message: 'Incorrect password' }
      }
      // Store user session
      context.req.session.user = hashids.encode(user.id)
      return { success: true, message: 'Logged in successfully', user }
    },
    // Change the user's password
    changePassword: async (_, { oldPassword, newPassword }, context) => {
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]
      if (!userId) throw new Error('You are not logged in.')
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
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]
      if (!userId) throw new Error('You are not logged in.')
      await queryDB('UPDATE users SET coffee = ? WHERE id = ?', [link, userId])
      return { success: true, message: 'Buy Me a Coffee link updated' }
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
