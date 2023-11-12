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
    return true
  }

  return false
}

module.exports = checkCaptcha