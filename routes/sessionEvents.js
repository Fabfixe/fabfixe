const express = require('express')
const router = express.Router()
const moment = require('moment')
const Session = require('../models/Sessions')

router.post('/visitedPreview', function(req, res) {
  const { accountType, time, _id } = req.body
  const record = `sessionEvents.${accountType}.visitedPreview`
  
    return Session.findOneAndUpdate({ _id }, {
      $push : { [record] : time }
    })
    .then((session) => {
      if(err) console.log('err', err)
      if(writeOpResult) console.log('writeOpResult', writeOpResult)
    })
})

module.exports = router
