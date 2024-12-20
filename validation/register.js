const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data) {
  let errors = {};
  data.firstName = !isEmpty(data.firstName) ? data.firstName : ''
  data.lastName = !isEmpty(data.lastName) ? data.lastName: ''
  data.email = !isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty(data.password) ? data.password : ''
  data.password_confirm = !isEmpty(data.password_confirm) ? data.password_confirm : ''

  if(Validator.isEmpty(data.firstName)) {
    errors.firstName = 'First name is required'
  }

  if(Validator.isEmpty(data.lastName)) {
    errors.lastName = 'Last name is required'
  }

  if(!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'
  }

  if(Validator.isEmpty(data.email)) {
    errors.email = 'Email is required'
  }

  if(!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Passwords must have between 6 and 30 characters'
  }

  if(Validator.isEmpty(data.password)) {
    errors.password = 'Password is required'
  }

  if(!Validator.isLength(data.password_confirm, { min: 6, max: 30 })) {
    errors.password_confirm = 'Passwords must have between 6 and 30 characters'
  }

  if(!Validator.equals(data.password, data.password_confirm)) {
    errors.password_confirm = 'Passwords must match'
  }

  if(Validator.isEmpty(data.password_confirm)) {
    errors.password_confirm = 'Password is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
