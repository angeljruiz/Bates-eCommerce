"use strict";

const express = require("express");
const cors = require("cors");
const app = express().use("*", cors());

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  var morgan = require("morgan");

  app.use(morgan("dev"));
}

const passport = require("passport");
const bp = require("body-parser");
const path = require("path");

const Auth = require("./config/auth");
const Utilities = require("./routes/utilities");
const UserRoutes = require("./routes/user");
const Payment = require("./config/payment");
const Mall = require("./scripts/mall");
const port = 80;

app.use(passport.initialize());
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());

app.use(Utilities);
app.use(Auth);
app.use("/payment", Payment);
app.use("/user", passport.authenticate("jwt", { session: false }), UserRoutes);

Mall.loadMall(app).then(() => {
  app.use(express.static(path.join(__dirname, "client", "build")));
  app.use((_, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
});

app.listen(process.env.PORT || port, () => {
  console.log("listening on " + (process.env.PORT || port));
});
