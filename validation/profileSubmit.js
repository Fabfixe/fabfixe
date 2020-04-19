const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateProfileSubmit(data) {
  let errors = {}
    data.username = !isEmpty(data.username) ? data.username : ''
    data.displayName = !isEmpty(data.displayName) ? data.displayName : ''

  if(Validator.isEmpty(data.username)) {
    errors.username = 'Username is required'
  }

  if(data.accountType === 'artist') {
    if(Validator.isEmpty(data.displayName)) {
      errors.displayName = 'Display name is required'
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
