const Validator = require('validator');
const _ = require('lodash');

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !_.isEmpty(data.email) ? data.email : '';
  data.password = !_.isEmpty(data.password) ? data.password : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = 'email is invalid';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'email field is required';
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = 'password field is required';
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};
