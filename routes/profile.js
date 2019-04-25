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

router.post('/username', function(req, res) {
  ArtistProfile.findOne({
    username: req.body.username
  }).then((profile) => {
    if(profile) {
      return res.json(profile)
    } else {
      PupilProfile.findOne({
        username: req.body.username
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
  let newProfile = {
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

  ArtistProfile.findOne({
    id: req.body.id
  }).then(profile => {
    if(profile) {
      ArtistProfile.updateOne({ id: req.body.id }, newProfile)
      .then(res.send('updated'))
    } else {
      newProfile = ArtistProfile(newProfile)
      newProfile.save()
      .then(res.json(newProfile))
    }
  })
})

router.post('/pupil', function(req, res) {
  let newProfile = {
    id: req.body.id,
    username: req.body.username,
    profileImageUrl: req.body.profileImageUrl,
    youtube: req.body.youtube,
    instagram: req.body.instagram,
    twitter: req.body.twitter,
    facebook: req.body.facebook,
  }

  PupilProfile.findOne({
    id: req.body.id
  }).then(profile => {
    if(profile) {
      PupilProfile.updateOne({ id: req.body.id }, newProfile)
      .then(res.send('updated'))
    } else {
      newProfile = PupilProfile(newProfile)
      newProfile.save()
      .then(res.json(newProfile))
    }
  })
})

module.exports = router
