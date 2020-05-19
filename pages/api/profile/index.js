import dbConnect from '../../../../dbConnect'

dbConnect()

import ArtistProfile from '../../../models/ArtistProfile'
import PupilProfile from '../../../models/PupilProfile'
export default (req, res) => {
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
}
