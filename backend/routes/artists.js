const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Artist = require("../models/Artist");
const User = require("../models/User");

// @route   POST api/artists
// @desc    Create or update artist profile
// @access  Private


router.post("/", auth, async (req, res) => {
  const { genre, bio, socialLinks } = req.body;

  try {
    let artist = await Artist.findOne({ user: req.user.id });

    if (artist) {
      // Update
      artist = await Artist.findOneAndUpdate(
        { user: req.user.id },
        { $set: { genre, bio, socialLinks } },
        { new: true }
      );
    } else {
      // Create
      artist = new Artist({
        user: req.user.id,
        genre,
        bio,
        socialLinks,
      });

      await artist.save();
    }

    res.json(artist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/artists
// @desc    Get all artists
// @access  Public
router.get("/", async (req, res) => {
  try {
    const artists = await Artist.find().populate("user", ["name", "email"]);
    res.json(artists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/artists/:id
// @desc    Get artist by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id).populate("user", [
      "name",
      "email",
    ]);
    if (!artist) {
      return res.status(404).json({ msg: "Artist not found" });
    }
    res.json(artist);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Artist not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
