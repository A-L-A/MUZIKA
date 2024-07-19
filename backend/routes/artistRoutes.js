const express = require("express");
const router = express.Router();
const {
  createOrUpdateArtist,
  getAllArtists,
  getArtistById,
  getArtistProfile,
  updateArtistProfile,
  deleteArtistProfile,
} = require("../controllers/artistController");
const {
  auth,
  isAdmin,
  isArtistOrAdmin,
} = require("../middleware/authMiddleware");

router.post("/", auth, isArtistOrAdmin, createOrUpdateArtist);
router.get("/", getAllArtists);
router.get("/profile", auth, isArtistOrAdmin, getArtistProfile);
router.put("/profile", auth, isArtistOrAdmin, updateArtistProfile);
router.delete("/profile", auth, isArtistOrAdmin, deleteArtistProfile);
router.get("/:id", getArtistById);
router.put("/:id", auth, isAdmin, updateArtistProfile);
router.delete("/:id", auth, isAdmin, deleteArtistProfile);

module.exports = router;
