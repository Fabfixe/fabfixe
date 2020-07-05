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
    open: {
      type: String,
      default: '9:00 AM',
      required: false
    },
    close: {
      type: String,
      default: '6:00 PM',
      required: false
    }
})

module.exports = mongoose.models.calendar || mongoose.model('calendar', CalendarSchema)
