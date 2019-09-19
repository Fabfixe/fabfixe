require('dotenv').config()
const express = require('express')
const router = express.Router()
const sgMail = require('@sendgrid/mail')

router.post('/sessionUpdated', function(req, res) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: 'carronwhite@gmail.com',
    from: 'carronwhite@gmail.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }

  sgMail.send(msg)
})

router.post('/newMessage', function(req, res) {
  // you will receive a req.body object with 'fromName' and 'toName' properties with account ids
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: 'carronwhite@gmail.com', // Replace
    from: 'carronwhite@gmail.com', // Replace
    subject: `New message from ${req.body.fromName}`,
    text: `New message from ${req.body.fromName}`,
    html: `Hi <strong>${req.body.toName}</strong>, you just got a new message from <strong>${req.body.fromName}</strong>. Click <a href='www.fabfixe.com/account/my-sessions'>here</a> to see the message.`,
  }

  sgMail.send(msg)
})

module.exports = router
