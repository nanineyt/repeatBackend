const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    scheduleDate: { type: Date, required: true },
    typeDate: { type: String, required: true },
    artistName: { type: String, required: false },
    pricePerHead: { type: Number, required: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      requied: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
      requied: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("schedule", scheduleSchema);
