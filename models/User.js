const mongoose = require('mongoose');
const { Schema } = mongoose;

const CryptoJS = require('crypto-js');
const CryptoKey = require('../config').keys.crypto;

const userSchema = new Schema({
  isSocial: { type: Boolean, default: false },
  googleId: { type: String, default: null },
  facebookId: { type: String, default: null },
  githubId: { type: String, default: null },
  lastName: String,
  firstName: String,
  email: String,
  password: String,
  avatar: { type: String, default: null },
  validated: { type: Boolean, default: false },
  validationCode: String,
  validationExpiration: Date,
  resetToken: String,
  resetExpiration: Date
});

userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.statics.findOneOrCreate = async function(query, obj, done) {
  //Determine if user exists. If true, update then return user
  var user = await this.findOneAndUpdate(query, { $set: obj }, { new: true });
  if (user) {
    return done(null, user);
  }

  user = await new this(obj).save();
  return done(null, user);
};

userSchema.statics.passwordEncrypter = function(password) {
  return CryptoJS.HmacSHA256(password.trim(), CryptoKey).toString();
};

userSchema.methods.validationCodeBuilder = function() {
  return CryptoJS.HmacSHA1(
    this._id + Date() + this.email,
    CryptoKey
  ).toString();
};

userSchema.methods.resetTokenBuilder = function() {
  return CryptoJS.HmacSHA1(
    this._id + Date() + this.email + this.validationCode,
    CryptoKey
  ).toString();
};

userSchema.methods.expiryDateBuilder = function(days) {
  //Hours * Minutes * Seconds * Milliseconds * Day(s)
  return new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * days).toString();
};

userSchema.methods.validatePassword = function(password) {
  return this.password === password ? true : false;
};

mongoose.model('users', userSchema);
