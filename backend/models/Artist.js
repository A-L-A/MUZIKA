const mongoose = require("mongoose");

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
  bio: String,
  socialLinks: {
    instagram: String,
    facebook: String,
  },
});

module.exports = mongoose.model("Artist", ArtistSchema);
