const express = require("express");
const router = express.Router();

const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const Stripe = require("../scripts/stripe");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  let user = await User.retrieve(["id", id], false);
  return done(null, user);
});

passport.use(
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
    async (token, done) => {
      try {
        return done(null, await User.find(["email", token.user.email]));
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
      let stripe = await Stripe.createExpressAccount();
      let user = await User.retrieve(["username", username], ["id"]);
      if (user) {
        return done(null, false);
      }
      var newUser = new User();
      console.log(stripe);
      newUser.username = username;
      newUser.email = req.body.email;
      newUser.id = Math.random().toString(10).substring(9);
      newUser.role = "admin";
      newUser.stripe = stripe.id;
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
