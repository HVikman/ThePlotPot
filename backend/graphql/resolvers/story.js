const db = require('../../db/mysql.js')
const queryDB = require('../../db/query')
const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)
const sanitizeHtml = require('sanitize-html')


const StoryResolvers = {
  Query: {
    // Fetch a single story
    getStory: async (_, { id, chapterId }, context) => {
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]

      const story = await queryDB('SELECT * FROM stories WHERE id = ? AND deleted_at IS NULL', [id], true)

      if (!story) {
        // TODO: handle story not found
      }

      let chapter
      if (chapterId) {
        // Fetch chapter based on provided chapter id
        chapter = await queryDB('SELECT * FROM chapters WHERE id=?', [chapterId], true)
        if (!chapter){
          // TODO: handle chapter not found
        }
      } else {
        // Fetch first chapter (branch = 0)
        chapter = await queryDB('SELECT * FROM chapters WHERE storyId= ? AND branch = 0', [id], true)
      }

      if (chapter) {
        await queryDB(
          'INSERT INTO chapter_reads (chapterId, userId, viewedAt) VALUES (?, ?, CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE viewedAt = CURRENT_TIMESTAMP',
          [chapter.id, userId]
        )
      }


      return {
        ...story,
        chapters: [chapter]
      }
    },

    // Fetch all stories
    getAllStories: async () => {
      return await queryDB('SELECT * FROM stories WHERE deleted_at IS NULL')
    },
  },
  Mutation: {
    // Create a new story and its first chapter
    createStory: (_, { input }, context) => {
      return new Promise((resolve, reject) => {
        // Get user from session and decode id
        const original = hashids.decode(context.req.session.user)
        const userId = original[0]

        // Check if user is logged in
        if (!userId) {
          reject(new Error('You must be logged in to create stories.'))
          return
        }

        const { title, description, genre, firstChapterContent } = input
        //Sanitize content
        const sanitizedContent = sanitizeHtml(firstChapterContent)

        // Begin a transaction
        db.beginTransaction((error) => {
          if (error) {
            reject(error)
            return
          }
          let storyId

          // Insert story
          queryDB('INSERT INTO stories (title, description, genre, authorId) VALUES (?, ?, ?, ?)', [title, description, genre, userId])
            .then((storyResults) => {
              storyId = storyResults.insertId
              // Insert first chapter for the story
              return queryDB('INSERT INTO chapters (storyId, content, branch, authorId) VALUES (?, ?, ?, ?)', [storyId, sanitizedContent, 0, userId])
            })
            .then(() => {
              // Commit the transaction
              db.commit((err) => {
                if (err) {
                  db.rollback(() => {
                    reject(err)
                  })
                  return
                }
                resolve({
                  success: true,
                  message: 'Story and first chapter created successfully',
                  story: {
                    id: storyId,
                    title,
                    description,
                    genre,
                    authorId: userId
                  },
                })
              })
            })
            .catch((err) => {
              // Rollback the transaction in case of errors
              db.rollback(() => {
                reject(err)
              })
            })
        })
      })
    },
    // Softdelete a story and its root chapter
    deleteStory: async(_, { id }, context) => {
      // Get user from session and decode id
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]

      // Check if user is logged in
      if (!userId) {
        throw new Error('You must be logged in to delete stories.')
      }

      // Count the number of chapters associated with the story
      const chapterCountResult = await queryDB('SELECT COUNT(*) as count FROM chapters WHERE storyId = ? AND deleted_at IS NULL', [id], true)
      const chapterCount = chapterCountResult.count

      // Don't delete the story if there are more than one chapters
      if (chapterCount > 1) {
        return { success: false, message: 'Cannot delete a story with more than one chapters' }
      }

      // Softdelete the initial chapter if exists
      if (chapterCount === 1) {
        await queryDB('UPDATE chapters SET deleted_at = NOW() WHERE storyId = ?', [id])
      }

      // Softdelete the story
      const result = await queryDB('UPDATE stories SET deleted_at = NOW() WHERE id = ? AND authorId = ?', [id, userId], true)

      if (result.affectedRows) {
        return { success: true, message: 'Story and initial chapter soft-deleted successfully' }
      } else {
        return { success: false, message: 'You can only soft-delete your own stories' }
      }
    }
  },
  Story: {
    // Fetch the author of a story
    author: async (parent) => {
      const author = await queryDB('SELECT * FROM users WHERE id = ?', [parent.authorId], true)
      author.id = hashids.encode(author.id)
      return author
    },

  }
}

module.exports = StoryResolvers
