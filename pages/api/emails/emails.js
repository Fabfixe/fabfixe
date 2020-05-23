require('dotenv').config()
const express = require('express')
const moment = require('moment-timezone')
const router = express.Router()
const sgMail = require('@sendgrid/mail')
const User = require('../../models/User')
const CronJob = require('cron').CronJob

  // Cron job for reminders
  const date = moment(req.body.momentDate).subtract(30, 'minutes').toDate()

  const job = new CronJob(date, function() {

    User.findOne({ _id: req.body.artistId })
    .then(({ email }) => {
     sgMail.setApiKey(process.env.SENDGRID_API_KEY)
       const msg = {
         to: email,
         from: 'admin@fabfixe.com',
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
          from: 'admin@fabfixe.com',
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
