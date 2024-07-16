const express = require("express");
const router = express.Router();
const {
  createOrUpdateArtist,
  getAllArtists,
  getArtistById,
} = require("../controllers/artistController");
const { auth } = require("../middleware/authMiddleware");

router.post("/", auth, createOrUpdateArtist);
router.get("/", getAllArtists);
router.get("/:id", getArtistById);

module.exports = router;
