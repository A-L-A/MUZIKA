const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const {
  getAllArtists,
  updateArtist,
  deleteArtist,
} = require("../controllers/artistController");
const {
  getAllEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

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

module.exports = router;
