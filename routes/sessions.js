const express = require('express')
const router = express.Router()
const moment = require('moment')
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
    artistApproved: false,
    pupilApproved: true,
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
    .then((sessions) => {
      // if the session is expired, update the session
      sessions.forEach((session) => {
        if(session.status === 'pending' && moment(session.date).isBefore(moment())) session.status = 'expired'
        Session.updateOne({ _id: session._id}, { $set: session })
        .then((error) => {
          if(error) console.log(error)
        })
      })

      res.json(sessions)
    })
    .catch((err) => console.log(err))
})

router.post('/newMessage', function(req, res) {
  console.log(req.body)
  return Session.updateOne({ _id: req.body._id }, { $set: { messages: req.body.messages } })
    .then((error, writeOpResult) => {
      if(error) res.send(error)
      if(writeOpResult) res.send(writeOpResult)
    })
    .catch((err) => res.send(err))
})

router.post('/update', function(req, res) {
  let updatedSession = {
    date: req.body.date,
    duration: req.body.duration,
    description: req.body.description
  }

  if(req.body.contractChange) {
    if(!req.body.isPupil) {
        updatedSession['artistApproved'] = true
    } else {
      updatedSession['artistApproved'] = false
    }
  }

  // return Session.updateOne({ _id: req.body._id }, { $set: updatedSession })
  //   .then(() => res.send(req.body))
  //   .catch((err) => res.send(err))
  return Session.updateOne({ _id: req.body._id }, { $set: updatedSession })
    .then((error, writeOpResult) => {
      if(error) res.send(error)
      if(writeOpResult) res.send(writeOpResult)
    })
    .catch((err) => res.send(err))
})

router.post('/artistApprove', (req, res) => {
  let updatedSession = {
    artistApproved: true
  }

  return Session.updateOne({ _id: req.body._id }, { $set: updatedSession })
    .then((error, writeOpResult) => {
      if(error) res.send(error)
      if(writeOpResult) res.send(writeOpResult)
    })
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

router.post('/paymentComplete', (req, res) => {
  const updatedSession = {
    status: 'upcoming',
    orderID: req.body.orderID
  }

  Session.updateOne({ _id: req.body.sessionID }, { $set: updatedSession })
  .then((result) => {
    res.send(result)
  })
  .catch((error) => {
    res.send(error)
  })
})

module.exports = router
