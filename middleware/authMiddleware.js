const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header. [1] want only token

      token = req.headers.authorization.split(" ")[1]; // get token from bearer token space to this to array ([bearer token]) spllit by space
      // token = req.headers.authorization;
      // console.log("process.env.ACCESS_TOKEN : ", process.env.ACCESS_TOKEN);
      // Verify token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
      // console.log("decoded : ", decoded);
      const decodedObjected = JSON.stringify(decoded.userData);

      const decodedObjected2 = JSON.parse(decodedObjected);
      // console.log("decodedObjected2 : ", decodedObjected2);
      req.user = await User.findOne({ _id: decodedObjected2._id }).select(
        "-password"
      );
      if (req.user.loginFlag == true) {
        next();
      } else {
        res.status(401).json({ message: "Please login" });
      }
    } catch (error) {
      console.log(error);
      var err = new Error("Not authorized");
      err.statusCode = 401;
      // res.status(401);
      throw err;
    }
  }

  if (!token) {
    var err = new Error("Not authorized, No token");
    err.statusCode = 401;
    // res.status(401);
    throw err;
  }
});

module.exports = protect;
