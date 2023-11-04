const mongoose = require("mongoose");

async function db() {
  mongoose
    .connect(
      `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`
    )
    .then(() => console.log("connected"))
    .catch((err) => console.log("Error :" + err));
}

module.exports = db;
