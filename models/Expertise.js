const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExpertiseSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  makeup: [String],
  hair: [String]
})

const Expertise = mongoose.model('expertises', ExpertiseSchema)

module.exports = Expertise
