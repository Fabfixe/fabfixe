import mongoose from 'mongoose'
const ArtistProfile = require('../../../models/ArtistProfile')

export default (req, res) => {
  // const { offset, limit } = req.query
  // return ArtistProfile.paginate({}, { offset: parseInt(offset), limit: parseInt(limit) }).then(function(result) {
  //   res.json(result)
  // })

  const result = { expertise: { hair: [], makeup: []},
    sessions: [],
    isArtist: true,
    _id: "5e95268842c452e8400b5e47",
    username: "ruth",
    displayName: "Ruth Shaw Beauty",
    profileImageUrl: "http://res.cloudinary.com/daqyhasiw/image/upload/v1586834497/cojlexxsooavxueny1lf.png",
    youtube: "rshawbeauty",
    instagram: "",
    twitter: "",
    facebook: "",
    hourlyRate: 25
  }

    res.json({docs: [result]})
}
