const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Session = require('./Sessions')

const SessionEventsSchema = new Schema({
  artist: {
    visitedPreview: [String],
  },
  pupil: {
    visitedPreview: [String],
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sessions',
  }
})

const SessionEvents = mongoose.model('sessionevents', SessionEventsSchema)

module.exports = SessionEvents
