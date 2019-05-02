const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.query = !isEmpty(data.query) ? data.query : '';
  data.provider = !isEmpty(data.provider) ? data.provider : '';
  data.options.user = !isEmpty(data.options.user) ? data.options.user : '';
  data.options.password = !isEmpty(data.options.password) ? data.options.password : '';
  data.callbackurl = !isEmpty(data.callbackurl) ? data.callbackurl : '';

  if (Validator.isEmpty(data.query)) {
    errors.query = 'Query field is required';
  }

  if (Validator.isEmpty(data.provider)) {
    errors.provider = 'provider field is required';
  }

  if (Validator.isEmpty(data.options.user)) {
    errors.optionsu = 'user field is required';
  }

  if (Validator.isEmpty(data.options.password)) {
    errors.optionsp = 'password field is required';
  }

  if (Validator.isEmpty(data.callbackurl)) {
    errors.callbackurl = 'callbackurl field is required';
  }

  if (!Validator.isLength(data.query, { min: 2, max: 30 })) {
    errors.query = 'query must be between 2 and 30 characters';
  }

  if (!Validator.isLength(data.provider, { min: 2, max: 30 })) {
    errors.provider = 'provider must be between 2 and 30 characters';
  }

  if (!Validator.isLength(data.provider, { min: 2, max: 30 })) {
    errors.provider = 'provider must be between 2 and 30 characters';
  }

  if (!isEmpty(data.callbackurl)) {
    if (!Validator.isURL(data.callbackurl)) {
      errors.callbackurl = 'Not a valid URL';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
