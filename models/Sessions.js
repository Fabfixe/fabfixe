const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArtistProfile = require('./ArtistProfile')
const PupilProfile = require('./PupilProfile')
const SessionEvents = require('./SessionEvents')

const SessionSchema = new Schema({
  _id: Schema.Types.ObjectId,
  date: {
    type: Object,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true,
  },
  attachment: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'artistprofiles',
  },
  pupil: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pupilprofiles',
  },
  artistDeleted: {
    type: Boolean,
    required: true
  },
  pupilDeleted: {
    type: Boolean,
    required: true
  },
  artistApproved: {
    type: Boolean,
    required: true
  },
  messages: {
    type: [Object],
    required: false
  },
  videoMessages: {
    type: [Object],
    required: false
  },
  orderID: {
    type: String,
    required: false,
  },
  sessionEvents: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sessionevents',
  }
})

const Session = mongoose.model('sessions', SessionSchema)

module.exports = Session
