import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  socialLinks: {
    instagram: String,
    facebook: String,
    twitter: String,
  },
  image: {
    type: String
  },
});

export default mongoose.model("Artist", ArtistSchema);
