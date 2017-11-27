//Dependencies -> NPM Modules
const passport = require('passport');
const mongoose = require('mongoose');
const GithubStrategy = require('passport-github2').Strategy;

//Import Github key information
const GithubKeys = require('../config').keys.github;

//Retrieve User Model Collection
const User = mongoose.model('users');

//Github OAuth20 Setup
passport.use(
  new GithubStrategy(
    {
      clientID: GithubKeys.clientId,
      clientSecret: GithubKeys.clientSecret,
      callbackURL: '/api/login/github/callback',
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      var userObj = {
        isSocial: true,
        githubId: profile._json.id,
        lastName: profile._json.name.split(' ')[1],
        firstName: profile._json.name.split(' ')[0],
        email: profile._json.email,
        avatar: profile._json.avatar_url,
        validated: true
      };

      User.findOneOrCreate({ githubId: profile.id }, userObj, done);
    }
  )
);
