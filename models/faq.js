//jshint esversion:6
const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  title: String,
  content: String,
  user_id: String,
});

module.exports = mongoose.model("Faq", faqSchema);
