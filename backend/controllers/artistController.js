import Artist from "../models/Artist.js";
import User from "../models/User.js";

/**
 * Maps artist name to image filename
 * @param {Object} artist - Artist with user details
 * @returns {string} - Filename for the artist
 */
const getArtistImageFilename = (artist) => {
  if (!artist || !artist.user || !artist.user.name) {
    return "default-artist.jpg";
  }

  // Extract first name from full name
  const firstName = artist.user.name.split(" ")[0].toLowerCase();

  // List of available artist images
  const availableArtists = [
    "juma",
    "wanjiku",
    "esther",
    "aminata",
    "moussa",
    "chantal",
    "jean-claude",
    "tariq",
  ];

  return availableArtists.includes(firstName)
    ? `${firstName}.jpg`
    : "default-artist.jpg";
};

/**
 * Create or update artist profile for current user
 * POST /api/artists
 */
export const createOrUpdateArtist = async (req, res) => {
  const { genre, bio, socialLinks, image } = req.body;
  try {
    // Get user details for name-based image selection
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if artist profile already exists
    let artist = await Artist.findOne({ user: req.user.id });

    // Generate image filename based on artist name if not provided
    const defaultImageName = getArtistImageFilename({
      user: {
        name: user.name,
      },
    });

    // Use provided image or default
    const artistImage = image || (artist ? artist.image : defaultImageName);

    if (artist) {
      // Update existing artist profile
      artist = await Artist.findOneAndUpdate(
        { user: req.user.id },
        {
          $set: {
            genre: genre || artist.genre,
            bio: bio || artist.bio,
            socialLinks: socialLinks || artist.socialLinks,
            image: artistImage,
          },
        },
        { new: true }
      ).populate("user", ["name", "email", "country"]);
    } else {
      // Create new artist profile
      artist = new Artist({
        user: req.user.id,
        genre,
        bio,
        socialLinks,
        image: artistImage,
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
    console.error("Error creating/updating artist:", err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * Update artist by ID (admin or artist owner)
 * PUT /api/artists/:id
 */
export const updateArtist = async (req, res) => {
  const { genre, bio, socialLinks, image } = req.body;
  try {
    // Find artist by ID
    let artist = await Artist.findById(req.params.id).populate("user", [
      "name",
      "email",
      "country",
    ]);

    if (!artist) {
      return res.status(404).json({ msg: "Artist not found" });
    }

    // Generate image filename based on artist name if not provided
    const defaultImageName = getArtistImageFilename(artist);

    // Use provided image, existing image, or default
    const artistImage = image || artist.image || defaultImageName;

    // Update artist
    artist = await Artist.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          genre: genre || artist.genre,
          bio: bio || artist.bio,
          socialLinks: socialLinks || artist.socialLinks,
          image: artistImage,
        },
      },
      { new: true }
    ).populate("user", ["name", "email", "country"]);

    res.json(artist);
  } catch (err) {
    console.error("Error updating artist by ID:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Artist not found" });
    }
    res.status(500).send("Server Error");
  }
};

/**
 * Get all artists
 * GET /api/artists
 */
export const getAllArtists = async (req, res) => {
  try {
    let artists = await Artist.find().populate("user", [
      "name",
      "email",
      "country",
    ]);

    // Ensure all artists have an appropriate image
    const artistsWithImages = artists.map((artist) => {
      const artistObj = artist.toObject();
      if (!artistObj.image) {
        artistObj.image = getArtistImageFilename(artist);
      }
      return artistObj;
    });

    res.json(artistsWithImages);
  } catch (err) {
    console.error("Error getting all artists:", err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * Get artist by ID
 * GET /api/artists/:id
 */
export const getArtistById = async (req, res) => {
  try {
    console.log("Searching for artist with ID:", req.params.id);
    const artist = await Artist.findById(req.params.id).populate("user", [
      "name",
      "email",
      "country",
    ]);

    if (!artist) {
      console.log("No artist found with ID:", req.params.id);
      return res.status(404).json({ msg: "Artist profile not found" });
    }

    // Ensure artist has an appropriate image
    const artistWithImage = artist.toObject();
    if (!artistWithImage.image) {
      artistWithImage.image = getArtistImageFilename(artist);
    }

    console.log("Artist found:", artistWithImage);
    res.json(artistWithImage);
  } catch (err) {
    console.error("Error in getArtistById:", err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * Get current user's artist profile
 * GET /api/artists/profile
 */
export const getArtistProfile = async (req, res) => {
  try {
    const artist = await Artist.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "email", "country"]
    );

    if (!artist) {
      return res.status(404).json({ msg: "Artist profile not found" });
    }

    // Ensure artist has an appropriate image
    const artistWithImage = artist.toObject();
    if (!artistWithImage.image) {
      artistWithImage.image = getArtistImageFilename(artist);
    }

    res.json(artistWithImage);
  } catch (err) {
    console.error("Error getting artist profile:", err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * Delete artist by ID
 * DELETE /api/artists/:id
 */
export const deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({ msg: "Artist not found" });
    }

    await Artist.findByIdAndDelete(req.params.id);
    res.json({ msg: "Artist removed" });
  } catch (err) {
    console.error("Error deleting artist:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Artist not found" });
    }
    res.status(500).send("Server Error");
  }
};

/**
 * Update current user's artist profile
 * PUT /api/artists/profile
 */
export const updateArtistProfile = async (req, res) => {
  const { genre, bio, socialLinks, image } = req.body;
  try {
    // Get user for name-based image selection
    const user = await User.findById(req.user.id);

    let artist = await Artist.findOne({ user: req.user.id });

    if (!artist) {
      return res.status(404).json({ msg: "Artist profile not found" });
    }

    // Generate default image based on artist name
    const defaultImageName = getArtistImageFilename({
      user: {
        name: user.name,
      },
    });

    // Use provided image, existing image, or default
    const artistImage = image || artist.image || defaultImageName;

    // Update artist profile
    artist = await Artist.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          genre: genre || artist.genre,
          bio: bio || artist.bio,
          socialLinks: socialLinks || artist.socialLinks,
          image: artistImage,
        },
      },
      { new: true }
    );

    res.json(artist);
  } catch (err) {
    console.error("Error updating artist profile:", err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * Delete current user's artist profile
 * DELETE /api/artists/profile
 */
export const deleteArtistProfile = async (req, res) => {
  try {
    const artist = await Artist.findOneAndDelete({ user: req.user.id });

    if (!artist) {
      return res.status(404).json({ msg: "Artist profile not found" });
    }

    res.json({ msg: "Artist profile removed" });
  } catch (err) {
    console.error("Error deleting artist profile:", err.message);
    res.status(500).send("Server Error");
  }
};
