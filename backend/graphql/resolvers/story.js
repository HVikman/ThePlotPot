const db = require('../../db/mysql')

const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)

const sanitizeHtml = require('sanitize-html')

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
    async createStory(_, { input }, context) {
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]
      if (!userId) {
        throw new Error('You must be logged in to delete stories.')
      }

      const { title, description, genre, firstChapterContent } = input

      const sanitizedContent = sanitizeHtml(firstChapterContent)

      return new Promise((resolve, reject) => {
        // Start a transaction
        db.beginTransaction(async (error) => {
          if (error) reject(error)

          try {
            let insertStoryQuery = 'INSERT INTO stories (title, description, genre, authorId) VALUES (?, ?, ?, ?)'
            const [storyResults] = await db.promise().query(insertStoryQuery, [title, description, genre, userId])
            const storyId = storyResults.insertId

            let insertChapterQuery = 'INSERT INTO chapters (storyId, content, branch, authorId) VALUES (?, ?, ?, ?)'
            await db.promise().query(insertChapterQuery, [storyId, sanitizedContent, 0, userId])

            db.commit((err) => {
              if (err) {
                db.rollback(() => {
                  reject(err)
                })
              }
              resolve({
                success: true,
                message: 'Story and first chapter created successfully',
                story: {
                  id: storyId,
                  title,
                  description,
                  genre,
                },
              })
            })
          } catch (err) {
            db.rollback(() => {
              reject(err)
            })
          }
        })
      })
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
    },
    chapters: async (parent) => {
      const storyId = parent.id
      const selectQuery = 'SELECT * FROM chapters WHERE storyId = ?'

      const chapters = await new Promise((resolve, reject) => {
        db.query(selectQuery, [storyId], (error, results) => {
          if (error) reject(error)
          resolve(results)
        })
      })
      return chapters
    }
  }
}

module.exports = StoryResolvers
