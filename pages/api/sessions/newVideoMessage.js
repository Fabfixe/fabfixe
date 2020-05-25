import dbConnect from '../../../dbconnect'
const Session = require('../../../models/Sessions')

dbConnect()

export default (req, res) => {
  return Session.updateOne({ _id: req.body._id }, { $set: { videoMessages: req.body.videoMessages } })
    .then((error, writeOpResult) => {
      console.log(req.body)
      if(error) res.send(error)
      if(writeOpResult) res.send(writeOpResult)
    })
    .catch((err) => res.send(err))
})
