const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    quantity: { type: Number, required: false },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
      requied: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("table", tableSchema);
