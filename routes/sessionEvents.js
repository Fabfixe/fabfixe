const express = require('express')
const router = express.Router()
const moment = require('moment')
const Session = require('../models/Sessions')
const PupilProfile = require('../models/PupilProfile')
const ArtistProfile = require('../models/ArtistProfile')
const SessionEvents = require('../models/SessionEvents')

router.post('/visitedPreview', function(req, res) {
  const { accountType, time, _id } = req.body
  return Session.find({ _id })
    .populate('sessionEvents')
    .then((session) => {
      const _id = session.sessionEvents._id
      const visitedPreview = session.sessionEvents.visitedPreview.concat([{accountType, time}])
      return SessionEvents.updateOne({ _id }, { $set: { visitedPreview } })
      .then((error, writeOpResult) => {
        if(writeOpResult) console.log('writeOpResult', writeOpResult)
      })
      .catch((err) => console.log(err))
    })
})

module.exports = router
