const mongoose = require("mongoose");
const CustomerModel = require("../models/customerModel");
const ReservationModel = require("../models/reservationModel");
const { ObjectId } = require("bson");

exports.getAllCustomer = async (req, res, next) => {
  try {
    const customerData = await CustomerModel.find();
    return res.json({ error: false, data: customerData });
  } catch (err) {
    next(err);
  }
};

exports.getCustomerHaveReportBySearch = async (req, res, next) => {
  try {
    const textSearch = req.query.textSearch || "";
    const branchId = req.query.branchId;

    let query = {};
    if (textSearch !== "") {
      query["$or"] = [
        {
          name: {
            $regex: textSearch,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: textSearch,
            $options: "i",
          },
        },
      ];
    }
    const customerData = await ReservationModel.aggregate([
      {
        $match: {
          ...query,
          branchId: new ObjectId(branchId),
          report: { $ne: null },
        },
      },
      {
        $group: {
          _id: { name: "$name", phone: "$phone" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id.name",
          phone: "$_id.phone",
          count: 1,
        },
      },
      {
        $sort: {
          name: 1,
          phone: 1,
        },
      },
    ]);

    return res.json({ error: false, data: customerData });
  } catch (err) {
    next(err);
  }
};

exports.getReportByNameAndPhone = async (req, res, next) => {
  try {
    const { name, phone, branchId } = req.query;
    if (!name || !phone || !branchId) {
      return res.status(400).json({
        error: true,
        message: "Please send name , phone and branchId!",
      });
    }

    const customerData = await ReservationModel.aggregate([
      {
        $match: {
          branchId: new ObjectId(branchId),
          name: { $eq: name },
          phone: { $eq: phone },
          report: { $ne: null },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "report.userReporterId", // field in the orders collection
          foreignField: "_id", // field in the items collection
          as: "report.user",
        },
      },
      { $unwind: "$report.user" },
      {
        $project: {
          "report.user.password": 0,
          "report.user.branch": 0,
          "report.user.adminFlag": 0,
          "report.user.createdAt": 0,
          "report.user.updatedAt": 0,
          "report.user.__v": 0,
          "report.user.lastLoginDate": 0,
          "report.user.loginFlag": 0,
        },
      },
      {
        $sort: {
          "report.reportDate": 1,
        },
      },
      {
        $addFields: {
          isExpanded: false,
        },
      },
    ]);

    return res.json({ error: false, data: customerData });
  } catch (err) {
    next(err);
  }
};

exports.deleteAllCustomer = async (req, res, next) => {
  try {
    const customerData = await CustomerModel.deleteOne();
    return res.json({ error: false, message: "deleted!" });
  } catch (err) {
    next(err);
  }
};
