const ArtistProfile = require('../../../models/ArtistProfile')

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
