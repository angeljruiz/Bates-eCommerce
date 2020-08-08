"use strict";

let express = require("express");
let cors = require("cors");
let app = express().use("*", cors());

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  var morgan = require("morgan");

  app.use(morgan("dev"));
  app.locals.pretty = true;
}
let bp = require("body-parser");
let passport = require("passport");
let path = require("path");

app.use(passport.initialize());

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
app.use(cors());

let Auth = require("./config/auth");
app.use("/auth", Auth);

app.use("/media", express.static("media"));
app.use("/uploads", express.static("uploads"));
app.use("/vendor", express.static("vendor"));

require("./utilities/utilities")(app, passport);

app.use(express.static(path.join(__dirname, "client", "build")));
app.use((_, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

let port = 80;

app.listen(process.env.PORT || port, () => {
  console.log("listening on " + (process.env.PORT || port));
});
