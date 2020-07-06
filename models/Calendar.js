const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CalendarSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: {
      type: String,
      required: true
    },
    timezone: {
      type: String,
      default: 'America/New_York',
      required: false
    },
    blocks: {
      type: Array,
      required: false
    },
    hours: {
      type: Object,
      required: false
    }
})

module.exports = mongoose.models.calendar || mongoose.model('calendar', CalendarSchema)
