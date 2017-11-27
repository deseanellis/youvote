//Dependencies -> NPM Modules
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;

//Retrieve User Model Collection
const User = mongoose.model('users');

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      const ERR = 'Incorrect email/password combination';
      password = User.passwordEncrypter(password);
      try {
        var user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: ERR });
        }

        if (!user.validatePassword(password)) {
          return done(null, false, { message: ERR });
        }

        if (!user.validated) {
          return done(null, false, {
            message: `E-mail address has not been validated. Click <a href="/resend/validation/${email}">here</a> to resend`,
            warning: true
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
