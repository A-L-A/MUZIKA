const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { auth, isAdmin } = require("../middleware/authMiddleware");

router.get("/", auth, isAdmin, getAllUsers);
router.post("/", auth, isAdmin, createUser);
router.put("/:id", auth, isAdmin, updateUser);
router.delete("/:id", auth, isAdmin, deleteUser);

module.exports = router;
