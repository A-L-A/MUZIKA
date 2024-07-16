const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
} = require("../controllers/eventController");
const { auth } = require("../middleware/authMiddleware");

router.post("/", auth, createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);

module.exports = router;
