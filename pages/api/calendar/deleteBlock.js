import dbConnect from '../../../dbconnect'
const Calendar = require('../../../models/Calendar')

dbConnect()

export default (req, res) => {
  const { block : { startTime, endTime, daysOfWeek }, userId } = req.body
  console.log(typeof startTime, typeof endTime, typeof daysOfWeek)
// { startTime: '7:58', endTime: '9:58', daysOfWeek: 4 }
  // find the block matching block from request
  Calendar.update(
    { userId },
    { $pull: { blocks: { startTime, endTime, daysOfWeek: daysOfWeek.toString() } }},
    { multi: true }
  ).then((result) => {
    res.send(result.nModified)
  })
}
