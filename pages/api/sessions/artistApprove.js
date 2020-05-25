import dbConnect from '../../../dbconnect'
const Session = require('../../../models/Sessions')

dbConnect()

export default (req, res) => {
  let updatedSession = {
    artistApproved: true
  }

  return Session.updateOne({ _id: req.body._id }, { $set: updatedSession })
    .then((error, writeOpResult) => {
      if(error) res.send(error)
      if(writeOpResult) res.send(writeOpResult)
    })
    .catch((err) => res.send(err))
}
