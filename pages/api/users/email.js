require('dotenv').config()
import dbConnect from '../../../dbconnect'
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validateEmailInput = require('../../../validation/email')
const User = require('../../../models/User')
const crypto = require('crypto')
const sgMail = require('@sendgrid/mail')

dbConnect()

export default (req, res) => {
  const { errors, isValid } = validateEmailInput(req.body)

  if(!isValid) {
    return res.status(400).json(errors)
  }

  const email = req.body.email
  const buffer = crypto.randomBytes(32)
  const passwordResetToken = buffer.toString("hex")

  User.findOneAndUpdate({ email }, { passwordResetToken })
  .then(user => {
    if(!user) {
      errors.email = `No account for ${email} exists`
      return res.status(404).json(errors)
    } else {
      const { firstName, email } = user
      const passwordResetUrl = `${process.env.API_URL}account/reset-password-submit?passwordResetToken=${passwordResetToken}`
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
console.log(passwordResetUrl)
        const msg = {
            to: email,
            from: 'admin@fabfixe.com',
            subject: 'Password Reset Request',
            text: `
              Hi ${firstName},
              You can reset your password by going to ${passwordResetUrl}`,
            html: `
            <p>Hi ${firstName},</p>
            <p>
              Visit <a href="${passwordResetUrl}">this link</a> to reset your password.
            </p>
        `,
        }

        sgMail.send(msg)
        res.send({ message: 'Check your email for a link to reset your password' })
    }
  })
  .catch((err) => {
    console.log('error:', err)
  })
}
