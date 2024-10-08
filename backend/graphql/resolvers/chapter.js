const sanitizeHtml = require('sanitize-html')
const queryDB = require('../../db/query')
const { detectSpam } = require('../../utils/detectspam')
const checkCaptcha = require('../../utils/captcha.js')
const { checkLoggedIn, createUserError, validateNumber } = require('../../utils/tools.js')

const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.IDSECRET, 20)

// Define allowed HTML tags for the content field
const allowedTags = [
  'p', 'br', 'span', 'strong', 'em', 'u', 'blockquote',
  'h1', 'h2', 'h3', 'ol', 'ul', 'li', 'b', 'i', 's', 'del',
  'sup', 'sub', 'code', 'pre', 'hr', 'ins', 'mark'
]

// Define max length constants
const MAX_TITLE_LENGTH = 200
const MAX_CONTENT_LENGTH = 30000

const ChapterResolvers = {
  Query: {
    // Fetch a single chapter by ID
    getChapter: async (_, { id }) => {
      // Validate and parse the chapter ID
      const parsedId = validateNumber(id, true, 'Invalid chapter ID')

      // Fetch chapter from the database
      const chapterQuery = 'SELECT * FROM chapters WHERE id = ? AND deleted_at IS NULL'
      const chapter = await queryDB(chapterQuery, [parsedId], true)
      if (!chapter) createUserError('Chapter not found')

      // Fetch and sanitize comments for the chapter
      const commentQuery = 'SELECT * FROM comments WHERE chapterId = ? AND deletedAt IS NULL'
      const comments = await queryDB(commentQuery, [parsedId])
      chapter.comments = comments.map(comment => ({
        ...comment,
        content: sanitizeHtml(comment.content, { allowedTags }) // Sanitize comments to allow specific tags
      }))

      return chapter
    },
    getChapterChildren: async (_, { id }, context) => {
      // Validate and parse the chapter ID
      const parsedId = validateNumber(id, true, 'Invalid chapter ID')

      let IDorIP
      if (context.req.session && context.req.session.user) {
        const userId = await checkLoggedIn(context)
        IDorIP = userId.toString() // Convert User ID to string
      } else {
        let ip = context.clientIp || context.req.headers['x-forwarded-for'] || context.req.connection.remoteAddress
        if (ip === '::1' || ip === '127.0.0.1') {
          ip = 'localhost' // Handle localhost safely
        }
        IDorIP = ip
      }

      // Insert row to chapter_reads for tracking view counts
      if (IDorIP) {
        const query = 'INSERT INTO chapter_reads (chapterId, IDorIP, viewedAt) VALUES (?, ?, CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE viewedAt = CURRENT_TIMESTAMP'
        await queryDB(query, [parsedId, IDorIP])
      }

      // Fetch child chapters
      const childChaptersQuery = 'SELECT * FROM chapters WHERE parentChapterId = ? AND deleted_at IS NULL'
      const childChapters = await queryDB(childChaptersQuery, [parsedId])

      // Fetch comments for each child chapter and sanitize
      for (let childChapter of childChapters) {
        const commentQuery = 'SELECT * FROM comments WHERE chapterId = ? AND deletedAt IS NULL'
        const comments = await queryDB(commentQuery, [childChapter.id])
        childChapter.comments = comments.map(comment => ({
          ...comment,
          content: sanitizeHtml(comment.content, { allowedTags }) // Sanitize comments to allow specific tags
        }))
      }

      return childChapters
    },
    async isChapterLiked(_, { id }, context) {
      // Validate and parse the chapter ID
      const parsedId = validateNumber(id, true, 'Invalid chapter ID')

      // Get user ID from session
      const userId = await checkLoggedIn(context, false)

      const result = await queryDB('SELECT COUNT(*) as count FROM votes WHERE chapterId = ? AND userId = ?', [parsedId, userId], true)
      return result.count === 1
    }
  },
  Mutation: {
    // Create a new chapter
    createChapter: async (_, { title, content, storyId, branch, parentChapterId, token }, context) => {
      // Get user from session
      const userId = await checkLoggedIn(context)

      // Check CAPTCHA token
      await checkCaptcha(token)

      // Validate branch depth (max 10)
      if (branch >= 9) createUserError('Stories can only go 10 branches deep for now')

      // Check parent's child count (max 3 per parent)
      const countQuery = 'SELECT COUNT(*) as count FROM chapters WHERE storyId = ? AND parentChapterId = ? AND deleted_at IS NULL'
      const countResult = await queryDB(countQuery, [storyId, parentChapterId], true)
      if (countResult.count >= 3) createUserError('You can only have a maximum of 3 next chapters for a chapter.')

      // Validate input lengths
      if (title.length > MAX_TITLE_LENGTH) createUserError(`Title exceeds maximum length of ${MAX_TITLE_LENGTH} characters.`)
      if (content.length > MAX_CONTENT_LENGTH) createUserError(`Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters.`)

      // Sanitize inputs:
      // Remove all tags and attributes from title
      const sanitizedTitle = sanitizeHtml(title, { allowedTags: [] })
      // Only allow specified tags (no attributes) in the content
      const sanitizedContent = sanitizeHtml(content, {
        allowedTags: allowedTags,
        allowedAttributes: {} // No attributes allowed
      })

      // Run spam detection on the content and title
      await detectSpam(context, sanitizedContent, 'forum-post')
      await detectSpam(context, sanitizedTitle, 'forum-post', true)

      // Insert the new chapter into the database
      const insertQuery = 'INSERT INTO chapters (title, content, storyId, branch, parentChapterId, authorId) VALUES (?, ?, ?, ?, ?, ?)'
      const results = await queryDB(insertQuery, [sanitizedTitle, sanitizedContent, storyId, branch, parentChapterId, userId])

      // Fetch the newly created chapter
      const selectQuery = 'SELECT * FROM chapters WHERE id = ?'
      const chapter = await queryDB(selectQuery, [results.insertId], true)

      // Fetch and sanitize comments for the newly created chapter
      const commentQuery = 'SELECT * FROM comments WHERE chapterId = ? AND deletedAt IS NULL'
      const comments = await queryDB(commentQuery, [results.insertId])
      chapter.comments = comments.map(comment => ({
        ...comment,
        content: sanitizeHtml(comment.content, { allowedTags }) // Sanitize comments
      }))

      return chapter
    },
    // Soft-delete a chapter
    deleteChapter: async (_, { id }, context) => {
      // Validate and parse the chapter ID
      const parsedId = validateNumber(id, true, 'Invalid chapter ID')

      // Get user from session
      const userId = await checkLoggedIn(context)

      // Fetch chapter details
      const query = 'SELECT * FROM chapters WHERE id = ? AND deleted_at IS NULL'
      const chapter = await queryDB(query, [parsedId], true)

      // Validation: User must be the chapter's author
      if (userId !== chapter.authorId && !context.req.session.admin) throw new Error('This is someone else\'s chapter')

      // Check if chapter has any children
      const countQuery = 'SELECT COUNT(*) as count FROM chapters WHERE parentChapterId = ?'
      const countResult = await queryDB(countQuery, [parsedId], true)

      // Validation: Chapter should not have children
      if (countResult.count > 0) createUserError('You can\'t delete a chapter that has children')

      // Mark the chapter as deleted
      const deleteQuery = 'UPDATE chapters SET deleted_at = NOW() WHERE id = ?'
      await queryDB(deleteQuery, [parsedId], true)

      // Mark comments as deleted
      const commentQuery = 'CALL DeleteComments(?)'
      await queryDB(commentQuery, [parsedId], true)

      return { success: true, message: 'Deleted chapter' }
    },
    async likeChapter(_, { id }, context) {
      // Validate and parse the chapter ID
      const parsedId = validateNumber(id, true, 'Invalid chapter ID')

      // Get user from session
      const userId = await checkLoggedIn(context)

      try {
        // Insert a new record into the votes table
        await queryDB('INSERT INTO votes (chapterId, userId) VALUES (?, ?)', [parsedId, userId])
        return { success: true, message: 'Like added' }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },
    async unlikeChapter(_, { id }, context) {
      // Validate and parse the chapter ID
      const parsedId = validateNumber(id, true, 'Invalid chapter ID')

      // Get user from session
      const userId = await checkLoggedIn(context)

      try {
        // Remove the record from the votes table
        await queryDB('DELETE FROM votes WHERE chapterId = ? AND userId = ?', [parsedId, userId])
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
    }
  }
}

module.exports = ChapterResolvers
