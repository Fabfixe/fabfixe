import dbConnect from '../../../dbconnect'
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validateEmailInput = require('../../../validation/email')
const User = require('../../../models/User')
const crypto = require('crypto')
const sgMail = require('@sendgrid/mail')

dbConnect()

export default (req, res) => {
  const { passwordResetToken, password } = req.body

  // Encrypt the password
  bcrypt.genSalt(10, (err, salt) => {
    if(err) console.error('There was an error', err)
    else {
      bcrypt.hash(password, salt, (err, hash) => {
        if(err) console.error('There was an error', err)
          else {
            User.findOneAndUpdate(passwordResetToken, { password: hash })
            .then((user) => {
              console.log(user)
              res.send({ message: 'Successfully updated password' })
            })
            .catch((err) => {
              res.send({ message: 'Something went wrong, please try again later' })
            })
          }
        })
      }
    })
}
