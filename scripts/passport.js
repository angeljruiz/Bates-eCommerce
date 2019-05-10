/**
 * Created by angel on 7/13/17.
 */

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');


module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      new User({ id: id, messages: false }, (err, user) => {
        return done(null, user);
      });
    });

    passport.use('signup', new LocalStrategy( { passReqToCallback: true }, (req, username, password, done) => {
        new User({ username: username }, (err, user) => {
            if(err)
                return done(err);
            if(user) {
                req.res.flash('taken', 'Username already taken');
                return done(null, false);
              }
            var newUser = new User();
            newUser.username = username;
            newUser.email = req.body.email;
            newUser.generateHash(password);
            newUser.save(() => {
                console.log('user created');
                return done(null, newUser);
            });
        });
    }));
    passport.use('login', new LocalStrategy( { passReqToCallback: true }, (req, username, password, done) => {
      new User({ username: username }, (err, user) => {
          if(err)
              return done(err);
          if(!user || !user.validPassword(password)) {
              req.res.flash('incorrect', 'Invalid username or password');
              return done(null, false);
          }

          return done(null, user);
      });

    }));
};
