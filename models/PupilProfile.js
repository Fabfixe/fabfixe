const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PupilProfileSchema = new Schema({
  _id: Schema.Types.ObjectId,
  username: {
    type: String,
    required: true
  },
  profileImageUrl: {
    type: String,
    required: false
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
  },
  sessions: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'sessions'
  }],
  isArtist: {
    type: Boolean,
    defaut: false
  }
})

const PupilProfile = mongoose.model('pupilprofiles', PupilProfileSchema)

module.exports = PupilProfile
