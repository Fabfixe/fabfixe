const express = require('express')
const router = express.Router()
const moment = require('moment')
const Session = require('../../models/Sessions')

router.post('/visitedPreview', function(req, res) {
  const { accountType, time, _id } = req.body
  const record = `sessionEvents.${accountType}.visitedPreview`

    return Session.findOneAndUpdate({ _id }, {
      $push : { [record] : time }
    })
    .then((writeOpResult, err) => {
      if(err) console.log('err', err)
      if(writeOpResult) console.log('writeOpResult', writeOpResult)
    })
})

router.post('/visitedSession', function(req, res) {
  const { accountType, time, _id } = req.body
  const record = `sessionEvents.${accountType}.visitedSession`

    return Session.findOneAndUpdate({ _id }, {
      $push : { [record] : time }
    })
    .then((writeOpResult, err) => {
      if(err) console.log('err', err)
      if(writeOpResult) console.log('writeOpResult', writeOpResult)
    })
})

router.post('/roomConnectFailedError', function(req, res) {
  const { accountType, time, _id } = req.body
  const record = `sessionEvents.${accountType}.roomConnectFailedError`

    return Session.findOneAndUpdate({ _id }, {
      $push : { [record] : time }
    })
    .then((writeOpResult, err) => {
      if(err) console.log('err', err)
      if(writeOpResult) console.log('writeOpResult', writeOpResult)
    })
})

router.post('/mediaConnectionError', function(req, res) {
  const { accountType, time, _id } = req.body
  const record = `sessionEvents.${accountType}.mediaConnectionError`

    return Session.findOneAndUpdate({ _id }, {
      $push : { [record] : time }
    })
    .then((writeOpResult, err) => {
      if(err) console.log('err', err)
      if(writeOpResult) console.log('writeOpResult', writeOpResult)
    })
})

router.post('/cancel', function(req, res) {
  const { _id, isPupil } = req.body
  const accountType = isPupil ? 'pupil' : 'artist'
  const record = `sessionEvents.${accountType}.cancelledSession`

    return Session.findOneAndUpdate({ _id }, {
      [record]: Date.now()
    })
    .then((writeOpResult, err) => {
      if(err) console.log('err', err)
      if(writeOpResult) console.log('writeOpResult', writeOpResult)
    })
})



module.exports = router
