const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArtistProfileSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  youtube: {
    type: String,
    required: false
  },
  instagram: {
    type: String,
    required: false
  },
  twitter: {
    type: String,
    required: false
  },
  facebook: {
    type: String,
    required: false
  },
  hourlyRate: {
    type: Number,
    required: false
  },
  expertise: {
    makeup: [String],
    hair: [String]
  }
})

const ArtistProfile = mongoose.model('artistprofiles', ArtistProfileSchema)

module.exports = ArtistProfile
