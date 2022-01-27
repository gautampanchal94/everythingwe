const express = require("express");

const User = require("../models/user");

const router = express.Router();

router.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    User.find({ _id: req.user._id }, function (err, content) {
      if (!err) {
        res.render("home", { isLoggedIn: true, homeContent: content });
      } else {
        console.log(err);
      }
    });
  } else {
    res.render("home", { isLoggedIn: false, homeContent: "" });
  }
});

router.get("/update-home", function (req, res) {
  if (req.isAuthenticated()) {
    User.find({ _id: req.user._id }, function (err, content) {
      if (!err) {
        res.render("update-home", { homeContent: content });
      } else {
        console.log(err);
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.post("/update-home", async function (req, res) {
  if (req.isAuthenticated()) {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          homeContent: {
            pageTitle: {
              title: req.body.pageTitle,
              content: req.body.pageContent,
            },
            firstSubHeading: {
              title: req.body.headFirst,
              content: req.body.bodyFirst,
            },
            lastSubHeading: {
              title: req.body.headLast,
              content: req.body.bodyLast,
            },
          },
        },
      }
    );
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
