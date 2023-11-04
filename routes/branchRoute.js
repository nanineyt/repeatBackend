const express = require("express");
const branchController = require("../controllers/branchController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/getAll", branchController.getAllBranch);
router.post("/create", branchController.createBranch);
router.delete("/:userId", branchController.deleteBranch);

module.exports = router;
