//jshint esversion:6
const mongoose = require("mongoose");

async function connectToDatabase() {
  if (process.env.DATABASE) {
    db = process.env.DATABASE;
  }
  mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((error) => console.log(error));
}

module.exports = {
  connectToDatabase: connectToDatabase,
};
