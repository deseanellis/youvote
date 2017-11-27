const mongoose = require('mongoose');
const Hashids = require('hashids');
const { Schema } = mongoose;
const HashIdKey = require('../config').keys.hashId;

const VoterSchema = require('./Voter');

const pollSchema = new Schema({
  title: String,
  options: { type: Array, default: [] },
  voters: [VoterSchema],
  dateCreated: { type: Date, default: Date() },
  lastResponded: { type: Date, default: null },
  isPrivate: { type: Boolean, default: false },
  matches: Number,
  _user: { type: Schema.Types.ObjectId, ref: 'users' }
});

pollSchema.virtual('hashId').get(function() {
  const hashids = new Hashids(HashIdKey);
  const encodedId = hashids.encodeHex(this._id);
  return encodedId;
});

pollSchema.virtual('voterCount').get(function() {
  return this.voters.length;
});

pollSchema.set('toJSON', {
  virtuals: true
});

pollSchema.set('toObject', {
  virtuals: true
});

pollSchema.statics.searchPolls = async function(keywords, limit) {
  if (!keywords || keywords.trim().length === 0) {
    return [];
  }

  keywords = keywords.trim().replace(/[,?!$#&"'%@()]/g, '');

  //Split Keywords by spaces
  var arr = keywords.split(' ');

  //Filter out empty array elements
  arr = arr.filter(function(keyword) {
    return keyword.length > 0;
  });

  //Join Array and Create New Regular Expression Object
  var regExp = arr.join('|');
  var polls = await this.find({
    title: new RegExp(regExp, 'gi'),
    isPrivate: false
  })
    .limit(limit)
    .sort({ dateCreated: -1 });
  if (polls.length > 0) {
    polls = bestMatch(polls, regExp);
  }

  return polls;
};

pollSchema.statics.findOneAndUpdateOrCreate = async function(
  pollId,
  userId,
  option
) {
  //Find and Update User Vote
  var poll = await this.findOneAndUpdate(
    {
      _id: pollId,
      voters: { $elemMatch: { voter: userId } }
    },
    { $set: { 'voters.$.option': option, lastResponded: Date() } },
    { new: true }
  );

  //If user has never voted add to collection
  if (!poll) {
    poll = await this.findOne({ _id: pollId });
    poll.lastResponded = Date();
    poll.voters.push({ voter: userId, option });

    poll = await poll.save();
  }
  return poll;
};

mongoose.model('polls', pollSchema);

function bestMatch(polls, regExp) {
  var searchRegex = new RegExp(regExp, 'gi');
  polls = polls.map(function(poll) {
    var count = 0;
    while (searchRegex.exec(poll.title) != null) {
      count++;
    }
    poll.matches = count;
    return poll;
  });

  //Sort by best matches
  return polls.sort(function(a, b) {
    return b.matches - a.matches;
  });
}
