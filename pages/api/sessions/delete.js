import dbConnect from '../../../dbconnect'
const Session = require('../../../models/Sessions')

dbConnect()

export default (req, res) => {
  console.log('here')
  const deletedUser = req.body.isArtist ? 'artistDeleted' : 'pupilDeleted'
  return Session.updateOne({ _id: req.body._id }, { $set: { [deletedUser]: true } })
    .then(() => res.send('deleted'))
    .catch((err) => console.log(err))
}
