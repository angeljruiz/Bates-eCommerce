"use strict";

let express = require('express');
let app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  var morgan = require('morgan');
  var webpack = require('webpack')
  var webpackDevMiddleware = require('webpack-dev-middleware')
  var webpackHotMiddleware = require('webpack-hot-middleware')
  var webpackConfig = require('./config/webpack.config')
  var compiler = webpack(webpackConfig)
  
  app.use(morgan('dev'));
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
  app.use(webpackHotMiddleware(compiler))
}

let flash = require('connect-flash-plus');
let session = require('express-session');
let bp = require('body-parser');
let passport = require('passport');
let fs = require('fs');
let db = require('./scripts/database');
let pgSession = require('connect-pg-simple')(session);

// app.locals.pretty = true;

app.use(session({
  store: new pgSession({
    pool : db.pool,           
  }),
  secret: 'iuhiuhedgriuyHG(*&)',
  name: 'BeCommercecookies',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bp.urlencoded({extended: true}));
app.use(bp.json());
app.use(flash());

app.set('view engine', 'pug');
app.set('views', './views');

let Auth = require('./config/auth');
app.use('/auth', Auth);

app.use('/react', express.static('client/build'));
app.use('/css', express.static('css'));
app.use('/media', express.static('media'));
app.use('/js', express.static('js'));
app.use('/uploads', express.static('uploads'));
app.use('/vendor', express.static('vendor'));

require('./routes/utilities')(app, passport);
require('./routes/routes')(app, passport);

app.use(express.static('client/build'))

let autoViews = {};
const reg = /(login|signup)/;

app.use( (req, res, next) => {
  let path = req.path.toLowerCase();
  if (reg.test(path) && req.isAuthenticated())
    return res.redirect('/');
  if (autoViews[path]) return res.render(autoViews[path]);
  if (fs.existsSync(__dirname + '/views' + path + '.pug')) {
    autoViews[path] = path.replace(/^\//, '');
    return res.render(autoViews[path]);
  }
  next();
});

let port = 80

app.listen(process.env.PORT || 80, () => {
    console.log('listening on ' + (process.env.PORT || 80));
});
