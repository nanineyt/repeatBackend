const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    adminFlag: { type: String },
    loginFlag: { type: Boolean },
    lastLoginDate: { type: Date },
    branch: [
      {
        branchId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "branch",
          requied: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
