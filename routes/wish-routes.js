const express = require("express");
const multer = require("multer");

const Wish = require("../models/wish");

const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storageConfig });
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
    ? res.render("wish", { wish: "", isForEdit: false })
    : res.redirect("/login");
});

router.post("/wish", upload.single("wishImage"), async function (req, res) {
  if (req.isAuthenticated()) {
    const uploadedImage = req.file;

    const wish = await new Wish({
      title: req.body.wishTitle,
      content: req.body.wishContent,
      image: uploadedImage.path,
      user_id: req.user._id,
    });

    wish.save(function (err) {
      if (!err) {
        res.redirect("/wishlist");
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/wish/:id/edit", async function (req, res) {
  if (req.isAuthenticated()) {
    const wish = await Wish.findOne({ _id: req.params.id });

    res.render("wish", { wish: wish, isForEdit: true });
  } else {
    res.redirect("/login");
  }
});

router.post(
  "/wish/:id/edit",
  upload.single("wishImage"),
  async function (req, res) {
    if (req.isAuthenticated()) {
      const uploadedImage = req.file;

      await Wish.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            title: req.body.wishTitle,
            content: req.body.wishContent,
            image: uploadedImage.path,
          },
        }
      );
      res.redirect("/wishlist");
    } else {
      req.redirect("/login");
    }
  }
);

router.get("/wish/:id/delete", async function (req, res) {
  if (req.isAuthenticated()) {
    await Wish.findOneAndDelete({ _id: req.params.id });

    res.redirect("/wishlist");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
