import dbConnect from '../../../dbconnect'
const ArtistProfile = require('../../../models/ArtistProfile')
const Calendar = require('../../../models/Calendar')

dbConnect()

export default (req, res) => {
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

    Calendar.findOneAndUpdate(
      { userId: req.body._id },
      { timezone: req.body.timezone },
      { upsert: true, returnOriginal: false })
    .then(() => {})
    .catch((e) => {
      console.log('error updating timezone:', e)
    })

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
}
