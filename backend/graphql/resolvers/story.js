const db = require('../../db/mysql.js')
const queryDB = require('../../db/query')
const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)
const sanitizeHtml = require('sanitize-html')
const { detectSpam } = require('../../utils/detectspam')
const checkCaptcha  = require('../../utils/captcha')

const StoryResolvers = {
  Query: {
    // Fetch a single story
    getStory: async (_, { id, chapterId }, context) => {
      const story = await queryDB('SELECT * FROM stories WHERE id = ? AND deleted_at IS NULL', [id], true)

      if (!story) {
        throw new Error('Story not found')
      }

      let chapter
      if (chapterId) {
        // Fetch chapter based on provided chapter id
        chapter = await queryDB('SELECT * FROM chapters WHERE id=? AND deleted_at IS NULL', [chapterId], true)
        if (!chapter) {
          // TODO: handle chapter not found
        }
      } else {
        // Fetch first chapter (branch = 0)
        chapter = await queryDB('SELECT * FROM chapters WHERE storyId= ? AND branch = 0', [id], true)
      }

      if (chapter) {
        // Fetch comments for the chapter
        const comments = await queryDB('SELECT * FROM comments WHERE chapterId = ? AND deletedAt IS NULL', [chapter.id])
        chapter.comments = comments

        let IDorIP

        if (context.req.session && context.req.session.user) {
          // Decode the user ID from the session
          const original = hashids.decode(context.req.session.user)
          IDorIP = original[0].toString() // Convert User ID to a string
          console.log('Logged in user ID:', IDorIP)
        } else {
          // User is not logged in, use their IP address
          IDorIP = context.req.ip
          console.log('Unauthenticated user IP:', IDorIP)
        }
        // Insert row to chapter_reads to add a read count
        if(IDorIP){
          const query = 'INSERT INTO chapter_reads (chapterId, IDorIP, viewedAt)VALUES (?, ?, CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE viewedAt = CURRENT_TIMESTAMP'
          await queryDB(query, [chapter.id, IDorIP])}
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
    createStory: async (_, { input, token }, context) => {
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]
      if (!userId) {
        throw new Error('You must be logged in to create stories.')
      }

      //Check captcha
      const bot = await checkCaptcha(token)
      if (bot) {
        throw new Error('Captcha failed')
      }
      console.log(token)
      const { title, description, genre, firstChapterContent } = input

      //Sanitize content
      const sanitizedContent = sanitizeHtml(firstChapterContent)

      //Check for spam and throw error if spam
      const isTitleSpam = await detectSpam(context, firstChapterContent, 'forum-post')
      const isContentSpam = await detectSpam(context, title, 'forum-post', true)
      const isDescriptionSpam = await detectSpam(context, description, 'forum-post')

      if(isTitleSpam || isContentSpam || isDescriptionSpam) {
        throw new Error('Spam detected')
      }

      return new Promise((resolve, reject) => {
        // Obtain a connection from the pool
        db.getConnection((connError, connection) => {
          if (connError) {
            reject(connError)
            return
          }

          // Begin a transaction on the connection
          connection.beginTransaction((error) => {
            if (error) {
              connection.release()
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
                connection.commit((commitError) => {
                  if (commitError) {
                    connection.rollback(() => {
                      connection.release()
                      reject(commitError)
                    })
                    return
                  }
                  connection.release()
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
              .catch((transactionError) => {
                // Rollback the transaction in case of errors
                connection.rollback(() => {
                  connection.release()
                  reject(transactionError)
                })
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

      //find chapter id

      const chapter = await queryDB('SELECT * FROM chapters WHERE storyId = ?', [id],true)
      console.log(chapter.id)
      //Mark comments as deleted
      const res = await queryDB('Call DeleteComments(?)', [chapter.id])
      console.log(res)

      // Softdelete the initial chapter if exists
      if (chapterCount === 1) {
        await queryDB('UPDATE chapters SET deleted_at = NOW() WHERE storyId = ?', [id])
      }

      // Softdelete the story
      await queryDB('UPDATE stories SET deleted_at = NOW() WHERE id = ? AND authorId = ?', [id, userId], true)
      const result = await queryDB('SELECT COUNT(*) as count FROM stories WHERE id = ? AND deleted_at IS NOT NULL ', [id],true)
      console.log(result)
      if (result.count === 1) {
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
