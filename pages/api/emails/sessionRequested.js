require('dotenv').config()
import dbConnect from '../../../dbconnect'
const sgMail = require('@sendgrid/mail')

const User = require('../../../models/User')

dbConnect()

export default (req, res) => {
  const { artistUsername, pupilUsername } = req.body
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  User.findOne({ _id: req.body.pupil })
  .then(({ email }) => {
    const msg = {
      to: email,
      from: 'admin@fabfixe.com', // Replace
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
      from: 'admin@fabfixe.com',
      subject: 'You just received a new video session request',
      text: 'You just received a new video session request',
      html: `Hi <strong>${artistUsername}</strong>, ${pupilUsername} has requested a session. Click <a href='www.fabfixe.com/account/my-sessions'>here</a> to review the request.`,
    }

    sgMail.send(msg)
  })
  .catch((err) => {
    console.log(err)
  })
}
