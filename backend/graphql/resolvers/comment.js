const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)
const queryDB = require('../../db/query')
const { detectSpam } = require('../../utils/detectspam')
const crypto = require('crypto')
const checkCaptcha = require('../../utils/captcha.js')
const { checkLoggedIn, createUserError, validateNumber } = require('../../utils/tools.js')
const sanitizeHtml = require('sanitize-html')

// Define max length constants
const MAX_COMMENT_LENGTH = 5000

const CommentResolvers = {
  Mutation: {
    // Add a new comment
    async addComment(_, { input, token }, context) {
      // Check if user is logged in
      const userId = await checkLoggedIn(context)

      // Check CAPTCHA token
      await checkCaptcha(token)

      // Run spam detection on the content
      await detectSpam(context, input.content, 'comment')

      try {
        // Validate and sanitize inputs
        const { chapterId, content } = input
        const parsedChapterId = validateNumber(chapterId, true, 'Invalid chapter ID')

        // Check if the content exceeds the maximum allowed length
        if (content.length > MAX_COMMENT_LENGTH) {
          createUserError(`Comment exceeds maximum length of ${MAX_COMMENT_LENGTH} characters.`)
        }

        // Sanitize the comment content
        const sanitizedContent = sanitizeHtml(content)

        // Insert the new comment into the database
        const insertQuery = `
          INSERT INTO comments (chapterId, userId, content) VALUES (?, ?, ?)
        `
        const insertParams = [parsedChapterId, userId, sanitizedContent]
        const insertResult = await queryDB(insertQuery, insertParams)

        if (insertResult.affectedRows > 0) {
          // Fetch the newly added comment
          const fetchQuery = 'SELECT * FROM comments WHERE id = ?'
          const comment = await queryDB(fetchQuery, [insertResult.insertId])

          if (comment && comment.length > 0) {
            return comment[0]
          } else {
            createUserError('Comment added but could not fetch it.')
          }
        } else {
          createUserError('Failed to add comment.')
        }
      } catch (error) {
        console.error('Error while adding comment:', error.message)
        createUserError('Unable to add comment. Please try again later.')
      }
    },

    // Soft-delete a comment
    async deleteComment(_, { commentId }, context) {
      // Check if the user is logged in
      const userId = await checkLoggedIn(context)

      // Fetch the comment details
      const query = 'SELECT * FROM comments WHERE id = ? AND deletedAt IS NULL'
      const comment = await queryDB(query, [commentId], true)

      // Ensure the user is either the comment's author or an admin
      if (userId !== comment.userId && !context.req.session.admin) {
        createUserError('This is someone else\'s comment')
      }

      try {
        // Soft-delete the comment by updating the `deletedAt` timestamp
        const deleteQuery = `
          UPDATE comments SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?
        `
        const params = [commentId]
        const result = await queryDB(deleteQuery, params)

        if (result.affectedRows > 0) {
          return {
            success: true,
            message: 'Comment deleted successfully'
          }
        } else {
          createUserError('Failed to delete comment.')
        }
      } catch (error) {
        console.error('Error while deleting comment:', error.message)
        createUserError('Unable to delete comment. Please try again later.')
      }
    }
  },
  Comment: {
    // Fetch the author of a comment
    user: async (parent) => {
      const user = await queryDB('SELECT * FROM users WHERE id = ?', [parent.userId], true)

      // Hash the user's email for privacy reasons
      user.email = crypto.createHash('sha256').update(user.email.trim().toLowerCase()).digest('hex')

      // Encode the user's ID
      user.id = hashids.encode(user.id)

      return user
    },
  }
}

module.exports = CommentResolvers
