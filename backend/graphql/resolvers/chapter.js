const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)
const sanitizeHtml = require('sanitize-html')
const queryDB = require('../../db/query')


const ChapterResolvers = {
  Query: {
    // Fetch a single chapter by ID
    getChapter: async (_, { id }) => {
      const query = 'SELECT * FROM chapters WHERE id = ? AND deleted_at IS NULL'
      return await queryDB(query, [id], true)
    },
    // Fetch child chapters of a chapter by ID
    getChapterChildren: async (_, { id }) => {
      const query = 'SELECT * FROM chapters WHERE parentChapterId = ? AND deleted_at IS NULL'
      return await queryDB(query, [id])
    },
  },
  Mutation: {
    // Create a new chapter
    createChapter: async (_, { title, content, storyId, branch, parentChapterId }, context) => {
      // Get user from session and decode id
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]

      // Validation: User must be logged in
      if (!userId) throw new Error('You must be logged in to create chapters.')

      // Validation: Only 10 branches allowed(counting from 0)
      // This limits story length, at 10 branches story max size is around 29600 chapters
      if (branch >= 9) throw new Error('Stories can only go 10 branches deep for now')

      // Check parent's child count
      // Only 3 chapters per parent allowed
      const countQuery = 'SELECT COUNT(*) as count FROM chapters WHERE storyId = ? AND parentChapterId = ? AND deleted_at IS NULL'
      const countResult = await queryDB(countQuery, [storyId, parentChapterId], true)

      if (countResult.count >= 3) throw new Error('You can only have a maximum of 3 next chapters for chapter.')

      // Sanitize content before insertion
      const sanitizedContent = sanitizeHtml(content)

      // Insert the new chapter into the database
      const insertQuery = 'INSERT INTO chapters (title, content, storyId, branch, parentChapterId, authorId) VALUES (?, ?, ?, ?, ?, ?)'
      const results = await queryDB(insertQuery, [title, sanitizedContent, storyId, branch, parentChapterId, userId])

      // Fetch the newly created chapter
      const selectQuery = 'SELECT * FROM chapters WHERE id = ?'
      return await queryDB(selectQuery, [results.insertId], true)
    },
    // Soft-delete a chapter
    deleteChapter: async (_, { id }, context) => {
      // Get user from session and decode id
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]

      // Validation: User must be logged in
      if (!userId) throw new Error('You must be logged in to create chapters.')

      // Fetch chapter details
      const query = 'SELECT * FROM chapters WHERE id = ? AND deleted_at IS NULL'
      const chapter = await queryDB(query, [id], true)

      // Validation: User must be the chapter's author
      if (userId !== chapter.authorId) throw new Error('This is someone else\'s chapter')

      // Check if chapter has any children
      const countQuery = 'SELECT COUNT(*) as count FROM chapters WHERE parentChapterId = ?'
      const countResult = await queryDB(countQuery, [id], true)

      // Validation: Chapter should not have children
      if (countResult.count > 0) throw new Error('You can\'t delete a chapter that has children')

      // Mark as deleted
      const deleteQuery = 'UPDATE chapters SET deleted_at = NOW() WHERE id = ?'
      await queryDB(deleteQuery, [id], true)

      return { success: true, message: 'Deleted chapter' }
    }
  },
  Chapter: {
    // Fetch author details
    author: async (parent) => {
      const selectQuery = 'SELECT * FROM users WHERE id = ?'
      return await queryDB(selectQuery, [parent.authorId], true)
    },
  }
}

module.exports = ChapterResolvers

