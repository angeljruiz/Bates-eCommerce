let express = require('express');
let router = express.Router();

let passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user'); 

passport.serializeUser( (user, done) => {
  done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
  let user = await User.retrieve( ['id', id ], false);
  return done(null, user);
});

passport.use('signup', new LocalStrategy( { passReqToCallback: true }, async (req, username, password, done) => {
  let user = await User.retrieve( ['username', username ], ['id']);
    if (user) {
        return done(null, false);
    }
    var newUser = new User();
    newUser.username = username;
    newUser.email = req.body.email;
    newUser.id = Math.random().toString(10).substring(9);
    newUser.generateHash(password);
    return done(null, await newUser.save() ? newUser : false);
}));

passport.use('google', new GoogleStrategy( { clientID: process.env.GG_ID, clientSecret: process.env.GG_PW, callbackURL: '/auth/google/redirect' }, async (accessToken, refreshToken, profile, done) => {
  let user = await User.retrieve( ['id', profile.id ], ['id']);
  if (user) {
    return done(null, user);
  }
  var newUser = new User();
  newUser.username = profile.displayName;
  newUser.email = profile.emails[0].value;
  newUser.id = profile.id;
  return done(null, (await newUser.save()) ? newUser : false);
}));

passport.use('facebook', new FacebookStrategy( { clientID: process.env.FB_ID, clientSecret: process.env.FB_PASSWORD, callbackURL: '/auth/facebook/redirect', profileFields: ['id', 'emails', 'name'] }, async (accessToken, refreshToken, profile, done) => {
  let user = await User.retrieve( ['id', profile.id ], ['id']);
  if (user) {
    return done(null, user);
  }
  var newUser = new User();
  newUser.username = profile.name.givenName + ' ' + profile.name.familyName;
  newUser.email = profile.emails[0].value;
  newUser.id = profile.id;
  return done(null, await newUser.save() ? newUser : false);
}));

passport.use('login', new LocalStrategy( { passReqToCallback: true }, async (req, username, password, done) => {
  let user = await User.retrieve( ['username', username ], false);
  if (!user || !user.validPassword(password)) {
      req.flash('incorrect', 'Invalid username or password');
      return done(null, false);
  }
  return done(null, user);
}));


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/'}), (req, res) => {
  res.locals.loggedIn = 'true'
  console.log(req.user);
  console.log(res.locals);
  console.log('im here!!!!');
  
  res.redirect('/');
});

router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
  res.redirect('/');
});

module.exports = router;

