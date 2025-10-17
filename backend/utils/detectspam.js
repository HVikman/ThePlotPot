const striptags = require('striptags')
const { createUserError } = require('./tools.js')

function containsUrlsOrEmails(text) {
  // match URLs
  const urlRegex = /(?:(?:https?|ftp):\/\/|www\.)[^\s/$.?#].[^\s]*/gi
  // match email addresses
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi

  return urlRegex.test(text) || emailRegex.test(text)
}

const detectSpam = (context, content, type, isHtml = false) => {
  console.log(context.ip, type) //For future use

  if (isHtml) {
    content = striptags(content)
  }

  if (containsUrlsOrEmails(content)) {
    throw createUserError('Spam detected: content contains URLs or email addresses.')
  }

}

module.exports = {
  detectSpam,
}
