// routes/eventHostRoutes.js
import express from "express";
import { auth, isEventHostOrAdmin } from "../middleware/authMiddleware.js";
import {
  createOrUpdateEventHost,
  getAllEventHosts,
  getEventHostById,
  getEventHostProfile,
  updateEventHostProfile,
  deleteEventHostProfile,
  updateEventHost,
  deleteEventHost,
} from "../controllers/evenHostController.js";


const router = express.Router();

router.post("/", auth, isEventHostOrAdmin, createOrUpdateEventHost);
router.get("/", getAllEventHosts);
router.get("/profile", auth, isEventHostOrAdmin, getEventHostProfile);
router.put("/profile", auth, isEventHostOrAdmin, updateEventHostProfile);
router.delete("/profile", auth, isEventHostOrAdmin, deleteEventHostProfile);
router.get("/:id", getEventHostById);
router.put("/:id", auth, isEventHostOrAdmin, updateEventHost);
router.delete("/:id", auth, isEventHostOrAdmin, deleteEventHost);

export default router;
