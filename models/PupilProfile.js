const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PupilProfileSchema = new Schema({
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

const PupilProfile = mongoose.model('pupilprofiles', PupilProfileSchema)

module.exports = PupilProfile
