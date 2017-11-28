const axios = require('axios');
const URI = require('../config').uri;

module.exports = async function(req, res, next) {
  //Validate User Inputs
  var result = await validateForm(req.body);
  if (!result) {
    const errcode = Date.now();
    return res.json({
      success: false,
      error: 'Form validation failed. Please enable JavaScript.'
    });
  }

  next();
};

async function validateForm(obj) {
  const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
  const regexPassword = /((?=.*\d)(?=.*[a-z]).{6,20})/g; //Between 6-20 Chars, 1 Digit
  /* const regexPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/g; //Between 6-20 Chars, 1 Cap, 1 Symbol(@#$%), 1 Digit */

  var { firstName, lastName, email, password, avatar } = obj;

  //Check for Empty Strings
  if (stringNotEmpty([firstName, lastName, email, password])) {
    //Validate E-Mail Address
    if (regexEmail.test(email)) {
      //Validate Password
      if (regexPassword.test(password)) {
        //Validate against duplicated emails
        var user = await axios.get(`${URI.home}/api/user/checkemail/${email}`);
        if (user.data.success && !user.data.exists) {
          return true;
        }
      }
    }
  }
  return false;
}

function stringNotEmpty(arr) {
  arr.forEach(str => {
    if (str.trim().length === 0) {
      return false;
    }
  });
  return true;
}
