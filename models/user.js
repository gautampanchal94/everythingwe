// jshint esversion:6
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  homeContent: {
    pageTitle: {
      title: {
        type: String,
        default: "Puchinda Chai",
      },
      content: {
        type: String,
        default: "It's you, you idiot.",
      },
    },
    firstSubHeading: {
      title: {
        type: String,
        default: "Project mission",
      },
      content: {
        type: String,
        default: "To only let you know what you already know",
      },
    },
    lastSubHeading: {
      title: {
        type: String,
        default: "Want to Say Something?",
      },
      content: {
        type: String,
        default: "Call Karna",
      },
    },
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
