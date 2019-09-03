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
      User.retrieve( ['id', id ], false, user => {
        return done(null, user);
      });
    });
    passport.use('signup', new LocalStrategy( { passReqToCallback: true }, (req, username, password, done) => {
        User.retrieve( ['username', username ], ['id'], user => {
            if (user) {
                req.flash('taken', 'Username already taken');
                return done(null, false);
            }
            var newUser = new User();
            newUser.username = username;
            newUser.email = req.body.email;
            newUser.generateHash(password);
            delete newUser.id;
            newUser.save( false,  () => {
              return done();
            });
        });
    }));
    passport.use('login', new LocalStrategy( { passReqToCallback: true }, (req, username, password, done) => {
      User.retrieve( ['username', username ], false, user => {
          if (!user || !user.validPassword(password)) {
              req.flash('incorrect', 'Invalid username or password');
              return done(null, false);
          }
          return done(null, user);
      });
    }));
};
