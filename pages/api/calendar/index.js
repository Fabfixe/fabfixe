import dbConnect from '../../../dbconnect'
const Calendar = require('../../../models/Calendar')

dbConnect()

export default (req, res) => {
  if(req.method === 'POST') {
    const { block, _id } = req.body

    Calendar.findOneAndUpdate(
      { userId: _id },
      { $push: { blocks: block }},
      { upsert: true, returnOriginal: false })
    .then((doc) => {
      console.log('sending doc', doc)
      res.send(doc)
    })
  }

  if(req.method === 'GET') {
    const { userId } = req.query

    Calendar.findOne({ userId })
    .then((doc) => res.send(doc))
  }
}
