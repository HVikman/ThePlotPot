const db = require('../../db/mysql')
const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)

const ChapterResolvers = {
  Query: {
    getChapter: async (_, { id }) => {
      const query = 'SELECT * FROM chapters WHERE id = ? AND deleted_at IS NULL'
      const result = await new Promise((resolve, reject) => {
        db.query(query, [id], (error, results) => {
          if (error) reject(error)
          resolve(results[0])
        })
      })

      return result
    }

  },
  Mutation: {

    createChapter: async (_, { title, content, storyId, branch, parentChapterId },context) => {
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]
      if (!userId) {
        throw new Error('You must be logged in to create chapters.')
      }
      if (branch >= 10) {
        throw new Error('Stories can only go 10 branches deep for now')
      }
      const countQuery = 'SELECT COUNT(*) as count FROM chapters WHERE storyId = ? AND branch = ? AND deleted_at IS NULL'
      const countResult = await new Promise((resolve, reject) => {
        db.query(countQuery, [storyId, branch], (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result[0])
          }
        })
      })

      if (countResult.count >= 3) {
        throw new Error('You can only have a maximum of 3 chapters for the same branch in a story.')
      }

      const insertQuery = 'INSERT INTO chapters (title, content, storyId, branch, parentChapterId, authorId) VALUES (?, ?, ?, ?, ?, ?)'

      const result = await new Promise((resolve, reject) => {
        db.query(insertQuery, [title, content, storyId, branch, parentChapterId, userId], (error, results) => {
          if (error) reject(error)
          const selectQuery = 'SELECT * FROM chapters WHERE id = ?'
          db.query(selectQuery, [results.insertId], (error, chapterResults) => {
            if (error) reject(error)
            resolve(chapterResults[0])
          })
        })
      })

      return result
    }
  },
  Chapter: {

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
  }
}
module.exports = ChapterResolvers