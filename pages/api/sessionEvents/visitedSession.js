import dbConnect from '../../../dbconnect'
const Session = require('../../../models/Sessions')

dbConnect()

export default (req, res) => {
  const { accountType, time, _id } = req.body
  const record = `sessionEvents.${accountType}.visitedSession`

    return Session.findOneAndUpdate({ _id }, {
      $push : { [record] : time }
    })
    .then((writeOpResult, err) => {
      if(err) console.log('err', err)
      if(writeOpResult) console.log('writeOpResult', writeOpResult)
    })
}
