const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Artist = require("../models/Artist");
const Event = require("../models/Event");

// Middleware to check if user is admin
const adminCheck = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.userType !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admin only." });
    }
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get("/users", [auth, adminCheck], async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/admin/artists
// @desc    Get all artists
// @access  Private/Admin
router.get("/artists", [auth, adminCheck], async (req, res) => {
  try {
    const artists = await Artist.find().populate("user", ["name", "email"]);
    res.json(artists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/admin/events
// @desc    Get all events
// @access  Private/Admin
router.get("/events", [auth, adminCheck], async (req, res) => {
  try {
    const events = await Event.find().populate("artist", ["name"]);
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
