import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  changePassword,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);
router.delete("/profile", auth, deleteUserProfile);
router.put('/change-password', auth, changePassword);

export default router;
