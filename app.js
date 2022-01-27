//jshint esversion:6
require("dotenv").config();
const path = require("path");
const express = require("express");
const ejs = require("ejs");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

const db = require("./data/database");

const User = require("./models/user");

const defaultRoutes = require("./routes/default-routes");
const authRoutes = require("./routes/auth-routes");
const postRoutes = require("./routes/post-routes");
const wishRoutes = require("./routes/wish-routes");
const faqRoutes = require("./routes/faq-routes");

const MongoDBStore = mongodbStore(session);

const app = express();

const sessionStore = new MongoDBStore({
  uri: process.env.DATABASE,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1);
// session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
    },
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

db.connectToDatabase();

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
app.use(defaultRoutes);
app.use(authRoutes);
app.use(postRoutes);
app.use(wishRoutes);
app.use(faqRoutes);

app.get("/about", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("about", { isLoggedIn: true });
  } else {
    res.redirect("/login");
  }
});

app.use((req, res) => {
  req.isAuthenticated()
    ? res.render("404", { isLoggedIn: true })
    : res.redirect("/login");
});

app.use(function (error, req, res, next) {
  req.isAuthenticated()
    ? res.render("500", { isLoggedIn: true })
    : res.redirect("/login");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});
