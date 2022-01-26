//jshint esversion:6
const mongoose = require("mongoose");

const wishSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: {
    public_id: String,
    url: String,
  },
  user_id: String,
});

module.exports = mongoose.model("Wish", wishSchema);
