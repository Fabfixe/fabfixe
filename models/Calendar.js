const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CalendarSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: {
      type: String,
      required: true
    },
    blocks: {
      type: Array,
      required: false
    },
    open: {
      type: String,
      required: false
    },
    close: {
      type: String,
      required: false
    }
})

module.exports = mongoose.models.calendar || mongoose.model('calendar', CalendarSchema)
