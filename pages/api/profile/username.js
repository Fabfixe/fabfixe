import dbConnect from '../../../dbconnect'
const ArtistProfile = require('../../../models/ArtistProfile')
const PupilProfile = require('../../../models/PupilProfile')

dbConnect()

export default (req, res) => {
return  ArtistProfile.findOne({
    username: req.body.username
  }).then((profile) => {
    if(profile) {
       res.json(profile)
    } else {
      PupilProfile.findOne({
        username: req.body.username
      }).then((profile) => {
        if(profile) {
           res.json(profile)
        } else {
           res.json({})
        }
      })
    }
  })
  .catch((err) => {
    return res.send(err)
  })
}
