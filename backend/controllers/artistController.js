import Artist from "../models/Artist.js";

export const createOrUpdateArtist  = async (req, res) => {
  const { genre, bio, socialLinks } = req.body;
  try {
    let artist = await Artist.findOne({ user: req.user.id });
    if (artist) {
      artist = await Artist.findOneAndUpdate(
        { user: req.user.id },
        { $set: { genre, bio, socialLinks } },
        { new: true }
      ).populate("user", ["name", "email", "country"]);
    } else {
      artist = new Artist({
        user: req.user.id,
        genre,
        bio,
        socialLinks,
      });
      await artist.save();
      artist = await Artist.findById(artist._id).populate("user", [
        "name",
        "email",
        "country",
      ]);
    }
    res.json(artist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const getAllArtists  = async (req, res) => {
  try {
    const artists = await Artist.find().populate("user", [
      "name",
      "email",
      "country",
    ]);
    res.json(artists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


export const getArtistById  = async (req, res) => {
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
    res.status(500).send("Server Error");
  }
};


export const getArtistProfile  = async (req, res) => {
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


export const updateArtist = async (req, res) => {
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


export const deleteArtist  = async (req, res) => {
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



export const updateArtistProfile  = async (req, res) => {
  const { genre, bio, socialLinks } = req.body;
  try {
    let artist = await Artist.findOne({ user: req.user.id });
    if (!artist) {
      return res.status(404).json({ msg: "Artist profile not found" });
    }
    artist = await Artist.findOneAndUpdate(
      { user: req.user.id },
      { $set: { genre, bio, socialLinks } },
      { new: true }
    );
    res.json(artist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


export const deleteArtistProfile  = async (req, res) => {
  try {
    const artist = await Artist.findOneAndDelete({ user: req.user.id });
    if (!artist) {
      return res.status(404).json({ msg: "Artist profile not found" });
    }
    res.json({ msg: "Artist profile removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
