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
        default: "Everything WE",
      },
      content: {
        type: String,
        default:
          "a digital memorial diary gift of you and your closed with all your cherished and joyous moments",
      },
    },
    firstSubHeading: {
      title: {
        type: String,
        default: "Project Mission",
      },
      content: {
        type: String,
        default: "To never let a moment go un-noticed",
      },
    },
    lastSubHeading: {
      title: {
        type: String,
        default: "Inside Everything We",
      },
      content: {
        type: String,
        default:
          "Make a virtual space for your partner where you can add memories and highlights of you and let them know that there is no-one other than them in your universe.",
      },
    },
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
