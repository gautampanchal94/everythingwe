const express = require("express");

const Faq = require("../models/faq");

const router = express.Router();

router.get("/faq", (req, res) => {
  if (req.isAuthenticated()) {
    Faq.find({ user_id: req.user._id }, function (err, faqs) {
      res.render("faq", { faqs: faqs.reverse(), isLoggedIn: true });
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/create-faq", (req, res) => {
  req.isAuthenticated()
    ? res.render("create-faq", { faq: "", isForEdit: false })
    : res.redirect("/login");
});

router.post("/create-faq", async function (req, res) {
  const faq = await new Faq({
    title: req.body.faqTitle,
    content: req.body.faqContent,
    user_id: req.user._id,
  });

  faq.save(function (err) {
    if (!err) {
      res.redirect("/faq");
    }
  });
});

router.get("/create-faq/:id/edit", async function (req, res) {
  if (req.isAuthenticated()) {
    const faq = await Faq.findOne({ _id: req.params.id });

    res.render("create-faq", { faq: faq, isForEdit: true });
  } else {
    res.redirect("login");
  }
});

router.post("/create-faq/:id/edit", async function (req, res) {
  if (req.isAuthenticated()) {
    await Faq.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { title: req.body.faqTitle, content: req.body.faqContent } }
    );
    res.redirect("/faq");
  } else {
    res.redirect("/login");
  }
});

router.get("/create-faq/:id/delete", async function (req, res) {
  if (req.isAuthenticated()) {
    await Faq.findOneAndDelete({ _id: req.params.id });

    res.redirect("/faq");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
