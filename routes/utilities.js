const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Locker = require("../scripts/locker");
const Store = require("../models/store");
const Section = require("../models/section");
const Mall = require("../scripts/mall");
const Stripe = require("../scripts/stripe");

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
    Store.retrieve(["owner", req.user.id]).then(async (store) => {
      let stripe = await Stripe.retrieve(req.user.stripe);
      console.log(stripe);
      let u = { url: store.url, onboard: stripe.charges_enabled };
      Object.keys(req.user || {}).forEach((k) => {
        if (!["password"].includes(k)) u[k] = req.user[k];
      });
      res.json(u);
    });
  }
);

router.post("/oauth", async (req, res) => {
  let user = await User.retrieve(["id", req.body.id], false);
  if (user || !req.body.username || !req.body.id || !req.body.email)
    return res.send("not saved");
  let newUser = new User(req.body);
  newUser.role = "admin";
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
    const token = jwt.sign(
      {
        user: { email: user.email, id: req.user.id, role: user.role },
      },
      "justatemp"
    );
    res.json({ token });
  }
);

router.post(
  "/signup",
  passport.authenticate("signup", {
    session: false,
  }),
  async (req, res) => {
    User.retrieve(["id", req.user.id], false).then(async (user) => {
      const token = jwt.sign(
        {
          user: { email: user.email, id: req.user.id, role: req.user.role },
        },
        "justatemp"
      );
      let store = new Store({
        name: req.body.storeName,
        url: req.body.storeUrl,
        owner: req.user.id,
      });
      await store.save(["name", "url", "owner"]);
      Store.retrieve(["url", req.body.storeUrl]).then(async (s) => {
        let section = new Section({ name: "Featured", num: 1, store: s.id });
        await section.save(["name", "num", "store"]);
        Mall.loadMall().then(() => {
          res.json({ token });
        });
      });
    });
  }
);

module.exports = router;
