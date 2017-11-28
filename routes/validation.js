//Dependencies -> NPM Modules
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const htmlToText = require('html-to-text');
const mongoose = require('mongoose');
const path = require('path');
const { sendMail } = require('../functions');
const CryptoJS = require('crypto-js');
const CryptoKey = require('../config').keys.crypto;
const URI = require('../config').uri;
const Mail = require('../config').mail;

const User = mongoose.model('users');

module.exports = app => {
  //Route Hanlder: Reset User Password
  app.post('/api/resetpassword', async (req, res) => {
    var { email } = req.body;

    try {
      var user = await User.findOne({ email: email.trim(), isSocial: false });
      if (user) {
        if (!user.validated) {
          return res.json({
            success: false,
            error: 'User e-mail address has not been validated.'
          });
        }
        user.resetToken = user.resetTokenBuilder();
        user.resetExpiration = user.expiryDateBuilder(1 / 12); //Expires two hours after
        user = await user.save();

        //Build Reset Link
        var userLink = `${URI.home}/changepassword/${user.resetToken}/${user.email}`;
        var templatePath = path.join(
          __dirname,
          '..',
          'email_templates',
          'password_reset.html'
        );
        var emailConfig = {
          service: Mail.HOTMAIL.service,
          user: Mail.HOTMAIL.user,
          pass: Mail.HOTMAIL.pass,
          from: Mail.HOTMAIL.user,
          to: email.trim(),
          subject: 'YouVote Application - Reset Your Account Password'
        };

        if (
          sendMail(templatePath, emailConfig, {
            fullName: user.fullName,
            userLink
          })
        ) {
          return res.json({ success: true });
        }
        return res.json({ success: false, error: 'E-Mail delivery error' });
      }
    } catch (ex) {
      return res.json({ success: false, exception: ex });
    }
    res.json({
      success: false,
      error: 'No user record found for requested e-mail address'
    });
  });

  //Route Handler: Send Initial-Validation Email
  app.post('/api/initialsend', async (req, res) => {
    var { email } = req.body;

    try {
      var user = await User.findOne({ email: email.trim() });
      if (user) {
        //Build User Link
        var userLink = `${URI.home}/api/validation/?email=${user.email}&code=${user.validationCode}`;
        var templatePath = path.join(
          __dirname,
          '..',
          'email_templates',
          'initialsend.html'
        );
        var emailConfig = {
          service: Mail.HOTMAIL.service,
          user: Mail.HOTMAIL.user,
          pass: Mail.HOTMAIL.pass,
          from: Mail.HOTMAIL.user,
          to: email.trim(),
          subject: 'YouVote Application - Validate Your E-Mail Address'
        };
        var response = await sendMail(templatePath, emailConfig, {
          fullName: user.fullName,
          userLink
        });

        if (response) {
          return res.json({ success: true });
        }
        return res.json({ success: false, warning: 'E-Mail delivery error' });
      }
      return res.json({
        success: false,
        error: 'No user found'
      });
    } catch (ex) {
      return res.json({ success: false, exception: ex });
    }
  });

  //Route Hanlder: Re-Send Validation Email
  app.post('/api/resend', async (req, res) => {
    var { email } = req.body;

    try {
      var user = await User.findOne({ email: email.trim() });
      if (user) {
        var validationExpiration = new Date(user.validationExpiration);
        if (
          !user.validated &&
          new Date().getTime() > validationExpiration.getTime()
        ) {
          //Update User Validation Code and Expiration
          user.validationCode = user.validationCodeBuilder();
          user.validationExpiration = user.expiryDateBuilder(1);
          user = await user.save();

          //Build User Link
          var userLink = `${URI.home}/api/validation/?email=${user.email}&code=${user.validationCode}`;
          var templatePath = path.join(
            __dirname,
            '..',
            'email_templates',
            'resend.html'
          );
          var emailConfig = {
            service: Mail.HOTMAIL.service,
            user: Mail.HOTMAIL.user,
            pass: Mail.HOTMAIL.pass,
            from: Mail.HOTMAIL.user,
            to: email.trim(),
            subject: 'YouVote Application - Validate Your E-Mail Address'
          };
          if (
            sendMail(templatePath, emailConfig, {
              fullName: user.fullName,
              userLink
            })
          ) {
            return res.json({ success: true });
          }
          return res.json({ success: false, error: 'E-Mail delivery error' });
        }
        return res.json({
          success: false,
          error:
            'User e-mail address has been previously validated or previously sent validation has not expired'
        });
      }
    } catch (ex) {
      return res.json({ success: false, exception: ex });
    }
    res.json({
      success: false,
      error: 'No user record found for requested e-mail address'
    });
  });

  //Route Handler: Validate Forgot Password URI
  app.post('/api/validate/changepassworduri', async (req, res) => {
    const { code, email } = req.body;

    try {
      var user = await User.findOne({
        email,
        resetToken: code,
        resetExpiration: { $gte: new Date() }
      });
      if (user) {
        return res.json({ success: true });
      }
    } catch (ex) {
      return res.json({ success: false, exception: ex });
    }
    res.json({ success: false });
  });

  //Route Handler: Validate User E-Mail
  app.get('/api/validation/?', async (req, res) => {
    var email = req.query.email || '';
    var code = req.query.code || '';

    try {
      var user = await User.findOne({
        email: email.trim(),
        validationCode: code.trim()
      });
      var renderObj = {};

      if (user) {
        var validationExpiration = new Date(user.validationExpiration);

        //Check if User is Validated Already and Check if Validation Has Expired
        if (user.validated) {
          renderObj = {
            message: 'User has already been validated',
            returnLink: { message: 'You can return home and login', href: '/' }
          };
        } else if (new Date().getTime() > validationExpiration.getTime()) {
          renderObj = {
            message: 'Validation link has expired',
            returnLink: {
              message: 'You can re-send another validation request',
              href: '/'
            }
          };
        } else {
          user.validated = true;
          user = await user.save();

          if (user) {
            renderObj = {
              message:
                'E-mail has been successfully validated, however, automatic login failed',
              returnLink: {
                message: 'You can return home and login',
                href: '/'
              }
            };
            req.login(user, loginErr => {
              if (!loginErr) {
                renderObj = {
                  message:
                    'E-mail has been successfully validated. You should soon be redirected to the home screen',
                  returnLink: {
                    message: 'If you did not get redirected, you can click',
                    href: '/poll/viewer/personal'
                  },
                  redirect: true,
                  redirectLink: '/poll/viewer/personal'
                };
              }
            });
          } else {
            renderObj = {
              message: 'Validation attempt failed. Please try again',
              returnLink: {
                message: 'You can return home',
                href: '/'
              }
            };
          }
        }
      } else {
        renderObj = {
          message: 'Validation request link invalid'
        };
      }

      return res.render('validation', renderObj);
    } catch (ex) {
      renderObj = {
        message: 'Request failed unexpectedly',
        returnLink: {
          message: 'You can return home',
          href: '/'
        }
      };
      return res.render('validation', renderObj);
    }
    renderObj = {
      message: 'Request failed',
      returnLink: {
        message: 'You can return home',
        href: '/'
      }
    };
    res.render('validation', renderObj);
  });
};
