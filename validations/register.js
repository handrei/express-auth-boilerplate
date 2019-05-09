const Validator = require('validator');
const _ = require('lodash');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !_.isEmpty(data.name) ? data.name : '';
  data.email = !_.isEmpty(data.email) ? data.email : '';
  data.password = !_.isEmpty(data.password) ? data.password : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'name must be between 2 and 30 characters';
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = 'name field is required';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'email field is required';
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = 'email is invalid';
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = 'password field is required';
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'password must at least 6 characters';
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};