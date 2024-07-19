const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByUser,
} = require("../controllers/eventController");
const {
  auth,
  isAdmin,
  isEventHostOrAdmin,
} = require("../middleware/authMiddleware");

router.post("/", auth, isEventHostOrAdmin, createEvent);
router.get("/", getAllEvents);
router.get("/user", auth, getEventsByUser);
router.get("/:id", getEventById);
router.put("/:id", auth, isEventHostOrAdmin, updateEvent);
router.delete("/:id", auth, isEventHostOrAdmin, deleteEvent);

module.exports = router;
