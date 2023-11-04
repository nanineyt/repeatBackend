const mongoose = require("mongoose");
const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const verfifyAndTokenService = require("../services/authService/verifyAndTokenService");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("bson");

exports.createUser = async (req, res, next) => {
  try {
    const { input, branch } = req.body;
    const { name, username, password, adminFlag } = input;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = await UserModel.create({
      name,
      username,
      adminFlag: adminFlag || null,
      password: hashedPassword,
      branch,
    });
    return res.json({ error: false, data: userData });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { input, branch } = req.body;
    const userId = req.params.userId;
    const { name, username } = input;
    const userData = await UserModel.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
      },
      {
        name,
        username,
        branch,
      },
      {
        returnOriginal: false,
      }
    );
    return res.json({ error: false, data: userData });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const userId = req.params.userId;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = await UserModel.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
      },
      {
        password: hashedPassword,
      },
      {
        returnOriginal: false,
      }
    );
    return res.json({ error: false, data: userData });
  } catch (err) {
    next(err);
  }
};

exports.getAllUser = async (req, res, next) => {
  try {
    const textSearch = req.query.textSearch || "";
    const userData = await UserModel.find({
      name: {
        $regex: textSearch,
        $options: "i",
      },
      adminFlag: { $ne: "Y" },
    })
      .populate("branch.branchId")
      .select("-password");
    return res.json({ error: false, data: userData });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const userData = await UserModel.deleteOne({ _id: userId });
    if (userData.deletedCount != 0) {
      return res.json({ error: false, message: "deleted!" });
    } else {
      return res.json({ error: true });
    }
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const userData = await UserModel.findOne({
      username,
    }).populate("branch.branchId");
    if (!userData) {
      return res.status(401).json({ message: "invalid username" });
    }

    if (userData && (await bcrypt.compare(password, userData.password))) {
      delete userData.password;

      console.log("userData : ", userData);
      const token = verfifyAndTokenService.generateAccessToken(userData);
      const refreshToken =
        verfifyAndTokenService.generateRefreshToken(userData);
      let getHour = new Date().getHours();
      userData.lastLoginDate = new Date(new Date().setHours(getHour + 7));
      userData.loginFlag = true;
      await userData.save();
      return res.json({
        error: false,
        data: userData,
        adminFlag: userData.adminFlag == "Y" ? true : false,
        token,
        refreshToken,
      });
    } else {
      return res.status(401).json({ message: "invalid password" });
    }
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const userData = req.user;
    console.log("userData : ", userData);
    const userSaveLogout = await UserModel.updateOne(
      { _id: userData._id },
      { loginFlag: false }
    );
    return res.status(200).json({ message: "Logout Successfully" });
  } catch (err) {
    next(err);
  }
};

exports.RefreshToken = async (req, res, next) => {
  try {
    const refreshtoken = req.body.refreshToken;
    console.log("refresh token working");

    if (!refreshtoken) {
      return res.status(403).send("A token is required");
    }
    jwt.verify(
      refreshtoken,
      process.env.REFRESH_TOKEN,
      async (err, userData) => {
        if (err) return res.status(401).send("Invalid Token");
        userData = userData.userData;
        const User = await UserModel.findOne({ _id: userData._id });
        if (User.loginFlag === false) {
          return res.status(401).send("Invalid Token");
        }
        const accesstoken =
          verfifyAndTokenService.generateAccessToken(userData);
        return res.send({ accesstoken: accesstoken });
      }
    );
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const userData = await UserModel.findOne({
      _id: userId,
    })
      .populate("branch.branchId")
      .select("-password");
    if (userData == null) {
      return res
        .status(404)
        .json({ error: true, message: "This user not found" });
    }
    return res.json({ error: false, data: userData });
  } catch (err) {
    next(err);
  }
};
