const mongoose = require('mongoose');
const { Schema } = mongoose;

const voterSchema = new Schema({
  voter: String,
  option: String
});

module.exports = voterSchema;
