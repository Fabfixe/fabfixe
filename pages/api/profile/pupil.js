const PupilProfile = require('../../../models/PupilProfile')
import dbConnect from '../../../../dbConnect'

dbConnect()

export default (req, res) => {
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
}
