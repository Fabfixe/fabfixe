require('dotenv').config()
const express = require('express')
const moment = require('moment-timezone')
const router = express.Router()
const sgMail = require('@sendgrid/mail')
const User = require('../../models/User')
const CronJob = require('cron').CronJob

router.post('/sessionUpdated', function(req, res) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: 'carronwhite@gmail.com', // replace this
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

router.post('/sessionRequested', function(req, res) {
  const { artistUsername, pupilUsername } = req.body
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  User.findOne({ _id: req.body.pupil })
  .then(({ email }) => {
    const msg = {
      to: email,
      from: 'carronwhite@gmail.com', // Replace
      subject: 'Your session has been requested',
      text: 'Your session has been requested',
      html: `Hi <strong>${pupilUsername}</strong>, <strong>${artistUsername}</strong> has been notified of your request and will get back to you`,
    }

    sgMail.send(msg)
  })
  .catch((err) => {
    console.log(err)
  })

  User.findOne({ _id: req.body.artist })
  .then(({ email }) => {
    const formattedDate = moment(req.body.date)
    const msg = {
      to: email,
      from: 'carronwhite@gmail.com', // Replace
      subject: 'You just received a new video session request',
      text: 'You just received a new video session request',
      html: `Hi <strong>${artistUsername}</strong>, ${pupilUsername} has requested a session. Click <a href='www.fabfixe.com/account/my-sessions'>here</a> to review the request.`,
    }

    sgMail.send(msg)
  })
  .catch((err) => {
    console.log(err)
  })
})

router.post('/paymentComplete', function(req, res) {
  User.findOne({ _id: req.body.pupilId })
  .then(({ email }) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email,
      from: 'carronwhite@gmail.com',
      subject: `Confirmation`,
      text: `Payment received and session scheduled!`,
      html: `Hi <strong>${req.body.pupilUsername}</strong>, we received your payment of <strong>${req.body.amount}</strong> and scheduled your session with ${req.body.artistUsername}`,
    }

    sgMail.send(msg)
  })

  User.findOne({ _id: req.body.artistId })
  .then(({ email }) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email,
      from: 'carronwhite@gmail.com',
      subject: `Session Scheduled`,
      text: `Payment received and session scheduled!`,
      html: `Hi <strong>${req.body.artistUsername}</strong>, ${req.body.pupilUsername} has paid for a session on ${req.body.date}`,
    }

    sgMail.send(msg)
  })

  // Cron job for reminders
  const date = moment(req.body.momentDate).subtract(30, 'minutes').toDate()

  const job = new CronJob(date, function() {

    User.findOne({ _id: req.body.artistId })
    .then(({ email }) => {
     sgMail.setApiKey(process.env.SENDGRID_API_KEY)
       const msg = {
         to: email,
         from: 'carronwhite@gmail.com',
         subject: `Session Scheduled`,
         text: `It's almost time for your session`,
         html: `Reminder, you have a session with ${req.body.pupilUsername} in 30 minutes. View your upcoming sessions <a href='www.fabfixe.com/account/my-sessions'>here</a>.`,
      }

      sgMail.send(msg)
    })

    User.findOne({ _id: req.body.pupilId })
    .then(({ email }) => {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
          to: 'carronwhite@gmail.com',
          from: 'carronwhite@gmail.com',
          subject: `It's almost time for your session`,
          text: `It's almost time for your session`,
          html: `Reminder, you have a session with ${req.body.artistUsername} in 30 minutes. View your upcoming sessions <a href='www.fabfixe.com/account/my-sessions'>here</a>.`,
       }

      sgMail.send(msg)
    })

  })

  job.start()
})

module.exports = router
