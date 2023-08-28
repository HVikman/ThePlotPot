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
      console.log(user.email)
      user.email = require('crypto').createHash('md5').update(user.email).digest('hex')
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
    },
    me: async (_, args, context) => {
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]
      if (!userId) {
        throw new Error('You are not logged in.')
      }
      const selectQuery = 'SELECT * FROM users WHERE id = ?'

      const user = await new Promise((resolve, reject) => {
        db.query(selectQuery, [userId], (error, results) => {
          if (error) reject(error)
          resolve(results[0])
        })
      })

      return user
    }
  },
  Mutation: {
    createUser: async (_, { username, password, email },context) => {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const selectQuery = 'SELECT * FROM users WHERE email = ?'
      const user = await new Promise((resolve, reject) => {
        db.query(selectQuery, [email], (error, results) => {
          if (error) reject(error)
          resolve(results[0])
        })
      })

      if(user){
        return {
          success: false,
          message: 'email already in use'
        }
      }

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

      context.req.session.user = hashids.encode(result.id)

      return {
        success: true,
        message: 'sign up successful',
        user: result
      }
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
      console.log(context.req.session.user)
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