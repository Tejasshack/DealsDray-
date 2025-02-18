const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,

      required: true,
    },
  },
  { Timestamp: true }
);

module.exports = mongoose.model("User", user);
