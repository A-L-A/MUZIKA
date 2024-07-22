import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByUser,
} from "../controllers/eventController.js";
import { auth, isEventHostOrAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, isEventHostOrAdmin, createEvent);
router.get("/", getAllEvents);
router.get("/user", auth, getEventsByUser);
router.get("/:id", getEventById);
router.put("/:id", auth, isEventHostOrAdmin, updateEvent);
router.delete("/:id", auth, isEventHostOrAdmin, deleteEvent);

export default router;
