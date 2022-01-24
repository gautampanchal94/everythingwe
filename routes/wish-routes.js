const express = require("express");
const Wish = require("../models/wish");

const router = express.Router();

router.get("/wishlist", (req, res) => {
  if (req.isAuthenticated()) {
    Wish.find({ user_id: req.user._id }, function (err, wishes) {
      res.render("wishlist", {
        wishes: wishes,
        isLoggedIn: true,
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/wish", (req, res) => {
  req.isAuthenticated()
    ? res.render("wish", { isLoggedIn: true })
    : res.redirect("/login");
});

router.post("/wish", function (req, res) {
  if (req.isAuthenticated()) {
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
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
