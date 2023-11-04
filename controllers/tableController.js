const mongoose = require("mongoose");
const TableModel = require("../models/tableModel");
const { ObjectId } = require("bson");
const moment = require("moment");
const today = moment().startOf("day");
exports.createTable = async (req, res, next) => {
  try {
    const { input } = req.body;
    const { name, quantity, branchId } = input;
    const tableData = await TableModel.create({
      name: name,
      quantity: quantity,
      branchId: branchId,
    });

    return res.json({ error: false, data: tableData });
  } catch (err) {
    next(err);
  }
};

exports.updateTable = async (req, res, next) => {
  try {
    const { input } = req.body;
    const tableId = req.params.tableId;

    const { name, quantity } = input;
    const tableData = await TableModel.findOneAndUpdate(
      { _id: new ObjectId(tableId) },
      {
        name,
        quantity,
      },
      {
        returnOriginal: false,
      }
    );
    return res.json({ error: false, data: tableData });
  } catch (err) {
    next(err);
  }
};

exports.getAllTable = async (req, res, next) => {
  try {
    const tableData = await TableModel.find();
    return res.json({ error: false, data: tableData });
  } catch (err) {
    next(err);
  }
};

exports.getTableUnReserved = async (req, res, next) => {
  try {
    const { dateSearch, branchId } = req.query;
    const startOfDay = moment(dateSearch || new Date()).startOf("day");
    const endOfDay = moment(dateSearch || new Date()).endOf("day");
    let start = new Date(startOfDay).getHours();
    let end = new Date(endOfDay).getHours();
    let startDate = new Date(startOfDay).setHours(start + 7);
    let endDate = new Date(endOfDay).setHours(end + 7);
    const tableData = await TableModel.aggregate([
      {
        $match: {
          branchId: new ObjectId(branchId),
        },
      },
      {
        $lookup: {
          from: "reservations",
          let: { tableId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$$tableId", "$table.tableId"] },
                    { $not: { $gt: ["$deletedAt", null] } },
                  ],
                },
                branchId: new ObjectId(branchId),
                reserveDate: {
                  $gte: new Date(startDate),
                  $lte: new Date(endDate),
                },
              },
            },
          ],
          as: "tables",
        },
      },
      {
        $match: {
          tables: { $size: 0 },
        },
      },
      {
        $addFields: {
          disable: false,
        },
      },
      {
        $project: {
          tables: 0,
        },
      },
    ]);
    return res.json({ error: false, data: tableData });
  } catch (err) {
    next(err);
  }
};

exports.deleteTable = async (req, res, next) => {
  try {
    const tableId = req.params.tableId;
    const tableData = await TableModel.deleteOne({ _id: tableId });
    if (tableData.deletedCount != 0) {
      return res.json({ error: false, message: "deleted!" });
    } else {
      return res.json({ error: true });
    }
  } catch (err) {
    next(err);
  }
};

exports.getTableBySearch = async (req, res, next) => {
  try {
    const { branchId } = req.query;
    const textSearch = req.query.textSearch || "";
    const sort = req.query.sort || 1;
    console.log(sort);
    let query = {};
    if (textSearch !== "") {
      query["$or"] = [
        {
          name: {
            $regex: textSearch,
            $options: "i",
          },
        },
      ];
    }

    const tableData = await TableModel.aggregate([
      {
        $match: {
          ...query,
          branchId: new ObjectId(branchId),
        },
      },

      {
        $sort: {
          name: parseInt(sort),
        },
      },
    ]);

    return res.json({ error: false, data: tableData });
  } catch (err) {
    next(err);
  }
};
