require('dotenv').config()
import dbConnect from '../../../dbconnect'
const sgMail = require('@sendgrid/mail')

const User = require('../../../models/User')

dbConnect()

export default (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  User.findOne({ _id: req.body.notify })
  .then(({ firstName, email }) => {
    const msg = {
      to: email,
      from: 'admin@fabfixe.com',
      subject: 'Your session has been updated',
      text: 'Your session has been updated',
      html: `Hi <strong>${firstName}</strong>, your session has been updated. Click <a href='${process.env.API_URL}/session/view/${req.body._id}/'>here</a> to see the change.`,
    }

    sgMail.send(msg)
  })
}
