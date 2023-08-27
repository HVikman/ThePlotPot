const db = require('../../db/mysql')
const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)

const ChapterResolvers = {
  Query: {
    getChapter: async (_, { id }) => {
      const query = 'SELECT * FROM chapters WHERE id = ?'
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
        throw new Error('You must be logged in to delete stories.')
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
  }
}
module.exports = ChapterResolvers