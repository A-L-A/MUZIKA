import express from "express";
import {
  signup,
  login,
  setupAdmin,
} from "../controllers/authController.js";
import { auth } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/setup-admin", setupAdmin);

export default router;
