//Dependencies -> NPM Modules
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const htmlToText = require('html-to-text');
const mongoose = require('mongoose');
const { sendMail } = require('../functions');
const CryptoJS = require('crypto-js');
const URI = require('../config').uri;
const ObjectId = mongoose.Types.ObjectId;
const passport = require('passport');
const bodyParser = require('body-parser');
const multer = require('multer');
const cloudinary = require('cloudinary');

//Middlewares
const validateRegistration = require('../middleware/validateRegistration');
const requireLogin = require('../middleware/requireLogin');

//Crypto Key
const CryptoKey = require('../config').keys.crypto;

//Cloudinary Configuration
const CloudinaryConfig = require('../config').cloudinary;

//Models
const User = mongoose.model('users');

//Apply Cloudinary Configuration
cloudinary.config(CloudinaryConfig);

/************Auth Routes*************/
module.exports = app => {
  //Route Handler: Email and Password Auth
  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.json({ success: false, error: err });
      }

      if (!user) {
        let returnObj = { success: false };
        if (info.warning === true) {
          returnObj.warning = info.message;
        } else {
          returnObj.error = info.message;
        }
        return res.json(returnObj);
      }

      try {
        req.login(user, loginErr => {
          if (loginErr) {
            return res.json({ success: false, error: loginErr });
          }
          return res.send({ success: true });
        });
      } catch (ex) {
        return res.json({ success: false, exception: ex });
      }
    })(req, res, next);
  });

  //Route Handler: Register User
  var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'avatar_uploads/');
    },
    filename: function(req, file, cb) {
      var ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
      var filename = file.originalname + file.size + Date.now();
      filename = CryptoJS.HmacSHA1(filename, CryptoKey).toString() + ext;
      cb(null, filename);
    }
  });

  var upload = multer({ storage: storage });

  app.post('/api/register', validateRegistration, async (req, res) => {
    //Constant for User Object
    const { firstName, lastName, email } = req.body;
    const password = User.passwordEncrypter(req.body.password);

    try {
      //Hours * Minutes * Seconds * Milliseconds * Day(s)
      var validationExpiration = new Date(
        new Date().getTime() + 24 * 60 * 60 * 1000 * 1
      ).toString();

      var user = await new User({
        firstName,
        lastName,
        email,
        password
      }).save();

      //Apply Validation Code
      user.validationCode = user.validationCodeBuilder();
      user.validationExpiration = user.expiryDateBuilder(1);
      user = await user.save();

      if (user) {
        return res.json({ success: true, email: user.email });
      }
    } catch (ex) {
      return res.json({ success: false, exception: ex });
    }
    res.json({ success: false });
  });

  //Route Handler: Update User Information
  app.post(
    '/api/user/update/:type',
    upload.single('avatar'),
    async (req, res) => {
      var userObj = {};
      var query = {};
      var oldpass = '';
      var err = '';
      var redirectURL = '/basicinformation';

      if (req.params.type === 'password') {
        userObj.password = User.passwordEncrypter(req.body.newpass);
        if (req.body.tokenClear === true) {
          userObj.resetToken = null;
          userObj.resetExpiration = new Date();
        }

        if (req.user) {
          query['_id'] = ObjectId(req.user._id);
        }

        if (req.body.email) {
          query['email'] = req.body.email;
        }

        if (oldpass) {
          query['password'] = oldpass;
        }

        if (req.body.oldpass) {
          oldpass = User.passwordEncrypter(req.body.oldpass);
        }
        err = 'Password update failed!';
      }

      if (req.params.type === 'basic') {
        const { firstName, lastName } = req.body;
        query = { _id: ObjectId(req.user._id) };
        //err = 'User basic information update failed!';

        userObj = {
          firstName,
          lastName
        };
      }

      try {
        var user = await User.findOneAndUpdate(query, userObj, { new: true });

        if (user) {
          //Check if profile picture needs to update
          if (req.file) {
            var cloudinaryRes = await cloudinary.uploader.upload(
              req.file.path,
              {
                crop: 'crop',
                width: 500,
                height: 500
              }
            );

            user.avatar = cloudinaryRes.secure_url;
            user = await user.save();
          }
          if (req.params.type === 'password') {
            return res.json({ success: true });
          }
          return res.redirect(redirectURL + '/success');
        } else {
          if (req.params.type === 'password') {
            return res.json({
              success: false,
              error: 'Current password does not match against our records.'
            });
          }
          return res.redirect(redirectURL + '/failed');
        }
      } catch (ex) {
        if (req.params.type === 'password') {
          return res.json({ success: false, exception: ex });
        }
        return res.redirect(redirectURL + '/failed');
      }
      if (req.params.type === 'basic') {
        return res.redirect(redirectURL + '/failed');
      }
      res.json({ success: false, error: err });
    }
  );

  //Route Handler: Get Email Address Duplication Checked
  app.get('/api/user/checkemail/:email', async (req, res) => {
    if (!req.params.email) {
      return res.json({ success: false, exists: false });
    }
    try {
      var result = await User.findOne({ email: req.params.email });
      if (result) {
        return res.json({ success: true, exists: true, result });
      } else {
        return res.json({ success: true, exists: false });
      }
    } catch (ex) {
      return res.json({ success: false, exception: ex });
    }
    res.json({ success: false });
  });

  //Route Handler: Get Current User JSON
  app.get('/api/user', (req, res) => {
    if (req.user) {
      return res.json({
        success: true,
        user: { ...req.user._doc, fullName: req.user.fullName }
      });
    }

    res.json({ success: false, user: {} });
  });

  //Route Hanlder: Logout User
  app.get('/api/user/logout', requireLogin, (req, res) => {
    if (req.user) {
      req.logout();
      res.redirect('/');
    }
  });

  /*** OAUTH ROUTE HANDLERS: FACEBOOK, GOOGLE, GITHUB ***/

  //Route Handler: OAuth First Call
  app.get(
    '/api/login/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/api/login/facebook',
    passport.authenticate('facebook', {
      scope: ['public_profile', 'email']
    })
  );

  app.get(
    '/api/login/github',
    passport.authenticate('github', {
      scope: ['user:email']
    })
  );

  //Route Handler: Get Callback Code
  app.get(
    '/api/login/google/callback',
    passport.authenticate('google', {
      successRedirect: '/poll/viewer/personal',
      failureRedirect: '/signin'
    })
  );

  app.get(
    '/api/login/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/poll/viewer/personal',
      failureRedirect: '/signin'
    })
  );

  app.get(
    '/api/login/github/callback',
    passport.authenticate('github', {
      successRedirect: '/poll/viewer/personal',
      failureRedirect: '/signin'
    })
  );
};
