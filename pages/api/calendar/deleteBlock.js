import dbConnect from '../../../dbconnect'
const Calendar = require('../../../models/Calendar')

dbConnect()

export default (req, res) => {
  const { block : { startTime, endTime, daysOfWeek, recurring }, userId } = req.body
  if(recurring) {
    Calendar.update(
      { userId },
      { $pull: { blocks: { startTime, endTime, daysOfWeek: daysOfWeek.toString() } }},
      { multi: true }
    ).then((result) => {
      res.send(result.nModified)
    })
  } else {
    Calendar.update(
      { userId },
      { $pull: { blocks: { startTime, endTime } }},
      { multi: true }
    ).then((result) => {
      res.send(result.nModified)
    })
  }
}
