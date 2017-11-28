//Dependencies -> NPM Modules
const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const mongoose = require('mongoose');
const sslRedirect = require('heroku-ssl-redirect');
const bodyParser = require('body-parser');
const path = require('path');

//Dependencies -> Custom Project Modules
const Keys = require('./config').keys;
const Database = require('./config').database;

//DB Connections
mongoose.connect(Database.connectionString);

//Direct Import DB Models
require('./models/User'); //Build User Class
require('./models/Poll'); //Build Poll Class

//Initialise Express Application and Set view engine
const app = express();
app.set('view engine', 'pug');

//Apply Global Middleware
app.use(bodyParser.json());
app.use(sslRedirect()); // enable forced ssl redirect
app.use(
  '/profile/images',
  express.static(path.join(__dirname + '/avatar_uploads'))
);

//Apply and Configure Partial Middleware
app.use(
  cookieSession({
    maxAge: 20 * 24 * 60 * 60 * 1000,
    keys: [Keys.session.serverSecret]
  })
);

app.use(passport.initialize());
app.use(passport.session());

//Direct Import Services and Routes
require('./services'); //All Passport Services
require('./routes/auth')(app);
require('./routes/poll')(app);
require('./routes/validation')(app);

if (process.env.NODE_ENV === 'production') {
  //Express will serve production assets
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  app.use(express.static('client/public'));
}

//Listener and Port
const PORT = process.env.PORT || 5000;
app.listen(PORT);
