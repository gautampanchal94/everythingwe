const express = require("express");
const Post = require("../models/compose");

const router = express.Router();

router.get("/history", function (req, res) {
  if (req.isAuthenticated()) {
    Post.find({ user_id: req.user._id }, function (err, posts) {
      res.render("history", {
        posts: posts.reverse(),
        isLoggedIn: true,
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/compose", (req, res) => {
  req.isAuthenticated()
    ? res.render("compose", { post: "", isForEdit: false })
    : res.redirect("/login");
});

router.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent,
    user_id: req.user._id,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/history");
    }
  });
});

router.get("/compose/:id/edit", async function (req, res) {
  if (req.isAuthenticated()) {
    const post = await Post.findOne({ _id: req.params.id });

    res.render("compose", { post: post, isForEdit: true });
  } else {
    res.redirect("/login");
  }
});

router.post("/compose/:id/edit", async function (req, res) {
  if (req.isAuthenticated()) {
    await Post.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.postTitle,
          content: req.body.postContent,
        },
      }
    );
    res.redirect("/history");
  } else {
    req.redirect("/login");
  }
});

router.get("/compose/:id/delete", async function (req, res) {
  if (req.isAuthenticated()) {
    await Post.findOneAndDelete({ _id: req.params.id });

    res.redirect("/history");
  } else {
    res.redirect("/login");
  }
});

// router.get("/history", (req, res) => {
//   Post.find({}, function (err, posts) {
//     res.render("history", {
//       posts: posts,
//     });
//   });
// });

module.exports = router;
