const express = require('express')
const router = express.Router()

const Session = require('../models/Sessions')
const PupilProfile = require('../models/PupilProfile')
const ArtistProfile = require('../models/ArtistProfile')

router.post('/', function(req, res) {
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
    messages: req.body.messages
  })
  newSession
    .save()
    .then(session => {
      res.json(session)
    })
})

router.post('/byId', function(req, res) {
  return Session.find({ [req.body.accountType]: req.body._id })
    .populate('artist')
    .populate('pupil')
    .then((sessions) => res.json(sessions))
    .catch((err) => console.log(err))
})

router.post('/update', function(req, res) {
  let updatedSession = {
    date: req.body.date,
    duration: req.body.duration,
    description: req.body.description
  }

  if(req.body.messages) updatedSession['messages'] = req.body.messages

  return Session.updateOne({ _id: req.body._id }, { $set: updatedSession })
    .then(() => res.send(req.body))
    .catch((err) => res.send(err))
})

router.post('/cancel', (req, res) => {
  return Session.updateOne({ _id: req.body._id }, { $set: { status: 'cancelled' } })
    .then(() => res.send('cancelled'))
    .catch((err) => res.send(err))
})

router.post('/delete', (req, res) => {
  const deletedUser = req.body.isPupil ? 'pupilDeleted' : 'artistDeleted'
  return Session.updateOne({ _id: req.body._id }, { $set: { [deletedUser]: true } })
    .then(() => res.send('deleted'))
    .catch((err) => console.log(err))
})

module.exports = router
