const fetch = require('node-fetch')

const checkCaptcha = async (token) => {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  })

  const data = await response.json()
  console.log(data)

  if (!data.success || data.score < 0.5) {
    const error = new Error('Captcha verification failed')
    error.isUserError = true
    throw error
  }

  return false
}

module.exports = checkCaptcha