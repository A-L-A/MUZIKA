import express from "express";
import multer from "multer";
import path from "path";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByUser,
} from "../controllers/eventController.js";
import { auth, isEventHostOrAdmin } from "../middleware/authMiddleware.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(process.cwd(), "frontend/public/images/eventz")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const router = express.Router();
router.post("/", auth, isEventHostOrAdmin, upload.single("image"), createEvent);
router.get("/", getAllEvents);
router.get("/user", auth, getEventsByUser);
router.get("/:id", getEventById);
router.put(
  "/:id",
  auth,
  isEventHostOrAdmin,
  upload.single("image"),
  updateEvent
);
router.delete("/:id", auth, isEventHostOrAdmin, deleteEvent);

export default router;
