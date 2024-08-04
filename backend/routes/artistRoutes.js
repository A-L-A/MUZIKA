import express from "express";
import {
  createOrUpdateArtist,
  getAllArtists,
  getArtistById,
  getArtistProfile,
  updateArtistProfile,
  deleteArtistProfile,
  updateArtist,
  deleteArtist,
} from "../controllers/artistController.js";
import { auth, isArtistOrAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, isArtistOrAdmin, createOrUpdateArtist);
router.get("/", getAllArtists);
router.get("/profile", auth, isArtistOrAdmin, getArtistProfile);
router.put("/profile", auth, isArtistOrAdmin, updateArtistProfile);
router.delete("/profile", auth, isArtistOrAdmin, deleteArtistProfile);
router.get("/:id", getArtistById);
router.put("/:id", auth, isArtistOrAdmin, updateArtist);
router.delete("/:id", auth, isArtistOrAdmin, deleteArtist);

export default router;
