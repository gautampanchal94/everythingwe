//jshint esversion:6
const mongoose = require("mongoose");

let database;

async function connectToDatabase() {
  var db = process.env.DATABASE;
  mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((error) => console.log(error));
}

module.exports = {
  connectToDatabase: connectToDatabase,
};
