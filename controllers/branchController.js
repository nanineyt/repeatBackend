const mongoose = require("mongoose");
const BranchModel = require("../models/branchModel");

exports.createBranch = async (req, res, next) => {
  try {
    const { input } = req.body;
    const { name } = input;
    const branchData = await BranchModel.create({
      name,
    });
    return res.json({ error: false, data: branchData });
  } catch (err) {
    next(err);
  }
};

exports.getAllBranch = async (req, res, next) => {
  try {
    const scheduleData = await BranchModel.aggregate([
      { $addFields: { disable: false } },
      {
        $sort: {
          name: 1,
        },
      },
    ]);
    return res.json({ error: false, data: scheduleData });
  } catch (err) {
    next(err);
  }
};

exports.deleteBranch = async (req, res, next) => {
  try {
    const branchId = req.params.branchId;
    const scheduleData = await BranchModel.deleteOne({ _id: branchId });
    if (scheduleData.deletedCount != 0) {
      return res.json({ error: false, message: "deleted!" });
    } else {
      return res.json({ error: true });
    }
  } catch (err) {
    next(err);
  }
};
