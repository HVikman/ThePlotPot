const striptags = require('striptags')

const Akismet = require('akismet-api')

const client = new Akismet.Client({
  key: process.env.AKISMET_KEY,
  blog: process.env.URL
})

const detectSpam = async (context, content, type, isHtml=false) => {
  const { ip, userAgent, referrer } = context

  if (isHtml){
    content = striptags(content)
  }

  const comment = {
    ip: ip || context.req.ip,
    useragent: userAgent || context.req.headers['user-agent'],
    content: content,
    referrer: referrer || context.req.get('referrer'),
    type: type,
    name: context.req.session.username,
    email: context.req.session.email
  }
  try {
    const isSpam = await client.checkSpam(comment)
    return isSpam
  } catch (err) {
    console.error('Error:', err.message)
    throw new Error('Unable to check for spam at this time.')
  }
}

module.exports = {
  detectSpam
}