import dbConnect from '../../../dbconnect'
const Session = require('../../../models/Sessions')
const axios = require('axios')

dbConnect()

export default (req, res) => {
  return Session.updateOne({ _id: req.body._id }, { $set: { status: 'cancelled' } })
    .then(() => {
      axios.post('/api/sessionEvents/cancel', { _id: req.body._id, isPupil: req.body.isPupil })
      res.send('cancelled')
    })
    .catch((err) => res.send(err))
}
