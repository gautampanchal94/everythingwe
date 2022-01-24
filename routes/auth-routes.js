require("dotenv").config();
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const validator = require("email-validator");
const passwordValidator = require("password-validator");

const User = require("../models/user");

const router = express.Router();

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("history");
  } else {
    res.render("login", {
      messages: req.flash("error"),
    });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

router.get("/register", (req, res) => {
  if (!req.isAuthenticated()) {
    res.render("register", {
      messages: false,
      registeredAlert: req.flash("validMessage"),
    });
  } else {
    res.redirect("/");
  }
});

router.post("/register", (req, res) => {
  // password validator
  const passwordSchema = new passwordValidator();
  passwordSchema
    .min(6, "Minimum 6 character long.")
    .max(20, "Maximum 20 character allowed.")
    .uppercase(1, "At least 1 uppercase letters.")
    .symbols(1, "Must include at least 1 special character.")
    .digits(1, "Must include at least 1 digit.")
    .not()
    .spaces(0, "No Spaces allowed.");

  // authentic
  if (validator.validate(req.body.username)) {
    //password check
    if (!passwordSchema.validate(req.body.password)) {
      res.render("register", {
        messages: passwordSchema.validate(req.body.password, {
          details: true,
        }),
        registeredAlert: false,
      });
    } else {
      User.register(
        { name: req.body.name, username: req.body.username },
        req.body.password,
        function (err, user) {
          if (err) {
            // console.log("Registered");
            req.flash("validMessage", "User is already registered.");
            res.redirect("/register");
          } else {
            passport.authenticate("local")(req, res, () => {
              res.redirect("/");
            });
          }
        }
      );
    }
  } else {
    // console.log("Invalid Email!!");
    req.flash("validMessage", "Enter valid email address.");
    res.redirect("/register");
  }
});

module.exports = router;
