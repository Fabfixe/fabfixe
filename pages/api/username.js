const express = require('express')
const router = express.Router()
const ArtistProfile = require('../../models/ArtistProfile')
const PupilProfile = require('../../models/PupilProfile')

router.post('/', function(req, res) {
  ArtistProfile.findOne({
    username: req.body.username
  })
  .then((profile) => {
    if(profile !== null) {
      return res.json(profile)
    } else {
      PupilProfile.findOne({
        username: req.body.username
      })
      .then((profile) => {
        // this block runs regardless
        if(profile) {
          if(profile !== null) return res.json(profile)
        } else {
          return res.send('')
        }
      })
    }
  })
  .catch((err) => console.log(err))
})



module.exports = router
