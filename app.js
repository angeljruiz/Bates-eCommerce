"use strict";

let express = require('express');
let cors = require('cors');
let app = express().use('*', cors());

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  var morgan = require('morgan');
  
  app.use(morgan('dev'));
  app.locals.pretty = true;
}

let flash = require('connect-flash-plus');
let session = require('express-session');
let bp = require('body-parser');
let passport = require('passport');
let path = require('path');
let db = require('./scripts/database');
let pgSession = require('connect-pg-simple')(session);

app.use(session({
  store: new pgSession({
    pool : db.pool,           
  }),
  secret: 'iuhiuhedgriuyHG(*&)',
  name: 'BeCommercecookies',
  resave: false,
  httpOnly: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bp.urlencoded({extended: true}));
app.use(bp.json());
app.use(flash());
app.use(cors());

app.set('view engine', 'pug');
app.set('views', './views');

let Auth = require('./config/auth');
app.use('/auth', Auth);

app.use('/media', express.static('media'));
app.use('/uploads', express.static('uploads'));
app.use('/vendor', express.static('vendor'));

require('./routes/utilities')(app, passport);

app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use( (_, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

let port = 80

app.listen(process.env.PORT || port, () => {
    console.log('listening on ' + (process.env.PORT || port));
});
