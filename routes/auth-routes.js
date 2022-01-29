require("dotenv").config();

const path = require("path");
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const validator = require("email-validator");
const passwordValidator = require("password-validator");
const cloudinary = require("cloudinary").v2;

const User = require("../models/user");
const Post = require("../models/compose");
const Wish = require("../models/wish");
const Faq = require("../models/faq");

const router = express.Router();

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
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

router.get("/signup", async function (req, res) {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
  }

  User.findOne({ username: "phudinachai@gmail.com" }, function (err, users) {
    if (err) {
      throw err;
    }
    // console.log(users._id);
    // console.log(req.user._id);
    // console.log(JSON.stringify(req.user._id) === JSON.stringify(users._id));
    if (JSON.stringify(req.user._id) === JSON.stringify(users._id)) {
      res.render("signup", {
        messages: false,
        registeredAlert: req.flash("validMessage"),
      });
    } else {
      res.render("401", { isLoggedIn: true });
    }
  });
});

// router.get("/signup", (req, res) => {
//   if (!req.isAuthenticated()) {
//     res.render("signup", {
//       messages: false,
//       registeredAlert: req.flash("validMessage"),
//     });
//   } else {
//     res.redirect("/");
//   }
// });

router.post("/signup", async function (req, res) {
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
      res.render("signup", {
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
            res.redirect("/signup");
          } else {
            // passport.authenticate("local")(req, res, () => {
            //   res.redirect("/");
            // });

            // history
            const posts = [
              {
                title: "Fallen since 2010",
                content:
                  "when you were the monitor of the class and you wrote my name on  board as i was the most mischievous guy and for an instance the most dreadful too, you did not hesitate to move back and blacklisted me. I had my ego hurt but you made me go OH too, lol.",
                user_id: user._id,
              },
            ];
            Post.insertMany(posts, (err) => {
              if (err) {
                throw err;
              }
            });

            // faqs
            const faqs = [
              {
                title: "Why you?",
                content:
                  "Tum Husn pari, tum jaane jahaan, tum sabse haseen, tum sabse jawaan",
                user_id: user._id,
              },
              {
                title: "Why am I the perfect match for you?",
                content: "huh, yeh bhi koi puchne ki baat hai?",
                user_id: user._id,
              },
              {
                title: "Who wears the pant in our relationship?",
                content: "Erm, lets skip to the good part?",
                user_id: user._id,
              },
            ];

            Faq.insertMany(faqs, (err) => {
              if (err) throw err;
            });

            // wishes
            const imageFilePath = path.join(
              __dirname,
              "..",
              "images",
              "image1.jpg"
            );
            // console.log(imageFilePath);
            cloudinary.uploader
              .upload(imageFilePath, {
                folder: "upload",
                resource_type: "image",
              })
              .then((result) => {
                const wishes = [
                  {
                    title: "Road trip to Ladakh",
                    content: "",
                    image: {
                      public_id: result.public_id,
                      url: result.url,
                    },
                    user_id: user._id,
                  },
                ];

                Wish.insertMany(wishes, (err) => {
                  if (err) throw err;
                });
              });

            res.redirect("/");
          }
        }
      );
    }
  } else {
    // console.log("Invalid Email!!");
    req.flash("validMessage", "Enter valid email address.");
    res.redirect("/signup");
  }
});

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
