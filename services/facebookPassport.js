//Dependencies -> NPM Modules
const passport = require('passport');
const mongoose = require('mongoose');
const FacebookStrategy = require('passport-facebook').Strategy;

//Import Facebook key information
const FacebookKeys = require('../config').keys.facebook;

//Retrieve User Model Collection
const User = mongoose.model('users');

//Facebook OAuth20 Setup
passport.use(
  new FacebookStrategy(
    {
      clientID: FacebookKeys.clientId,
      clientSecret: FacebookKeys.clientSecret,
      callbackURL: '/api/login/facebook/callback',
      profileFields: ['id', 'first_name', 'last_name', 'picture', 'email'],
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      var userObj = {
        isSocial: true,
        facebookId: profile.id,
        lastName: profile.name.familyName,
        firstName: profile.name.givenName,
        email: profile.emails[0].value,
        avatar: `https://graph.facebook.com/${profile.id}/picture?width=500&height=500`,
        validated: true
      };

      User.findOneOrCreate({ facebookId: profile.id }, userObj, done);
    }
  )
);
