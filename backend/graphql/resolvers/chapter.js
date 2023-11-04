const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)
const sanitizeHtml = require('sanitize-html')
const queryDB = require('../../db/query')
const { detectSpam } = require('../../utils/detectspam')

const ChapterResolvers = {
  Query: {
    // Fetch a single chapter by ID
    getChapter: async (_, { id }) => {
      // Fetch chapter
      const chapterQuery = 'SELECT * FROM chapters WHERE id = ? AND deleted_at IS NULL'
      const chapter = await queryDB(chapterQuery, [id], true)

      // Fetch comments for the chapter
      const commentQuery = 'SELECT * FROM comments WHERE chapterId = ? AND deletedAt IS NULL'
      const comments = await queryDB(commentQuery, [id])

      // Append comments to the chapter
      chapter.comments = comments
      return chapter
    },
    getChapterChildren: async (_, { id }, context) => {
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]

      // Insert row to chapter_reads to add a read count
      await queryDB(
        'INSERT INTO chapter_reads (chapterId, userId, viewedAt) VALUES (?, ?, CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE viewedAt = CURRENT_TIMESTAMP',
        [id, userId]
      )

      // Fetch child chapters
      const childChaptersQuery = 'SELECT * FROM chapters WHERE parentChapterId = ? AND deleted_at IS NULL'
      const childChapters = await queryDB(childChaptersQuery, [id])

      // Fetch comments for each child chapter and append to them
      for (let childChapter of childChapters) {
        const commentQuery = 'SELECT * FROM comments WHERE chapterId = ? AND deletedAt IS NULL'
        const comments = await queryDB(commentQuery, [childChapter.id])
        childChapter.comments = comments
      }

      return childChapters
    },
    async isChapterLiked(_, { id }, context) {
      // Get user from session and decode id
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]
      const result = await queryDB('SELECT COUNT(*) as count FROM votes WHERE chapterId = ? AND userId = ? ', [id, userId], true)
      if (result.count === 1){return true} else {return false}

    }
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

      if (detectSpam(title)) {
        throw new Error('Spam detected in title')
      }

      if (detectSpam(sanitizedContent, true)) {
        throw new Error('Spam detected in content')
      }


      // Insert the new chapter into the database
      const insertQuery = 'INSERT INTO chapters (title, content, storyId, branch, parentChapterId, authorId) VALUES (?, ?, ?, ?, ?, ?)'
      const results = await queryDB(insertQuery, [title, sanitizedContent, storyId, branch, parentChapterId, userId])

      // Fetch the newly created chapter
      const selectQuery = 'SELECT * FROM chapters WHERE id = ?'
      const chapter = await queryDB(selectQuery, [results.insertId], true)

      const commentQuery = 'SELECT * FROM comments WHERE chapterId = ? AND deletedAt IS NULL'
      const comments = await queryDB(commentQuery, [results.insertId])

      // Append comments to the chapter
      chapter.comments = comments
      return chapter
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

      //Mark comments as deleted
      const commentQuery = 'Call DeleteComments(?)'
      await queryDB(commentQuery, [id], true)


      return { success: true, message: 'Deleted chapter' }
    },
    async likeChapter(_, { id }, context) {
      // Get user from session and decode id
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]
      console.log(id)
      try {
        // Insert a new record into the votes table.
        await queryDB('INSERT INTO votes (chapterId, userId) VALUES (?, ?)', [id, userId])
        return { success: true, message: 'Like added' }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },
    async unlikeChapter(_, { id }, context) {
      // Get user from session and decode id
      const original = hashids.decode(context.req.session.user)
      const userId = original[0]
      try {
        // Remove the record from the votes table.
        await queryDB('DELETE FROM votes WHERE chapterId = ? AND userId = ?', [id, userId])
        return { success: true, message: 'Like removed' }
      } catch (error) {
        return { success: false, message: 'Couldn\'t unlike chapter' }
      }
    }
  },
  Chapter: {
    // Fetch author details
    author: async (parent) => {
      const selectQuery = 'SELECT * FROM users WHERE id = ?'
      const author = await queryDB(selectQuery, [parent.authorId], true)
      author.id = hashids.encode(author.id)
      return author
    },
    story: async (parent) => {
      const storyId = parent.storyId
      return await queryDB('SELECT * FROM stories WHERE id = ?', [storyId], true)
    },
  }
}

module.exports = ChapterResolvers

