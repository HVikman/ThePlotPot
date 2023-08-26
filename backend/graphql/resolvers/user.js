const bcrypt = require('bcrypt')
const db = require('../../db/mysql')

const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)

const UserResolvers = {
  Query: {
    getUser: async (_, { id }) => {
      const selectQuery = 'SELECT * FROM users WHERE id = ?'
      const user = await new Promise((resolve, reject) => {
        db.query(selectQuery, [id], (error, results) => {
          if (error) reject(error)
          resolve(results[0])
        })
      })
      return user
    },
    getAllUsers: async () => {
      const selectQuery = 'SELECT * FROM users'
      const users = await new Promise((resolve, reject) => {
        db.query(selectQuery, (error, results) => {
          if (error) reject(error)
          resolve(results)
        })
      })
      return users
    }
  },
  Mutation: {
    createUser: async (_, { username, password, email }) => {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const insertQuery = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)'

      const result = await new Promise((resolve, reject) => {
        db.query(insertQuery, [username, hashedPassword, email], (error, results) => {
          if (error) reject(error)
          const selectQuery = 'SELECT * FROM users WHERE id = ?'
          db.query(selectQuery, [results.insertId], (error, userResults) => {
            if (error) reject(error)
            resolve(userResults[0])
          })
        })
      })

      return result
    },

    login: async (_, { email, password }, context) => {
      const selectQuery = 'SELECT * FROM users WHERE email = ?'
      const user = await new Promise((resolve, reject) => {
        db.query(selectQuery, [email], (error, results) => {
          if (error) reject(error)
          resolve(results[0])
        })
      })

      if (!user) {
        return {
          success: false,
          message: 'email doesn\'t exist.'
        }
      }

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        return {
          success: false,
          message: 'Incorrect password.'
        }
      }

      context.req.session.user = hashids.encode(user.id)

      return {
        success: true,
        message: 'Logged in successfully',
        user
      }
    },

    logout: (_, __, context) => {
      return new Promise((resolve) => {
        context.req.session.destroy((err) => {
          if (err) {
            resolve({
              success: false,
              message: 'Failed to logout.'
            })
            return
          }

          context.res.clearCookie('plotpot_sid')
          resolve({
            success: true,
            message: 'Logged out successfully.'
          })
        })
      })
    }
  },
  User: {
    stories: async (parent) => {

      const userId = parent.id
      const selectQuery = 'SELECT * FROM stories WHERE authorId = ?'

      const stories = await new Promise((resolve, reject) => {
        db.query(selectQuery, [userId], (error, results) => {
          if (error) reject(error)
          resolve(results)
        })
      })
      return stories
    }
  }
}

module.exports = UserResolvers