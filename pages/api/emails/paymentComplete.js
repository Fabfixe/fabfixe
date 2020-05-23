import dbConnect from '../../../dbconnect'
const sgMail = require('@sendgrid/mail')

const User = require('../../../models/User')

dbConnect()

export default (req, res) => {
  User.findOne({ _id: req.body.pupilId })
  .then(({ email }) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email,
      from: 'admin@fabfixe.com',
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
      from: 'admin@fabfixe.com',
      subject: `Session Scheduled`,
      text: `Payment received and session scheduled!`,
      html: `Hi <strong>${req.body.artistUsername}</strong>, ${req.body.pupilUsername} has paid for a session on ${req.body.date}`,
    }

    sgMail.send(msg)
}
