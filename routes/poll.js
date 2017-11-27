//Dependencies -> NPM Modules
const mongoose = require('mongoose');
const multer = require('multer');

const Hashids = require('hashids');
const HashIdKey = require('../config').keys.hashId;
const hashids = new Hashids(HashIdKey);

const requireLogin = require('../middleware/requireLogin');

const Poll = mongoose.model('polls');
const ObjectId = mongoose.Types.ObjectId;

const POLL_REQ_LIMIT = 500;

module.exports = app => {
  //Route Handler: Create Poll
  app.post('/api/poll', requireLogin, async (req, res) => {
    var { title, options, isPrivate } = req.body;
    title = title.trim();

    //Filter and Trim Options
    options = options
      .filter(option => {
        return option.value.trim().length > 0;
      })
      .map(option => {
        return option.value.trim();
      });

    //Validate Inputs
    if (!title || options.length === 0) {
      return res.json({
        success: false,
        error: 'Form validation failed. Please enable JavaScript.'
      });
    }

    try {
      var poll = await new Poll({
        title,
        options,
        isPrivate,
        _user: ObjectId(req.user._id)
      }).save();
      if (poll) {
        //Add Hash ID to Poll JSON
        return res.json({ success: true, poll });
      }
    } catch (ex) {
      return res.json({ success: false, exception: ex });
    }
    res.json({ success: false });
  });

  //Route Handler: Delete Poll
  app.post('/api/poll/delete', requireLogin, async (req, res) => {
    const { toDelete } = req.body;
    try {
      var poll = await Poll.remove({
        _id: { $in: toDelete },
        _user: ObjectId(req.user._id)
      });
      if (poll && poll.result.n > 0) {
        return res.json({ success: true });
      }
    } catch (ex) {
      return res.json({ success: false, exception: ex });
    }
    res.json({ success: false, error: 'Request failed' });
  });

  //Route Handler: Update Poll
  app.post('/api/poll/update/:id', requireLogin, async (req, res) => {
    const _id = req.params.id;
    var { options, isPrivate } = req.body;
    try {
      var poll = await Poll.findOne({ _id, _user: ObjectId(req.user._id) });
      if (poll) {
        poll.options = options.map(option => option.value.trim());
        poll.isPrivate = isPrivate;
        poll = await poll.save();
        return res.json({ success: true, poll });
      }
    } catch (ex) {
      return res.json({ success: false, exception: ex });
    }
    res.json({ success: false });
  });

  //Route Handler: View Polls
  app.get('/api/poll?', async (req, res) => {
    const limit = Number(req.query.limit) || POLL_REQ_LIMIT;
    const field = req.query.field || 'dateCreated';
    const sorted = Number(req.query.sorted) || -1;
    const all = Number(req.query.all) || 0;

    try {
      var sort = {};
      var poll; //Store Poll Information
      sort[field] = sorted;
      if (all === 1) {
        poll = await Poll.aggregate(
          {
            $match: {
              isPrivate: false
            }
          },
          {
            $project: {
              title: 1,
              _user: 1,
              lastResponded: 1,
              dateCreated: 1,
              voters: 1,
              voterCount: { $size: '$voters' }
            }
          },
          {
            $sort: sort
          },
          {
            $limit: limit
          }
        );
      } else {
        if (!req.user) {
          return res.json({ success: false, error: 'No logged in user' });
        }
        const _user = req.user._id;
        poll = await Poll.aggregate(
          {
            $match: {
              _user
            }
          },
          {
            $project: {
              title: 1,
              _user: 1,
              lastResponded: 1,
              dateCreated: 1,
              voters: 1,
              voterCount: { $size: '$voters' }
            }
          },
          {
            $sort: sort
          },
          {
            $limit: limit
          }
        );
      }

      if (poll) {
        //Build HASH IDS
        poll = poll.map(el => {
          return { ...el, hashId: hashids.encodeHex(el._id) };
        });
        return res.json({ success: true, polls: poll });
      }
    } catch (ex) {
      return res.json({ success: false, exception: ex });
    }
    res.json({ success: false, error: 'Request failed' });
  });

  //Route Handler: Get Poll Information for Polls User Voted On
  app.get('/api/poll/voted?', requireLogin, async (req, res) => {
    const _user = req.user._id;
    const limit = Number(req.query.limit) || POLL_REQ_LIMIT;
    const field = req.query.field || 'dateCreated';
    const sorted = Number(req.query.sorted) || -1;

    try {
      var sort = {};
      sort[field] = sorted;
      var polls = await Poll.find({ voters: { $elemMatch: { voter: _user } } })
        .limit(limit)
        .sort(sort);
      if (polls) {
        return res.json({ success: true, polls });
      }
    } catch (ex) {
      return res.json({ success: false, exception: ex });
    }
    res.json({ success: false, error: 'Request failed' });
  });

  //Route Hanlder: Search for Poll
  app.get('/api/poll/search?', async (req, res) => {
    const limit = Number(req.query.limit) || POLL_REQ_LIMIT;
    var keywords = req.query.keywords || '';

    try {
      var polls = await Poll.searchPolls(keywords, limit);
      if (keywords.trim().length < 2) {
        polls = [];
      }
      return res.json({ success: true, polls });
    } catch (ex) {
      return res.json({ success: false, exception: ex });
    }
    res.json({ success: false });
  });

  //Route Hanlder: Get Single Poll Information for Charts
  app.get('/api/poll/single/:id?', async (req, res) => {
    const pollId = req.params.id;
    const sorted = Number(req.query.sorted) || 1;

    try {
      var poll = await Poll.findOne({ _id: pollId });
      //If Poll Found Get Options Array
      if (poll) {
        var options = poll.options;
        var groups = await Poll.aggregate(
          {
            $match: { _id: ObjectId(pollId) }
          },
          {
            $project: {
              'voters.voter': 1,
              'voters.option': 1
            }
          },
          {
            $unwind: '$voters'
          },
          {
            $match: { 'voters.option': { $in: options } }
          },
          {
            $group: {
              _id: '$voters.option',
              count: { $sum: 1 }
            }
          }
        );

        var groupNames = groups.map(group => group._id);
        //Push Empty Results to Array
        options.forEach(option => {
          if (groupNames.indexOf(option) === -1) {
            groups.push({ _id: option, count: 0 });
          }
        });

        groups.sort((a, b) => {
          if (a._id < b._id) return -1;
          if (a._id > b._id) return 1;
          return 0;
        });
        return res.json({
          success: true,
          poll: {
            _id: poll._id,
            title: poll.title,
            options: poll.options,
            lastResponded: poll.lastResponded,
            isPrivate: poll.isPrivate,
            user: poll._user
          },
          groups
        });
      }
      return res.json({ success: false, error: 'No poll found!' });
    } catch (ex) {
      return res.json({ success: false, exception: ex });
    }
    res.json({ success: false });
  });

  //Route Hanlder: Respond to Poll Option
  app.post('/api/poll/:id/:option', async (req, res) => {
    const pollId = req.params.id;
    const option = req.params.option;
    var userId = req.connection.remoteAddress;
    if (req.headers['x-forwarded-for']) {
      userId = req.headers['x-forwarded-for'].split(',')[0];
    }

    if (req.user) {
      userId = req.user._id;
    }

    //Find User Vote or Add a New One
    try {
      var poll = await Poll.findOneAndUpdateOrCreate(pollId, userId, option);
      if (poll) {
        return res.json({ success: true, poll });
      }
    } catch (ex) {
      return res.json({ success: false, exception: ex });
    }

    res.json({ success: false });
  });
};
