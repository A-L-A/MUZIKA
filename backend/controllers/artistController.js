const Artist = require("../models/Artist");

exports.createOrUpdateArtist = async (req, res) => {
  const { genre, bio, socialLinks } = req.body;
  try {
    let artist = await Artist.findOne({ user: req.user.id });
    if (artist) {
      artist = await Artist.findOneAndUpdate(
        { user: req.user.id },
        { $set: { genre, bio, socialLinks } },
        { new: true }
      );
    } else {
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
};

exports.getArtistProfile = async (req, res) => {
  try {
    const artist = await Artist.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "email"]
    );
    if (!artist) {
      return res.status(404).json({ msg: "Artist profile not found" });
    }
    res.json(artist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Keep getAllArtists and getArtistById as they were

exports.updateArtist = async (req, res) => {
  // For admin use
  const { genre, bio, socialLinks } = req.body;
  try {
    let artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ msg: "Artist not found" });
    }
    artist = await Artist.findByIdAndUpdate(
      req.params.id,
      { $set: { genre, bio, socialLinks } },
      { new: true }
    );
    res.json(artist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteArtist = async (req, res) => {
  // For admin use
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ msg: "Artist not found" });
    }
    await artist.remove();
    res.json({ msg: "Artist removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
