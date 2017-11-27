//Dependencies -> NPM Modules
const fs = require('fs');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const htmlToText = require('html-to-text');

var myFunctions = {};

myFunctions.readHTMLFile = filePath =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

myFunctions.sendMail = async function(templatePath, config, replacements) {
  var funcErr = false;
  if (templatePath === undefined) {
    funcErr = true;
    throw new Error('No file specified');
  }

  if (config === undefined) {
    funcErr = true;
    throw new Error('No configuration details specified');
  }

  var configProps = ['service', 'user', 'pass', 'from', 'to', 'subject'];
  configProps.forEach(prop => {
    if (!config.hasOwnProperty(prop)) {
      funcErr = true;
      throw new Error(`Configuration property, '${prop}' not specified`);
    }
  });

  var configObj = {
    service: config.service,
    auth: {
      user: config.user,
      pass: config.pass
    }
  };

  //ELLISSOL Configuration
  if (config.service === 'ELLISSOL') {
    configObj.host = 'smtp.zoho.com';
    configObj.port = 465;
    configObj.secure = true; // use SSL
  }

  //HOTMAIL Configuration
  if (config.service === 'HOTMAIL') {
    configObj.host = 'smtp-mail.outlook.com';
    configObj.port = 587;
    configObj.secure = false; // do not use SSL
    configObj.requireTLS = true;
  }

  //E-Mail User with Validation Link w/ Nodemailer
  const transporter = nodemailer.createTransport(configObj);
  var transError = false;
  try {
    //Get HTML email and apply handlebars
    var html = await myFunctions.readHTMLFile(templatePath);
    html = handlebars.compile(html)(replacements);

    //Configure Mail Options
    var mailOptions = {
      from: `YouVote Application <${config.from}>`,
      to: config.to,
      subject: config.subject, // Subject line
      text: htmlToText.fromString(html),
      html
    };

    // send mail with defined transport object
    const transporter = nodemailer.createTransport(configObj);
    var response = await transporter.sendMail(mailOptions);

    if (!response.accepted) {
      transError = true;
    }
  } catch (ex) {
    console.log('Email delivery error: ', ex);
    transError = true;
  }
  return !transError;
};
module.exports = myFunctions;
