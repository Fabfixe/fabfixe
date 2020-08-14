const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CalendarSchema = new Schema({
    userId: {
      type: String,
      required: true
    },
    blocks: {
      type: Array,
      required: false,
      default: []
    },
    hours: {
      type: Object,
      default: {
        open: '9:00 AM',
        close: '5:00 PM',
        timezone: 'America/New_York'
      },
      required: false
    }
})

module.exports = mongoose.models.calendar || mongoose.model('calendar', CalendarSchema)
