import dbConnect from '../../../dbconnect'
import mongoose from 'mongoose'
const bcrypt = require('bcryptjs')
const User = require('../../../models/User')
const gravatar = require('gravatar')
const validateRegisterInput = require('../../../validation/register')


dbConnect()

export default (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body)

  if(!isValid) {
    return res.status(400).json(errors)
  }

  User.findOne({
      email: req.body.email
  }).then(user => {
    if(user) {
      return res.status(400).json({
        email: 'Email already exists'
      })
    } else {

      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        accountType: req.body.accountType,
        passwordResetToken: 'test',
        avatar
      })

      bcrypt.genSalt(10, (err, salt) => {
        if(err) console.error('There was an error', err)
        else {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) console.error('There was an error', err)
              else {
                newUser.password = hash
                console.log(newUser, 'newUser')
                newUser
                .save()
                .then(user => {
                  res.json(user)
              })
            }
          })
        }
      })
    }
  })
}
