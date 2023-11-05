
const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)
const queryDB = require('../../db/query')
const { detectSpam } = require('../../utils/detectspam')
const crypto = require('crypto')

const CommentResolvers = {
  Mutation: {
    async addComment(_, { input }, context) {
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]

      if (!userId) throw new Error('You must be logged in to create comments.')
      if (detectSpam(input.content)) {
        throw new Error('Spam detected')
      }

      try {
        const { chapterId, content } = input
        const insertQuery = `
            INSERT INTO comments (chapterId, userId, content) VALUES (?, ?, ?)
        `
        const insertParams = [chapterId, userId, content]
        const insertResult = await queryDB(insertQuery, insertParams)

        if (insertResult.affectedRows > 0) {
          const fetchQuery = 'SELECT * FROM comments WHERE id = ?'
          const comment = await queryDB(fetchQuery, [insertResult.insertId])

          if (comment && comment.length > 0) {
            return comment[0]
          } else {
            throw new Error('Comment added but could not fetch it.')
          }
        } else {
          throw new Error('Failed to add comment.')
        }
      } catch (error) {
        console.error('Error while adding comment:', error.message)
        throw new Error('Unable to add comment. Please try again later.')
      }
    },
    async editComment(_, { commentId, content }) {
      try {
        const query = `
            UPDATE comments SET content = ? WHERE id = ?
          `
        const params = [content, commentId]
        const result = await queryDB(query, params)

        if (result.affectedRows > 0) {
          return {
            success: true,
            message: 'Comment edited successfully'
          }
        } else {
          throw new Error('Failed to edit comment.')
        }
      } catch (error) {
        console.error('Error while editing comment:', error.message)
        throw new Error('Unable to edit comment. Please try again later.')
      }
    },

    async deleteComment(_, { commentId }, context) {
      // Get user from session and decode id
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]

      // Validation: User must be logged in
      if (!userId) throw new Error('You must be logged in to delete.')

      // Fetch chapter details
      const query = 'SELECT * FROM comments WHERE id = ? AND deletedAt IS NULL'
      const comment = await queryDB(query, [commentId], true)
      if (userId !== comment.userId) throw new Error('This is someone else\'s comment')

      try {
        const query = `
            UPDATE comments SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?
          `
        const params = [commentId]
        const result = await queryDB(query, params)

        if (result.affectedRows > 0) {
          return {
            success: true,
            message: 'Comment deleted successfully'
          }
        } else {
          throw new Error('Failed to delete comment.')
        }
      } catch (error) {
        console.error('Error while deleting comment:', error.message)
        throw new Error('Unable to delete comment. Please try again later.')
      }
    }
  },
  Comment: {


    // Fetch the author of a comment
    user: async (parent) => {
      console.log(parent)
      const user = await queryDB('SELECT * FROM users WHERE id = ?', [parent.userId], true)
      user.email = crypto.createHash('sha256').update(user.email.trim().toLowerCase()).digest('hex')
      user.id = hashids.encode(user.id)
      return user
    },
  }
}

module.exports = CommentResolvers