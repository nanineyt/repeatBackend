const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    phone: { type: String, required: false },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
      requied: true,
    },
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reserveation",
      requied: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("customer", customerSchema);
