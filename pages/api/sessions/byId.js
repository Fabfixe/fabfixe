import dbConnect from '../../../dbconnect'
const Session = require('../../../models/Sessions')
const moment = require('moment')

dbConnect()

export default (req, res) => {
  return Session.find({ [req.body.accountType]: req.body._id })
    .populate('artist')
    .populate('pupil')
    .then((sessions) => {
      // if the session is expired or completed, update the session

      sessions.forEach((session) => {
        if(session.status === 'pending' && moment(session.date).isSameOrBefore(moment())) session.status = 'expired'
        Session.updateOne({ _id: session._id }, { $set: session })
        .then((error) => {
          if(error) console.log(error)
        })

        if(session.status === 'upcoming') {
          // add the session duration to the session date and check if it is after today
          const sessionEnded = moment(session.date).add(parseInt(session.duration), 'm')
          if(sessionEnded.isBefore(moment())) {
            session.status = 'completed'
            Session.updateOne({ _id: session._id }, { $set: session })
            .then((error) => {
              if(error) console.log(error)
            })
          }
        }
      })

      res.json(sessions)
    })
    .catch((err) => console.log(err))
}
