import dbConnect from '../../dbconnect'
const ArtistProfile = require('../../models/ArtistProfile')
const PupilProfile = require('../../models/PupilProfile')

dbConnect()

export default (req, res) => {
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
}
