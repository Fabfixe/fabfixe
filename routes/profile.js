const express = require('express')
const router = express.Router()

const ArtistProfile = require('../models/ArtistProfile')
const PupilProfile = require('../models/PupilProfile')
const User = require('../models/User')

router.post('/', function(req, res) {
  ArtistProfile.findOne({
    _id: req.body._id
  }).then((profile) => {
    if(profile) {
      return res.json(profile)
    } else {
      PupilProfile.findOne({
        _id: req.body._id
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
      console.log('profile.artist', profile)
      return res.json(profile)
    } else {
      PupilProfile.findOne({
        username: req.body.username
      }).then((profile) => {
        if(profile) {
          console.log('profile pupil', profile)
          //might be able to remove these returns
          return res.json(profile)
        } else {
          return res.json({})
        }
      })
    }
  })
  .catch((err) => {
    return res.send(err)
  })
})

router.get('/artists', function(req, res) {
  const { offset, limit } = req.query
  ArtistProfile.paginate({}, { offset: parseInt(offset), limit: parseInt(limit) }).then(function(result) {
    res.json(result)
  })
})

router.post('/artist', function(req, res) {
  let newProfile = {
    _id: req.body._id,
    username: req.body.username,
    displayName: req.body.displayName,
    profileImageUrl: req.body.profileImageUrl,
    youtube: req.body.youtube,
    instagram: req.body.instagram,
    twitter: req.body.twitter,
    facebook: req.body.facebook,
    hourlyRate: req.body.hourlyRate,
    expertise: req.body.expertise,
    sessions: req.body.sessions,
    isArtist: true,
  }

  console.log('newProfile', newProfile)

  ArtistProfile.findOne({
    _id: req.body._id
  }).then(profile => {
    if(profile) {
      ArtistProfile.updateOne({ _id: req.body._id }, newProfile)
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
    _id: req.body._id,
    username: req.body.username,
    profileImageUrl: req.body.profileImageUrl,
    youtube: req.body.youtube,
    instagram: req.body.instagram,
    twitter: req.body.twitter,
    facebook: req.body.facebook,
    sessions: req.body.sessions,
    isArtist: false
  }

  PupilProfile.findOne({
    _id: req.body._id
  }).then(profile => {
    if(profile) {
      PupilProfile.updateOne({ _id: req.body._id }, newProfile)
      .then(res.send('updated'))
    } else {
      newProfile = PupilProfile(newProfile)
      newProfile.save()
      .then(res.json(newProfile))
    }
  })
})

module.exports = router
