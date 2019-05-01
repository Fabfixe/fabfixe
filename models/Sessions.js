const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SessionSchema = new Schema({
  date: {
    type: Object,
    required: true
  },
  category: {
    type: String,
    required: true
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
    type: String,
    required: true
  },
  pupil: {
    type: String,
    required: true
  },
  messages: {
    type: [Object],
    required: false
  }
})

const Session = mongoose.model('sessions', SessionSchema)

module.exports = Session
