const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    phone: { type: String, required: false },
    quantity: { type: Number, required: false },
    bookingChannel: { type: String, required: false },
    vipFlag: { type: String, required: false },
    paid: { type: String, required: false },
    concertFlag: { type: String, required: false },
    remark: { type: String, required: false },
    reserveDate: { type: Date, required: false },
    report: {
      topic: { type: String, required: false },
      reportDate: { type: Date, required: false },
      level: { type: String, required: false },
      desciption: { type: String, required: false },
      userReporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        requied: false,
      },
    },
    table: [
      {
        name: { type: String, required: true },

        tableId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "table",
          requied: false,
        },
      },
    ],
    modifiedHistory: [
      {
        modifedDate: { type: Date, required: false },

        userModifiedId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          requied: false,
        },
      },
    ],
    userCreatedId: {
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

module.exports = mongoose.model("reservation", customerSchema);
