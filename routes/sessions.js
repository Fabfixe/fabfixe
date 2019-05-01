const express = require('express')
const router = express.Router()

const Session = require('../models/Sessions')

router.post('/', function(req, res) {
  const newSession = new Session({
    date: req.body.date,
    category: req.body.category,
    attachment: req.body.attachment,
    status: req.body.status,
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

router.post('/byId', function(req, res) {
  Session.find({ [req.body.accountType]: req.body.id })
    .then((sessions) => res.json(sessions))
    .catch((err) => console.log(err))
})

module.exports = router
