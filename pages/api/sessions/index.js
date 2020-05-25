import dbConnect from '../../../dbconnect'
const Session = require('../../../models/Sessions')

dbConnect()

export default (req, res) => {
  const newSession = new Session({
    date: req.body.date,
    category: req.body.category,
    duration: req.body.duration,
    attachment: req.body.attachment,
    status: req.body.status,
    description: req.body.description,
    artist: req.body.artist,
    pupil: req.body.pupil,
    artistDeleted: false,
    pupilDeleted: false,
    artistApproved: false,
    pupilApproved: true,
    messages: req.body.messages,
    sessionEvents: {
      artist: {
        visitedPreview: [],
        visitedSession: [],
        cancelledSession: '',
        mediaConnectionError: [],
        roomConnectFailedError: []
      },
      pupil: {
        visitedPreview: [],
        visitedSession: [],
        cancelledSession: '',
        mediaConnectionError: [],
        roomConnectFailedError: []
      },
    }
  })

  newSession
  .save()
  .then(session => {
    console.log('session on creation', session)
    res.json(session)
  })
  .catch((e) => console.log(e))
}
