"use strict";

const express = require("express");
const cors = require("cors");
const app = express().use("*", cors());
const bp = require("body-parser");
const passport = require("passport");
const path = require("path");
const UserRoutes = require("./routes/user");
const port = 80;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  var morgan = require("morgan");

  app.use(morgan("dev"));
}

const Payment = require("./config/payment");
const Auth = require("./config/auth");

app.use(passport.initialize());

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
app.use(cors());

app.use("/auth", Auth);
app.use("/payment", Payment);
app.use("/user", passport.authenticate("jwt", { session: false }), UserRoutes);

app.use("/media", express.static("media"));
app.use("/uploads", express.static("uploads"));
app.use("/vendor", express.static("vendor"));

require("./routes/utilities")(app, passport);

app.use(express.static(path.join(__dirname, "client", "build")));
app.use((_, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(process.env.PORT || port, () => {
  console.log("listening on " + (process.env.PORT || port));
});
