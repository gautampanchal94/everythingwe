const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  req.isAuthenticated()
    ? res.render("home", { isLoggedIn: true })
    : res.render("home", { isLoggedIn: false });
});

module.exports = router;
