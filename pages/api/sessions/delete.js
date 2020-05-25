import dbConnect from '../../../dbconnect'
const Session = require('../../../models/Sessions')

dbConnect()

export default (req, res) => {
  const deletedUser = req.body.isPupil ? 'pupilDeleted' : 'artistDeleted'
  return Session.updateOne({ _id: req.body._id }, { $set: { [deletedUser]: true } })
    .then(() => res.send('deleted'))
    .catch((err) => console.log(err))
}
