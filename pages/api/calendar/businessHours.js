import dbConnect from '../../../dbconnect'
const Calendar = require('../../../models/Calendar')

dbConnect()

export default (req, res) => {
  const { hours, userId } = req.body

  Calendar.findOneAndUpdate(
    { userId }, { hours }, { upsert: true, returnOriginal: false })
  .then((doc) => {
    res.send(doc)
  })
}
