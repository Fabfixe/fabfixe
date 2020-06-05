const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    _id: Schema.Types.ObjectId,
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    passwordResetToken: {
      type: String,
    },
    avatar: {
      type: String
    },
    accountType: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
})

// const User =

module.exports = mongoose.models.users || mongoose.model('users', UserSchema)
