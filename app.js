//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");
const Post = require("./models/compose");
const Wish = require("./models/wish");
const swal = require("sweetalert");
const validator = require("email-validator");
const passwordValidator = require("password-validator");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
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
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Database
var db = "mongodb://localhost:27017/myDB";
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Routes

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("history");
  } else {
    res.render("login", {
      messages: req.flash("error"),
    });
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/register", (req, res) => {
  if (!req.isAuthenticated()) {
    res.render("register", {
      messages: false,
      registeredAlert: req.flash("registered"),
    });
  } else {
    res.redirect("/");
  }
});

app.post("/register", (req, res) => {
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
    User.register(
      { name: req.body.name, username: req.body.username },
      req.body.password,
      function (err, user) {
        if (err) {
          console.log("Registered");
          req.flash("registered", "User is already registered.");
          res.redirect("/register");
        } else {
          if (!passwordSchema.validate(req.body.password)) {
            res.render("register", {
              messages: passwordSchema.validate(req.body.password, {
                details: true,
              }),
              registeredAlert: false,
            });
          }
          passport.authenticate("local")(req, res, () => {
            res.redirect("/");
          });
        }
      }
    );
  } else {
    console.log("Invalid Email!!");
  }
});

app.get("/history", function (req, res) {
  if (req.isAuthenticated()) {
    Post.find({ user_id: req.user._id }, function (err, posts) {
      res.render("history", {
        posts: posts,
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/compose", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("compose");
  } else {
    res.redirect("/login");
  }
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent,
    user_id: req.user._id,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

// app.get("/history", (req, res) => {
//   Post.find({}, function (err, posts) {
//     res.render("history", {
//       posts: posts,
//     });
//   });
// });

app.get("/about", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("about");
  } else {
    res.redirect("/login");
  }
});

app.get("/wishlist", (req, res) => {
  if (req.isAuthenticated()) {
    Wish.find({ user_id: req.user._id }, function (err, wishes) {
      res.render("wishlist", {
        wishes: wishes,
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/wish", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("wish");
  } else {
    res.redirect("/login");
  }
});

app.post("/wish", function (req, res) {
  const wish = new Wish({
    title: req.body.wishTitle,
    content: req.body.wishContent,
    image: req.body.wishImage,
    user_id: req.user._id,
  });

  wish.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/faq", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("faq");
  } else {
    res.redirect("/login");
  }
});

//
app.listen(process.env.PORT, () => {
  console.log("App Started!!");
});
