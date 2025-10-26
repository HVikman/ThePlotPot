const nodemailer = require('nodemailer')
const { canSendEmail } = require('./cache')
const { getClientIp } = require('./tools')

let transporter

const getTransporter = () => {
  if (transporter) {
    return transporter
  }

  const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_FROM,
    EMAIL_SECURE,
  } = process.env

  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_FROM) {
    throw new Error('Email transport configuration is missing required environment variables')
  }

  const port = Number(EMAIL_PORT)

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port,
    secure: EMAIL_SECURE === 'true' || (port === 465 && EMAIL_SECURE !== 'false'),
    auth: EMAIL_USER && EMAIL_PASS ? {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    } : undefined,
  })

  return transporter
}

const sendEmail = async ({ to, subject, html, text }) => {
  const { EMAIL_FROM } = process.env
  if (!to) {
    throw new Error('Email recipient is required')
  }
  if (!EMAIL_FROM) {
    throw new Error('EMAIL_FROM environment variable is not set')
  }

  const transporterInstance = getTransporter()
  await transporterInstance.sendMail({
    from: EMAIL_FROM,
    to,
    subject,
    html,
    text,
  })
}

const buildLink = (path) => {
  const { URL } = process.env
  if (!URL) {
    throw new Error('APP_BASE_URL environment variable is not set')
  }

  const trimmedBase = URL.endsWith('/') ? URL.slice(0, -1) : URL
  return `${trimmedBase}${path}`
}

const sendActivationEmail = async (email, token, username, req) => {
  const ip = getClientIp(req)
  const allowed = await canSendEmail(email, ip)
  if (!allowed) {
    throw new Error('Too many email requests. Please wait a minute before trying again.')
  }
  const activationLink = buildLink(`/activate?token=${token}`)
  const subject = 'Activate your PlotPot account'
  const safeUsername = username || 'there'
  const text = `Hello ${safeUsername},\n\nPlease activate your PlotPot account by visiting the link below:\n${activationLink}\n\nIf you did not create an account, you can ignore this message.`
  const html = `
    <p>Hello ${safeUsername},</p>
    <p>Please activate your PlotPot account by clicking the button below.</p>
    <p><a href="${activationLink}" style="display:inline-block;padding:10px 20px;background:#4f46e5;color:#ffffff;text-decoration:none;border-radius:4px;">Activate Account</a></p>
    <p>If the button does not work, copy and paste the following link into your browser:</p>
    <p><a href="${activationLink}">${activationLink}</a></p>
    <p>If you did not create an account, you can ignore this message.</p>
  `

  await sendEmail({ to: email, subject, html, text })
}

const sendPasswordResetEmail = async (email, token, username, req) => {
  const ip = getClientIp(req)
  const allowed = await canSendEmail(email, ip)
  if (!allowed) {
    throw new Error('Too many email requests. Please wait a minute before trying again.')
  }
  const resetLink = buildLink(`/reset-password?token=${token}`)
  const subject = 'Reset your PlotPot password'
  const safeUsername = username || 'there'
  const text = `Hello ${safeUsername},\n\nYou can reset your PlotPot password using the link below:\n${resetLink}\n\nIf you did not request a password reset, you can ignore this message.`
  const html = `
    <p>Hello ${safeUsername},</p>
    <p>You can reset your PlotPot password by clicking the button below.</p>
    <p><a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#4f46e5;color:#ffffff;text-decoration:none;border-radius:4px;">Reset Password</a></p>
    <p>If the button does not work, copy and paste the following link into your browser:</p>
    <p><a href="${resetLink}">${resetLink}</a></p>
    <p>If you did not request a password reset, you can ignore this message.</p>
  `

  await sendEmail({ to: email, subject, html, text })
}

module.exports = {
  sendActivationEmail,
  sendPasswordResetEmail,
}