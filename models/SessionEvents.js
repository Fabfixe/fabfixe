const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Session = require('./Sessions')

const SessionEventsSchema = new Schema({
  artist: {
    visitedPreview: [String],
    cancelledSession: { type: Date, default: Date.now }
  },
  pupil: {
    visitedPreview: [String],
    cancelledSession: { type: Date, default: Date.now }
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sessions',
  }
}, { timestamps: { updatedAt: 'updated_at' } })

const SessionEvents = mongoose.model('sessionevents', SessionEventsSchema)

module.exports = SessionEvents
