import dbConnect from '../../../dbconnect'
const Session = require('../../../models/Sessions')

dbConnect()

export default (req, res) => {
  const { _id, isPupil } = req.body
  const accountType = isPupil ? 'pupil' : 'artist'
  const record = `sessionEvents.${accountType}.cancelledSession`

    return Session.findOneAndUpdate({ _id }, {
      [record]: Date.now()
    })
    .then((writeOpResult, err) => {
      if(err) console.log('err', err)
      if(writeOpResult) console.log('writeOpResult', writeOpResult)
    })
}
