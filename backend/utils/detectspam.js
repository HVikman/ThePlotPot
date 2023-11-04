const striptags = require('striptags')

function detectSpam(content, isHTML = false) {
  if (isHTML) {
    // Strip HTML tags for chapters or any HTML content
    content = striptags(content)
  }

  if ( isHTML && content.length > 12000 || !isHTML && content.length > 1000){
    return true // The content appears to be spam.
  }

  // This regex will match most common URL formats
  const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+/

  if (urlPattern.test(content)) {
    return true // The content appears to be spam.
  }

  const spamPatterns = [
    // Multiple consecutive special characters
    /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]{3,}/,

    // Repeated words or phrases
    /\b(\w+)\b.*\b\1\b/,

    // Excessive use of capital letters (more than 70% of the message)
    /^[^a-z]*$/,

    // Suspicious phrases
    /\b(win money|you'?ve won|free gift|click below|special promotion|urgent matter)\b/i,

    // Email patterns
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,

    // Numbers that look like credit card formats
    /(?:\d{4}-?){3}\d{4}/,

    // Phrases commonly associated with prescription drugs
    /\b(viagra|cialis|phentermine|xanax)\b/i,

    // URL shorteners
    /https?:\/\/(bit\.ly|goo\.gl|t\.co|tinyurl\.com|ow\.ly)/i
  ]

  for (let pattern of spamPatterns) {
    if (pattern.test(content)) {
      return true  // The content appears to be spam.
    }
  }

  return false  // The content does not appear to be spam.
}

module.exports = {
  detectSpam
}