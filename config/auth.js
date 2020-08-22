let express = require("express");
let router = express.Router();

let passport = require("passport");

var LocalStrategy = require("passport-local").Strategy;
var BearerStrategy = require("passport-http-bearer").Strategy;
var User = require("../models/user");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  let user = await User.retrieve(["id", id], false);
  return done(null, user);
});

passport.use(
  "bearer",
  new BearerStrategy(async function (token, done) {
    let user = await User.retrieve(["id", token], false);
    done(false, user);
  })
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: "justatemp",

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    (token, done) => {
      try {
        console.log(token.user);
        // let user = await User.retrieve(["id", token.user.id], false);
        // if (!user) {
        //   let newUser = new User(req.body);
        //   newUser.save();

        // }
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "signup",
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: "email",
    },
    async (req, username, password, done) => {
      let user = await User.retrieve(["username", username], ["id"]);
      if (user) {
        return done(null, false);
      }
      var newUser = new User();
      newUser.username = username;
      newUser.email = req.body.email;
      newUser.id = Math.random().toString(10).substring(9);
      newUser.generateHash(password);
      if (await newUser.save()) {
        return done(null, newUser);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (_, username, password, done) => {
      let user = await User.retrieve(["username", username], false);
      if (!user || !user.validPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    }
  )
);

module.exports = router;
