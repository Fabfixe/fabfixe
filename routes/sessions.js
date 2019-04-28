const express = require('express')
const router = express.Router()

const Session = require('../models/Sessions')

router.post('/', function(req, res) {
  const newSession = new Session({
    date: req.body.date,
    category: req.body.category,
    attachment: req.body.attachment,
    description: req.body.description,
    artist: req.body.artist,
    pupil: req.body.pupil,
    messages: req.body.messages
  })

  newSession
    .save()
    .then(session => {
      res.json(session)
  })
})

module.exports = router
