//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const swal = require("sweetalert");
const validator = require("email-validator");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

// session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Database
var userDB = "mongodb://localhost:27017/sUserDB";
mongoose.connect(userDB, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("history");
  } else {
    res.render("login");
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/history", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("history");
  } else {
    res.redirect("/login");
  }
});

app.get("/about", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("about");
  } else {
    res.redirect("/login");
  }
});

app.get("/wishlist", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("wishlist");
  } else {
    res.redirect("/login");
  }
});

app.get("/faq", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("faq");
  } else {
    res.redirect("/login");
  }
});

//
app.post("/register", (req, res) => {
  if (validator.validate(req.body.username)) {
    User.register(
      { name: req.body.name, username: req.body.username },
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.redirect("/register");
        } else {
          passport.authenticate("local")(req, res, () => {
            res.redirect("/history");
          });
        }
      }
    );
  } else {
    swal({
      title: "Authentication Failed!",
      text: "Invalid Email",
      icon: "failure",
    });
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(process.env.PORT, () => {
  console.log("App Started!!");
});
