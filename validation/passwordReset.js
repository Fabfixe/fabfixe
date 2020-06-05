const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validatePasswordReset(password, password_confirm) {
  let errors = {}

  password = !isEmpty(password) ? password : ''
  password_confirm = !isEmpty(password_confirm) ? password_confirm : ''

  if(!Validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = 'Passwords must have between 6 and 30 characters'
  }

  if(Validator.isEmpty(password)) {
    errors.password = 'Password is required'
  }

  if(!Validator.isLength(password_confirm, { min: 6, max: 30 })) {
    errors.password_confirm = 'Passwords must have between 6 and 30 characters'
  }

  if(!Validator.equals(password, password_confirm)) {
    errors.password_confirm = 'Passwords must match'
  }

  if(Validator.isEmpty(password_confirm)) {
    errors.password_confirm = 'Please re-enter your new password'
  }
  console.log(errors)
  return {
    errors,
    isValid: isEmpty(errors)
  }
}
