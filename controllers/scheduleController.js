const mongoose = require("mongoose");
const ScheduleModel = require("../models/scheduleModel");
const moment = require("moment");
const { ObjectId } = require("bson");
const today = moment().startOf("day");

exports.createSchedule = async (req, res, next) => {
  try {
    const { input } = req.body;
    const {
      scheduleDate,
      typeDate,
      artistName,
      pricePerHead,
      userId,
      branchId,
    } = input;
    const scheduleData = await ScheduleModel.create({
      scheduleDate,
      typeDate,
      artistName,
      pricePerHead,
      userId,
      branchId,
    });
    return res.json({ error: false, data: scheduleData });
  } catch (err) {
    next(err);
  }
};

exports.updateSchedule = async (req, res, next) => {
  try {
    const { input } = req.body;
    const scheduleId = req.params.scheduleId;
    const {
      scheduleDate,
      typeDate,
      artistName,
      pricePerHead,
      userId,
      branchId,
    } = input;
    const scheduleData = await ScheduleModel.findOneAndUpdate(
      { _id: new ObjectId(scheduleId) },
      {
        scheduleDate,
        typeDate,
        artistName,
        pricePerHead,
        userId,
        branchId,
      },
      {
        returnOriginal: false,
      }
    );
    return res.json({ error: false, data: scheduleData });
  } catch (err) {
    next(err);
  }
};

exports.getAllSchedule = async (req, res, next) => {
  try {
    const scheduleData = await ScheduleModel.find().sort({ scheduleDate: 1 });
    return res.json({ error: false, data: scheduleData });
  } catch (err) {
    next(err);
  }
};

exports.deleteSchedule = async (req, res, next) => {
  try {
    const scheduleId = req.params.scheduleId;
    const scheduleData = await ScheduleModel.deleteOne({ _id: scheduleId });
    if (scheduleData.deletedCount != 0) {
      return res.json({ error: false, message: "deleted!" });
    } else {
      return res.json({ error: true });
    }
  } catch (err) {
    next(err);
  }
};

exports.getBySearch = async (req, res, next) => {
  try {
    const { dateSearch, branchId } = req.query;

    const startOfMonth = moment(dateSearch || new Date()).startOf("month");
    const endOfMonth = moment(dateSearch || new Date()).endOf("month");
    console.log("startOfMonth :", startOfMonth);
    console.log("endOfMonth :", endOfMonth);

    const scheduleData = await ScheduleModel.aggregate([
      {
        $match: {
          branchId: new ObjectId(branchId),
          scheduleDate: {
            $gte: startOfMonth.toDate(),
            $lte: endOfMonth.toDate(),
          },
        },
      },
      {
        $sort: {
          scheduleDate: 1,
        },
      },
    ]);
    return res.json({ error: false, data: scheduleData });
  } catch (err) {
    next(err);
  }
};

exports.getBySearchInDate = async (req, res, next) => {
  try {
    let { dateSearch, branchId } = req.query;

    const startOfMonth = moment(dateSearch || new Date()).startOf("day");
    const endOfMonth = moment(dateSearch || new Date()).endOf("day");
    let start = new Date(startOfMonth).getHours();
    let end = new Date(endOfMonth).getHours();
    let startDate = new Date(startOfMonth).setHours(start + 7);
    let endDate = new Date(endOfMonth).setHours(end + 7);
    let haveFlag = false;
    const scheduleData = await ScheduleModel.aggregate([
      {
        $match: {
          branchId: new ObjectId(branchId),
          scheduleDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $sort: {
          scheduleDate: 1,
        },
      },
    ]);
    if (scheduleData.length > 0) {
      haveFlag = true;
    }
    return res.json({ error: false, haveFlag: haveFlag, scheduleData });
  } catch (err) {
    next(err);
  }
};
