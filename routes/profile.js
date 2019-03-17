const express = require('express')
const router = express.Router()

const ArtistProfile = require('../models/ArtistProfile')
const PupilProfile = require('../models/PupilProfile')

router.post('/', function(req, res) {
  ArtistProfile.findOne({
    id: req.body.id
  }).then((profile) => {
    if(profile) {
      return res.json(profile)
    } else {
      PupilProfile.findOne({
        id: req.body.id
      }).then((profile) => {
        if(profile) return res.json(profile)
      })
    }
  })
  .catch((err) => {
    console.log(err)
  })
})

router.post('/artist', function(req, res) {
  const newProfile = {
    id: req.body.id,
    username: req.body.username,
    profileImageUrl: req.body.profileImageUrl,
    youtube: req.body.youtube,
    instagram: req.body.instagram,
    twitter: req.body.twitter,
    facebook: req.body.facebook,
    hourlyRate: req.body.hourlyRate,
    expertise: req.body.expertise
  }
console.log(newProfile)
  ArtistProfile.findOne({
    id: req.body.id
  }).then(profile => {
    if(profile) {
      ArtistProfile.updateOne({ id: req.body.id }, newProfile)
      .then(res.send('updated'))
    } else {
      newProfile.save()
      .then(res.json(newProfile))
    }
  })
})

router.post('/pupil', function(req, res) {
  const newProfile = {
    id: req.body.id,
    username: req.body.username,
    profileImageUrl: req.body.profileImageUrl,
    youtube: req.body.youtube,
    instagram: req.body.instagram,
    twitter: req.body.twitter,
    facebook: req.body.facebook,
  }

  if(profile) {
    PupilProfile.updateOne({ id: res.body.id }, newProfile)
    .then(res.send('updated'))
  } else {
    newProfile.save()
    .then(res.json(newProfile))
  }
})

module.exports = router
