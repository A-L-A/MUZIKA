import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);
router.delete("/profile", auth, deleteUserProfile);

export default router;
