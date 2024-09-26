const striptags = require('striptags')
const { createUserError } = require('./tools.js')
const spamcheck = require('spam-detection')

function containsUrlsOrEmails(text) {
  // match URLs
  const urlRegex = /(?:(?:https?|ftp):\/\/|www\.)[^\s/$.?#].[^\s]*/gi
  // match email addresses
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi

  return urlRegex.test(text) || emailRegex.test(text)
}

const detectSpam = (context, content, type, isHtml = false) => {
  console.log(context.ip) //For future use

  if (isHtml) {
    content = striptags(content)
  }

  if (containsUrlsOrEmails(content)) {
    throw createUserError('Spam detected: content contains URLs or email addresses.')
  }

  try {
    const result = spamcheck.detect(content) // returns 'spam' or 'ham'
    if (result === 'spam') {
      throw createUserError('Spam detected by content analysis.')
    }
  } catch (err) {
    console.error('Error:', err.message)
    throw new Error('Unable to check for spam at this time.')
  }
}

module.exports = {
  detectSpam,
}
