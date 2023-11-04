const mongoose = require("mongoose");
const ReservationModel = require("../models/reservationModel");
const CustomerModel = require("../models/customerModel");
const TableModel = require("../models/tableModel");
const genDateService = require("../services/general/genDate");
const moment = require("moment");
const { ObjectId } = require("bson");
const today = moment().startOf("day");

exports.createReserve = async (req, res, next) => {
  const session = await ReservationModel.startSession();
  session.startTransaction();
  try {
    const opts = { session, new: true };

    const { input, table } = req.body;
    const {
      name,
      phone,
      quantity,
      bookingChannel,
      reserveAdvance,
      vipFlag,
      paid,
      concertFlag,
      remark,
      reserveDate,
      userCreatedId,
      branchId,
    } = input;

    const tableHasMasterData = table
      .filter((item) => item.tableId !== null)
      .map((item) => item);
    if (reserveAdvance == null) {
      let tableReserved = [];
      const startOfDay = moment(reserveDate).startOf("day");
      const endOfDay = moment(reserveDate).endOf("day");
      let start = new Date(startOfDay).getHours();
      let end = new Date(endOfDay).getHours();
      let startDate = new Date(startOfDay).setHours(start + 7);
      let endDate = new Date(endOfDay).setHours(end + 7);
      for (let x = 0; x < tableHasMasterData.length; x++) {
        const reservationData = await ReservationModel.aggregate([
          {
            $match: {
              table: {
                $elemMatch: {
                  tableId: new ObjectId(tableHasMasterData[x].tableId),
                },
              },
              branchId: new ObjectId(branchId),
              reserveDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
              },
            },
          },
        ]);

        if (reservationData.length > 0) {
          tableReserved.push(tableHasMasterData[x].name);
        }
      }
      if (tableReserved.length > 0) {
        return res.json({
          error: true,
          typeAdvance: false,
          tableReserved,
        });
      }

      const reservationData = await ReservationModel.create(
        {
          name,
          phone,
          quantity,
          bookingChannel,
          vipFlag,
          paid,
          concertFlag,
          remark,
          reserveDate,
          userCreatedId,
          branchId,
          table,
        }
        // opts
      );

      await session.commitTransaction();
      session.endSession();
      return res.json({ error: false, data: reservationData });
    } else {
      let tableReservedAdvance = [];
      let getMonth = new Date(reserveDate).getMonth();
      let endMonth = new Date(reserveDate).setMonth(
        getMonth + parseInt(reserveAdvance) - 1
      );
      let dateOfMonth = new Date(endMonth);
      const endOfMonth = moment(dateOfMonth).endOf("month");
      const data = genDateService(reserveDate, endOfMonth.toDate());
      for (x = 0; x < data.length; x++) {
        let tableReserved = [];
        const startOfDay = moment(data[x]).startOf("day");
        const endOfDay = moment(data[x]).endOf("day");
        let start = new Date(startOfDay).getHours();
        let end = new Date(endOfDay).getHours();
        let startDate = new Date(startOfDay).setHours(start + 7);
        let endDate = new Date(endOfDay).setHours(end + 7);

        for (let x = 0; x < tableHasMasterData.length; x++) {
          const reservationData = await ReservationModel.aggregate([
            {
              $match: {
                table: {
                  $elemMatch: {
                    tableId: new ObjectId(tableHasMasterData[x].tableId),
                  },
                },
                branchId: new ObjectId(branchId),
                reserveDate: {
                  $gte: new Date(startDate),
                  $lte: new Date(endDate),
                },
              },
            },
          ]);

          if (reservationData.length > 0) {
            tableReserved.push(tableHasMasterData[x].name);
          }
        }
        if (tableReserved.length != 0) {
          tableReservedAdvance.push({
            date: data[x],
            name: tableReserved.join(),
          });
        }
      }
      if (tableReservedAdvance.length != 0) {
        return res.json({
          error: true,
          typeAdvance: true,
          tableReservedAdvance,
        });
      } else {
        for (x = 0; x < data.length; x++) {
          const reservationData = await ReservationModel.create(
            {
              name,
              phone,
              quantity,
              bookingChannel,
              vipFlag,
              concertFlag,
              remark,
              reserveDate: data[x],
              userCreatedId,
              branchId,
              table,
            }
            // opts
          );
        }
        await session.commitTransaction();
        session.endSession();
        return res.json({ error: false });
      }
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

exports.getAllReserve = async (req, res, next) => {
  try {
    const reservationData = await ReservationModel.find();
    return res.json({ error: false, data: reservationData });
  } catch (err) {
    next(err);
  }
};

exports.updateReport = async (req, res, next) => {
  try {
    const reserveId = req.params.reserveId;
    const { input } = req.body;
    let dateNow = new Date();
    let getHour = dateNow.getHours();
    dateNow = dateNow.setHours(getHour + 7);
    const reservationData = await ReservationModel.findOneAndUpdate(
      { _id: new ObjectId(reserveId) },
      {
        report: { ...input, reportDate: dateNow },
      },
      {
        returnOriginal: false,
      }
    );
    return res.json({ error: false, data: reservationData });
  } catch (err) {
    next(err);
  }
};

exports.updateReserve = async (req, res, next) => {
  try {
    const reserveId = req.params.reserveId;
    const { input, table } = req.body;
    const {
      branchId,
      reserveDate,
      quantity,
      bookingChannel,
      vipFlag,
      paid,
      remark,
      userModifiedId,
    } = input;
    let tableReserved = [];
    const tableHasMasterData = table
      .filter((item) => item.tableId !== null)
      .map((item) => item);
    const startOfDay = moment(reserveDate).startOf("day");
    const endOfDay = moment(reserveDate).endOf("day");
    let start = new Date(startOfDay).getHours();
    let end = new Date(endOfDay).getHours();
    let startDate = new Date(startOfDay).setHours(start + 7);
    let endDate = new Date(endOfDay).setHours(end + 7);
    for (let x = 0; x < tableHasMasterData.length; x++) {
      const reservationData = await ReservationModel.aggregate([
        {
          $match: {
            _id: { $ne: new ObjectId(reserveId) },
            table: {
              $elemMatch: {
                tableId: new ObjectId(tableHasMasterData[x].tableId),
              },
            },
            branchId: new ObjectId(branchId),
            reserveDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
          },
        },
      ]);

      if (reservationData.length > 0) {
        tableReserved.push(tableHasMasterData[x].name);
      }
    }
    if (tableReserved.length > 0) {
      return res.json({
        error: true,
        tableReserved,
      });
    }
    let dateNow = new Date();
    let getHour = dateNow.getHours();
    dateNow = dateNow.setHours(getHour + 7);
    const reservationData = await ReservationModel.findOneAndUpdate(
      { _id: new ObjectId(reserveId) },
      {
        ...input,
        table,
        $push: {
          modifiedHistory: {
            modifedDate: dateNow,
            userModifiedId: userModifiedId,
          },
        },
      },
      {
        returnOriginal: false,
      }
    );
    return res.json({ error: false, data: reservationData });
  } catch (err) {
    next(err);
  }
};

exports.deleteAllReserve = async (req, res, next) => {
  try {
    const reservationData = await ReservationModel.deleteMany();
    return res.json({ error: false, message: "deleted!" });
  } catch (err) {
    next(err);
  }
};

exports.deleteReserve = async (req, res, next) => {
  try {
    const reserveId = req.params.reserveId;
    const reservationData = await ReservationModel.deleteOne({
      _id: reserveId,
    });
    if (reservationData.deletedCount != 0) {
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
    const textSearch = req.query.textSearch || "";
    const sort = req.query.sort || 1;
    const startOfDay = moment(dateSearch || new Date()).startOf("day");
    const endOfDay = moment(dateSearch || new Date()).endOf("day");
    let start = new Date(startOfDay).getHours();
    let end = new Date(endOfDay).getHours();
    let startDate = new Date(startOfDay).setHours(start + 7);
    let endDate = new Date(endOfDay).setHours(end + 7);
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
          table: {
            $elemMatch: {
              name: {
                $regex: textSearch,
                $options: "i",
              },
            },
          },
        },
      ];
    }

    const reservationData = await ReservationModel.aggregate([
      {
        $match: {
          ...query,
          branchId: new ObjectId(branchId),
          reserveDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $addFields: { firstTableName: { $first: "$table" } },
      },
      {
        $sort: {
          "firstTableName.name": parseInt(sort),
        },
      },
    ]);

    return res.json({ error: false, data: reservationData });
  } catch (err) {
    next(err);
  }
};

exports.getReserveById = async (req, res, next) => {
  try {
    const reserveId = req.params.reserveId;
    const reservationData = await ReservationModel.findOne({
      _id: reserveId,
    })
      .populate("userCreatedId")
      .populate("modifiedHistory.userModifiedId")
      .select(" -userCreatedId.password");
    if (reservationData == null) {
      return res
        .status(404)
        .json({ error: true, message: "This reservation not found" });
    }

    const tableData = await TableModel.aggregate([
      { $match: { branchId: new ObjectId(reservationData.branchId) } },
      {
        $addFields: {
          disable: false,
        },
      },
    ]);
    return res.json({ error: false, data: reservationData, tableData });
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
    const reservationData = await ReservationModel.find({
      branchId: branchId,
      name: name,
      phone: phone,
      report: { $ne: null },
    });
    if (reservationData.length == 0) {
      return res.status(200).json({
        error: false,
        dataFlag: 0,
        message: "This customer not have report",
      });
    } else {
      return res.status(200).json({
        error: false,
        dataFlag: reservationData.length,
        message: "This customer  have report",
      });
    }
  } catch (err) {
    next(err);
  }
};
