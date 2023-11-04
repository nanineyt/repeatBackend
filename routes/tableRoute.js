const express = require("express");
const tableController = require("../controllers/tableController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/getAll", protect, tableController.getAllTable);
router.get("/getTableUnReserved", protect, tableController.getTableUnReserved);
router.get("/getBySearch", protect, tableController.getTableBySearch);

router.post("/create", protect, tableController.createTable);
router.patch("/update/:tableId", protect, tableController.updateTable);

router.delete("/:tableId", protect, tableController.deleteTable);

module.exports = router;
