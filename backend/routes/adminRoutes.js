import express from "express";
import { auth, isAdmin } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import {
  getAllArtists,
  updateArtist,
  deleteArtist,
} from "../controllers/artistController.js";
import {
  getAllEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

// User routes
router.get("/users", auth, isAdmin, getAllUsers);
router.post("/users", auth, isAdmin, createUser);
router.put("/users/:id", auth, isAdmin, updateUser);
router.delete("/users/:id", auth, isAdmin, deleteUser);

// Artist routes
router.get("/artists", auth, isAdmin, getAllArtists);
router.put("/artists/:id", auth, isAdmin, updateArtist);
router.delete("/artists/:id", auth, isAdmin, deleteArtist);

// Event routes
router.get("/events", auth, isAdmin, getAllEvents);
router.put("/events/:id", auth, isAdmin, updateEvent);
router.delete("/events/:id", auth, isAdmin, deleteEvent);

export default router;
