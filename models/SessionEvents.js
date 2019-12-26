const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Session = require('./Sessions')

const SessionEventsSchema = new Schema({
  _id: Schema.Types.ObjectId,
  artist: {
    visitedPreview: [Object]
  },
  pupil: {
    visitedPreview: [Object]
  },
  session: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'sessions'
  },
})

const SessionEvents = mongoose.model('sessionevents', SessionEventsSchema)

module.exports = SessionEvents
