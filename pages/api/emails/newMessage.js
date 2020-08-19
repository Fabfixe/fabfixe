require('dotenv').config()
import dbConnect from '../../../dbconnect'
const sgMail = require('@sendgrid/mail')

const User = require('../../../models/User')

dbConnect()

export default (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  User.findOne({ _id: req.body.toId })
  .then(({ email }) => {
    const msg = {
      to: email, // Replace
      from: 'admin@fabfixe.com', // Replace
      subject: `New message from ${req.body.fromName}`,
      text: `New message from ${req.body.fromName}`,
      html: `Hi <strong>${req.body.toName}</strong>, you just got a new message from <strong>${req.body.fromName}</strong>. Click <a href='www.fabfixe.com/account/my-sessions'>here</a> to see the message.`,
    }

    sgMail.send(msg)
  })
}
