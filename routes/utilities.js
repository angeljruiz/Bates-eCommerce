const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Locker = require("../scripts/locker");

Locker.removeLocks();

function authorize(roles = []) {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    passport.authenticate(["jwt", "bearer"], { session: false }),

    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      next();
    },
  ];
}

router.get(
  "/account",
  passport.authenticate(["jwt", "bearer"], { session: false }),
  (req, res) => {
    let u = {};
    Object.keys(req.user || {}).forEach((k) => {
      if (!["id", "password"].includes(k)) u[k] = req.user[k];
    });
    res.json(u);
  }
);

router.post("/oauth", async (req, res) => {
  let user = await User.retrieve(["id", req.body.id], false);
  if (user || !req.body.username || !req.body.id || !req.body.email)
    return res.send("not saved");
  let newUser = new User(req.body);
  newUser.save();
  res.send("saved");
});

router.post(
  "/login",
  passport.authenticate("login", {
    session: false,
  }),
  async (req, res) => {
    let user = await User.retrieve(["id", req.user.id], false);
    const body = { email: user.email };
    const token = jwt.sign({ user: body }, "justatemp");
    res.json({ token });
  }
);

router.post(
  "/signup",
  passport.authenticate("signup", {
    session: false,
    failureRedirect: "/signup",
  }),
  async (req, res) => {
    let user = await User.retrieve(["id", req.user.id], false);
    const body = { email: user.email };
    const token = jwt.sign({ user: body }, "justatemp");
    res.json({ token });
  }
);

module.exports = router;
