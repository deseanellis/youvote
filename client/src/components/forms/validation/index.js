import axios from 'axios';
import { REGISTRATION_FORM_FIELDS, LOGIN_FORM_FIELDS } from '../../formData';

export const validateForgotPassword = values => {
  //Email regex
  const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;

  const errors = {};

  if (!values.email) {
    errors.email = 'Enter your email address';
  }

  if (!regexEmail.test(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  return errors;
};

export const validateChangePassword = values => {
  //Between 6-20 Chars, 1 Digit
  const regexPassword = /((?=.*\d)(?=.*[a-z]).{6,20})/g;

  const errors = {};

  if (!values.currentPassword) {
    errors.currentPassword = `Enter your current password`;
  }

  //Validate Password
  if (!regexPassword.test(values.password)) {
    errors.password =
      'Passwords must be between 6-20 characters and contain at least one (1) digit';
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = `Confirm password does not match`;
  }

  return errors;
};

export const validateCreatePoll = values => {
  const errors = {};

  if (!values.title) {
    errors.title = `Enter a title for your poll`;
  }

  return errors;
};

export const validateLogin = values => {
  //Email regex
  const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;

  const errors = {};

  LOGIN_FORM_FIELDS.forEach(({ name, label, required, type }) => {
    if (required) {
      if (!values[name]) {
        errors[name] = `Enter your ${label.toLowerCase()}`;
      }
    }

    if (type === 'email') {
      if (!regexEmail.test(values[name])) {
        errors[name] = 'Enter a valid email address';
      }
    }
  });

  return errors;
};

export const validate = values => {
  //Email regex
  const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
  //Between 6-20 Chars, 1 Digit
  const regexPassword = /((?=.*\d)(?=.*[a-z]).{6,20})/g;

  const errors = {};

  REGISTRATION_FORM_FIELDS.forEach(field => {
    if (Array.isArray(field)) {
      field.forEach(({ name, label, required }) => {
        if (required) {
          if (!values[name]) {
            if (name === 'confirmPassword') {
              errors[name] = 'Confirm your password';
            } else {
              errors[name] = `Enter your ${label.toLowerCase()}`;
            }
          }
        }
      });
    } else {
      if (field.required) {
        if (!values[field.name]) {
          errors[field.name] = `Enter your ${field.label.toLowerCase()}`;
        }
      }
    }
  });

  //Validate E-Mail
  if (!regexEmail.test(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  //Validate Password
  if (!regexPassword.test(values.password)) {
    errors.password =
      'Passwords must be between 6-20 characters and contain at least one (1) digit';
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Confirm password does not match';
  }
  return errors;
};

export const asyncValidate = async values => {
  function AsyncException(exceptions) {
    exceptions.forEach(exception => {
      let { key, message } = exception;
      this[key] = message;
    });
  }

  const res = await axios.get(`/api/user/checkemail/${values.email.trim()}`);
  if (res.data.success && res.data.exists) {
    throw new AsyncException([
      {
        key: 'email',
        message: 'This email address belongs to an existing account'
      }
    ]);
  }
};
