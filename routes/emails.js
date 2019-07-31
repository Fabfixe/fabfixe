require('dotenv').config()
const express = require('express')
const router = express.Router()
const sgMail = require('@sendgrid/mail');

router.post('/sessionUpdated', function(req, res) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  console.log('hit')
  const msg = {
    to: 'carronwhite@gmail.com',
    from: 'carronwhite@gmail.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }

  sgMail.send(msg)
})

module.exports = router
