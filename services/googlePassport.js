//Dependencies -> NPM Modules
const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

//Import Google key information
const GoogleKeys = require('../config').keys.google;

//Retrieve User Model Collection
const User = mongoose.model('users');

//Google OAuth20 Setup
passport.use(
  new GoogleStrategy(
    {
      clientID: GoogleKeys.clientId,
      clientSecret: GoogleKeys.clientSecret,
      callbackURL: '/api/login/google/callback',
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      var userObj = {
        isSocial: true,
        googleId: profile.id,
        lastName: profile.name.familyName,
        firstName: profile.name.givenName,
        email: profile.emails[0].value,
        avatar: profile._json.image.url.replace(/sz=50/, 'sz=500'),
        validated: true
      };

      User.findOneOrCreate({ googleId: profile.id }, userObj, done);
    }
  )
);
