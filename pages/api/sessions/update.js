import dbConnect from '../../../dbconnect'
const Session = require('../../../models/Sessions')

dbConnect()

export default (req, res) => {
  let updatedSession = {
    date: req.body.date,
    duration: req.body.duration,
    description: req.body.description
  }

  if(req.body.contractChange) {
    if(req.body.isArtist) {
        updatedSession['artistApproved'] = true
    } else {
      updatedSession['pupilApproved'] = false
    }
  }

  return Session.updateOne({ _id: req.body._id }, { $set: updatedSession })
    .then((error, writeOpResult) => {
      if(error) res.send(error)
      if(writeOpResult) res.send(writeOpResult)
    })
    .catch((err) => res.send(err))
}
