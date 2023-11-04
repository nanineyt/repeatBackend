const express = require("express");
const scheduleController = require("../controllers/scheduleController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/getBySearch", protect, scheduleController.getBySearch);
router.get("/getBySearchInDate", protect, scheduleController.getBySearchInDate);

router.get("/getAll", protect, scheduleController.getAllSchedule);

router.post("/create", protect, scheduleController.createSchedule);
router.patch("/update/:scheduleId", protect, scheduleController.updateSchedule);

router.delete("/:scheduleId", protect, scheduleController.deleteSchedule);

module.exports = router;
