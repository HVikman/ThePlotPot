const db = require('../../db/mysql')

const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)

const StoryResolvers = {
  Query: {
    getStory: async (_, { id }) => {
      const query = 'SELECT * FROM stories WHERE id = ?'
      const result = await new Promise((resolve, reject) => {
        db.query(query, [id], (error, results) => {
          if (error) reject(error)
          resolve(results[0])
        })
      })

      return result
    },

    getAllStories: async () => {
      const query = 'SELECT * FROM stories'
      const results = await new Promise((resolve, reject) => {
        db.query(query, (error, results) => {
          if (error) reject(error)
          resolve(results)
        })
      })

      return results
    }
  },

  Mutation: {
    createStory: async (_, { title },context) => {
      console.log(context.req.session.user)
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]
      if (!userId) {
        throw new Error('You must be logged in to create a story.')
      }

      const insertQuery = 'INSERT INTO stories (title, authorId) VALUES (?, ?)'

      const result = await new Promise((resolve, reject) => {
        db.query(insertQuery, [title, userId], (error, results) => {
          if (error) reject(error)

          const selectQuery = 'SELECT * FROM stories WHERE id = ?'
          db.query(selectQuery, [results.insertId], (error, storyResults) => {
            if (error) reject(error)
            resolve(storyResults[0])
          })
        })
      })

      return result
    },

    deleteStory: async (_, { id }, context) => {
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]
      if (!userId) {
        throw new Error('You must be logged in to delete stories.')
      }
      const query = 'delete FROM stories WHERE id = ? and authorId=?'
      const result = await new Promise((resolve, reject) => {
        db.query(query, [id,userId], (error, results) => {
          if (error) reject(error)
          console.log(results)
          resolve(results)
        })
      })

      return { 'success' : !!result.affectedRows }
    }
  },

  Story: {

    author: async (parent) => {
      const selectQuery = 'SELECT * FROM users WHERE id= ?'

      const author = await new Promise((resolve, reject) => {
        db.query(selectQuery, [parent.authorId], (error, results) => {
          if (error) reject(error)
          resolve(results[0])
        })
      })
      return author
    }
  }
}

module.exports = StoryResolvers
