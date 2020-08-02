import dbConnect from '../../../dbconnect'
const ArtistProfile = require('../../../models/ArtistProfile')
const Calendar = require('../../../models/Calendar')

dbConnect()

export default (req, res) => {
  console.log('tz', req.body.timezone)
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

    Calendar.findOne({
      userId: req.body._id
    }).then(calendar => {
      if(!calendar) {
        const newCalendar = Calendar(
          {
            userId: req.body._id,
            hours: {
              open: '9:00 AM',
              close: '5:00 PM',
              timezone: req.body.timezone
            }
          }
        )

        newCalendar.save()
        .catch((e) => {
          console.log('error updating timezone:', e)
        })
      }
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
