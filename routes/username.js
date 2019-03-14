const express = require('express')
const router = express.Router()


const ArtistProfile = require('../models/ArtistProfile')
const PupilProfile = require('../models/PupilProfile')

router.post('/', function(req, res) {
  ArtistProfile.findOne({
    username: req.body.username
  }).then(username => {
    if(username) {
      return res.status(400).json({
        username: 'Username taken'
      })
    }
  })
  // ArtistProfile.find({}).then(profile => console.log('found profiles', profile))
  .catch((err) => {
    console.log('err', err)
  })

  PupilProfile.findOne({
    username: req.body.username
  }).then(username => {
    if(username) {
      return res.status(400).json({
        username: 'Username taken'
      })
    }
  })
  .catch((err) => {
    console.log('err', err)
  })
})



module.exports = router
