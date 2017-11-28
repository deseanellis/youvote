const URI = require('../config').uri;

module.exports = function(req, res, next) {
  var whitelist = [];
  if (process.env.NODE_ENV === 'production') {
    whitelist = [URI.home.replace(/https:\/\/|http:\/\//g, '')];
  } else {
    whitelist = ['localhost:3000', 'localhost:5000'];
  }
  if (whitelist.indexOf(req.headers.host) === -1) {
    return res.status(401).send('Unauthorised request for resource');
  }

  next();
};
