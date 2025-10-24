const db = require('../../db/mysql.js')
const queryDB = require('../../db/query')
const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)
const sanitizeHtml = require('sanitize-html')
const { detectSpam } = require('../../utils/detectspam')
const checkCaptcha  = require('../../utils/captcha.js')
const { checkLoggedIn, createUserError, validateNumber } = require('../../utils/tools.js')

// Define allowed HTML tags for the content field
const allowedTags = [
  'p', 'br', 'span', 'strong', 'em', 'u', 'blockquote',
  'h1', 'h2', 'h3', 'ol', 'ul', 'li', 'b', 'i', 's', 'del',
  'sup', 'sub', 'code', 'pre', 'hr', 'ins', 'mark'
]

// Define max length constants
const MAX_TITLE_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 1000
const MAX_GENRE_LENGTH = 50
const MAX_CONTENT_LENGTH = 30000 // 30k characters including HTML tags

const StoryResolvers = {
  Query: {
    // Fetch a single story
    getStory: async (_, { id, chapterId }) => {
      const parsedStoryId = validateNumber(id, true, 'Invalid story ID')

      const story = await queryDB('SELECT * FROM stories WHERE id = ? AND deleted_at IS NULL', [parsedStoryId], true)

      if (!story) {
        createUserError('Story not found')
      }

      const { chapterCount: total_chapters } = await queryDB('SELECT COUNT(*) AS chapterCount FROM chapters WHERE storyId = ? AND deleted_at IS NULL', [parsedStoryId], true)
      
      let chapter
      if (chapterId) {
        const parsedChapterId = validateNumber(chapterId, true, 'Invalid chapter ID')

        chapter = await queryDB('SELECT * FROM chapters WHERE id = ? AND deleted_at IS NULL', [parsedChapterId], true)
        if (!chapter) {
          createUserError('Chapter not found')
        }
      } else {
        chapter = await queryDB('SELECT * FROM chapters WHERE storyId= ? AND branch = 0', [parsedStoryId], true)
      }

      if (chapter) {
        const comments = await queryDB('SELECT * FROM comments WHERE chapterId = ? AND deletedAt IS NULL', [chapter.id])
        chapter.comments = comments

      }

      return {
        ...story,
        chapters: [chapter],
        total_chapters: total_chapters
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
      const userId = await checkLoggedIn(context)

      // Check captcha
      await checkCaptcha(token)

      const { title, description, genre, firstChapterContent } = input

      // Validate input lengths
      if (title.length > MAX_TITLE_LENGTH) createUserError(`Title exceeds maximum length of ${MAX_TITLE_LENGTH} characters.`)
      if (description.length > MAX_DESCRIPTION_LENGTH) createUserError(`Description exceeds maximum length of ${MAX_DESCRIPTION_LENGTH} characters.`)
      if (genre.length > MAX_GENRE_LENGTH) createUserError(`Genre exceeds maximum length of ${MAX_GENRE_LENGTH} characters.`)
      if (firstChapterContent.length > MAX_CONTENT_LENGTH) createUserError(`Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters.`)

      // Sanitize inputs:
      // Remove all tags and attributes from title and description
      const sanitizedTitle = sanitizeHtml(title, { allowedTags: [] })
      const sanitizedDescription = sanitizeHtml(description, { allowedTags: [] })

      // Only allow specified tags (no attributes) in the content
      const sanitizedContent = sanitizeHtml(firstChapterContent, {
        allowedTags: allowedTags,
        allowedAttributes: {} // No attributes allowed
      })

      // Check for spam
      await detectSpam(context, sanitizedContent, 'forum-post')
      await detectSpam(context, sanitizedTitle, 'forum-post', true)
      await detectSpam(context, sanitizedDescription, 'forum-post')

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
            queryDB('INSERT INTO stories (title, description, genre, authorId) VALUES (?, ?, ?, ?)', [sanitizedTitle, sanitizedDescription, genre, userId])
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
                      title: sanitizedTitle,
                      description: sanitizedDescription,
                      genre,
                      authorId: userId
                    },
                  })
                })
              })
              .catch((transactionError) => {
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
      const userId = await checkLoggedIn(context)

      const parsedStoryId = validateNumber(id, true, 'Invalid story ID')

      // Count the number of chapters associated with the story
      const chapterCountResult = await queryDB('SELECT COUNT(*) as count FROM chapters WHERE storyId = ? AND deleted_at IS NULL', [parsedStoryId], true)
      const chapterCount = chapterCountResult.count

      const story = await queryDB('SELECT * FROM stories WHERE id = ?', [parsedStoryId], true)
      if (userId !== story.authorId && !context.req.session.admin) createUserError('This is someone else\'s story')

      if (chapterCount > 1) {
        return { success: false, message: 'Cannot delete a story with more than one chapters' }
      }

      const chapter = await queryDB('SELECT * FROM chapters WHERE storyId = ?', [parsedStoryId], true)
      const res = await queryDB('Call DeleteComments(?)', [chapter.id])
      console.log(res)
      if (chapterCount === 1) {
        await queryDB('UPDATE chapters SET deleted_at = NOW() WHERE storyId = ?', [parsedStoryId])
      }

      await queryDB('UPDATE stories SET deleted_at = NOW() WHERE id = ? AND authorId = ?', [parsedStoryId, userId], true)
      const result = await queryDB('SELECT COUNT(*) as count FROM stories WHERE id = ? AND deleted_at IS NOT NULL', [parsedStoryId], true)
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