import dbConnect from '../../../dbconnect'
const Session = require('../../../models/Sessions')

dbConnect()

export default (req, res) => {
  return Session.updateOne({ _id: req.body._id }, { $set: { messages: req.body.messages } })
    .then((error, writeOpResult) => {
      if(error) res.send(error)
      if(writeOpResult) res.send(writeOpResult)
    })
    .catch((err) => res.send(err))
}
