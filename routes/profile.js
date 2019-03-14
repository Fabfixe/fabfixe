const express = require('express')
const router = express.Router()

const ArtistProfile = require('../models/ArtistProfile')
const PupilProfile = require('../models/PupilProfile')

router.post('/artist', function(req, res) {
  console.log('req.body.id', req.body.id)
  const newProfile = ArtistProfile({
    id: req.body.id,
    username: req.body.username,
    profileImageUrl: req.body.profileImageUrl,
    youtube: req.body.youtube,
    instagram: req.body.instagram,
    twitter: req.body.twitter,
    facebook: req.body.facebook,
    hourlyRate: req.body.hourlyRate,
    expertise: req.body.expertise
  })

  ArtistProfile.findOne({
    id: req.body.id
  }).then(profile => {
    if(profile) {
      ArtistProfile.update({ id: res.body.id }, newProfile)
      .then(res.send('updated'))
    } else {
      newProfile.save()
      .then(res.json(newProfile))
    }
  })
})

router.post('/pupil', function(req, res) {
  const newProfile = PupilProfile({
    id: req.body.id,
    username: req.body.username,
    profileImageUrl: req.body.profileImageUrl,
    youtube: req.body.youtube,
    instagram: req.body.instagram,
    twitter: req.body.twitter,
    facebook: req.body.facebook,
  })

  if(profile) {
    PupilProfile.update({ id: res.body.id }, newProfile)
    .then(res.send('updated'))
  } else {
    newProfile.save()
    .then(res.json(newProfile))
  }
})

module.exports = router
