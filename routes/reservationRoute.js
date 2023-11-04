const express = require("express");
const reservationController = require("../controllers/reservationController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/getAll", protect, reservationController.getAllReserve);
router.get("/getBySearch", protect, reservationController.getBySearch);
router.get(
  "/getReportByNameAndPhone",
  protect,
  reservationController.getReportByNameAndPhone
);

router.post("/create", protect, reservationController.createReserve);
router.patch(
  "/updateReport/:reserveId",
  protect,
  reservationController.updateReport
);

router.patch(
  "/update/:reserveId",
  protect,
  reservationController.updateReserve
);

router.delete("/deleteAll", protect, reservationController.deleteAllReserve);
router.delete("/:reserveId", protect, reservationController.deleteReserve);

router.get("/:reserveId", protect, reservationController.getReserveById);

module.exports = router;
