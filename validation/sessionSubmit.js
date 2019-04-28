const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateSessionSubmit(data) {
  let errors = {}
  data.date = !isEmpty(data.date) ? data.date : ''
  data.description = !isEmpty(data.description) ? data.description : ''

  if(isEmpty(data.date)) {
    errors.date = 'Please choose a date'
  }

  if(Validator.isEmpty(data.description)) {
    errors.description = 'You must include a description'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
