import dbConnect from '../../../dbconnect'
const Session = require('../../../models/Sessions')

dbConnect()

export default (req, res) => {
  const updatedSession = {
    status: 'upcoming',
    orderID: req.body.orderID
  }

  Session.updateOne({ _id: req.body.sessionID }, { $set: updatedSession })
  .then((result) => {
    res.send(result)
  })
  .catch((error) => {
    res.send(error)
  })
}
