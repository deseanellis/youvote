const passport = require('passport');
const mongoose = require('mongoose');

//Retrieve User Model Collection
const User = mongoose.model('users');

//Stripping and De-stripping for Browser requests through Passport Middleware
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, {
    firstName: 1,
    lastName: 1,
    email: 1,
    avatar: 1,
    isSocial: 1,
    avatar: 1
  }).then(function(user) {
    done(null, user);
  });
});
