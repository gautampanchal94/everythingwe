const express = require("express");
const Post = require("../models/compose");

const router = express.Router();

router.get("/history", function (req, res) {
  if (req.isAuthenticated()) {
    Post.find({ user_id: req.user._id }, function (err, posts) {
      res.render("history", {
        posts: posts,
        isLoggedIn: true,
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/compose", (req, res) => {
  req.isAuthenticated() ? res.render("compose") : res.redirect("/login");
});

router.post("/compose", function (req, res) {
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

// router.get("/history", (req, res) => {
//   Post.find({}, function (err, posts) {
//     res.render("history", {
//       posts: posts,
//     });
//   });
// });

module.exports = router;
