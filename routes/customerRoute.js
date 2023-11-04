const express = require("express");
const customerController = require("../controllers/customerController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/getAll", protect, customerController.getAllCustomer);
router.get(
  "/getCustomerHaveReportBySearch",
  protect,
  customerController.getCustomerHaveReportBySearch
);
router.get(
  "/getReportByNameAndPhone",
  protect,
  customerController.getReportByNameAndPhone
);
router.delete("/deleteAll", protect, customerController.deleteAllCustomer);

module.exports = router;
