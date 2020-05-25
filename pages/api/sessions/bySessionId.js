import dbConnect from '../../../dbconnect'
const Session = require('../../../models/Sessions')

dbConnect()

export default (req, res) => {
  return Session.find({ _id: req.body.id })
    .populate('artist')
    .populate('pupil')
    .then((session) => {
      res.json(session)
    })
}
