const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} = require("../controllers/userController");

router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);
router.delete("/profile", auth, deleteUserProfile);

module.exports = router;
