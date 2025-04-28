import User from "../models/User.js";
import Artist from "../models/Artist.js";
import bcrypt from "bcryptjs";

/**
 * Get all users - Admin only
 * GET /api/admin/users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error getting all users:", err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * Create new user - Admin only
 * POST /api/admin/users
 */
export const createUser = async (req, res) => {
  const { name, email, password, userType, country } = req.body;
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create new user
    user = new User({ name, email, password, userType, country });

    // Password is hashed in the User model pre-save hook
    await user.save();

    res.status(201).json(user);
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * Update user by ID - Admin only
 * PUT /api/admin/users/:id
 */
export const updateUser = async (req, res) => {
  const { name, email, userType, country } = req.body;
  try {
    // Update user
    let user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { name, email, userType, country } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * Delete user by ID - Admin only
 * DELETE /api/admin/users/:id
 */
export const deleteUser = async (req, res) => {
  try {
    // Delete user
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Also delete artist profile if exists
    if (user.userType === "artist") {
      await Artist.findOneAndDelete({ user: user._id });
    }

    res.json({ msg: "User removed" });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * Get current user profile
 * GET /api/users/profile
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error getting user profile:", err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * Update current user profile
 * PUT /api/users/profile
 */
export const updateUserProfile = async (req, res) => {
  try {
    const {
      name,
      country,
      genre,
      bio,
      companyName,
      description,
      contactInfo,
      socialLinks,
      image,
    } = req.body;

    // Get current user
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update user fields
    if (name) user.name = name;
    if (country) user.country = country;
    if (genre) user.genre = genre;
    if (bio) user.bio = bio;
    if (companyName) user.companyName = companyName;
    if (description) user.description = description;
    if (contactInfo) user.contactInfo = { ...user.contactInfo, ...contactInfo };
    if (socialLinks) user.socialLinks = { ...user.socialLinks, ...socialLinks };

    // Check if all required fields are filled based on user type
    user.profileCompleted = checkProfileCompletion(user);
    await user.save();

    // If the user is an artist, update or create the artist profile
    if (user.userType === "artist") {
      const defaultImagePath = `/images/artistz/default-artist.jpg`;

      let artist = await Artist.findOne({ user: user._id });
      if (artist) {
        // Update existing artist profile
        artist.genre = genre || artist.genre;
        artist.bio = bio || artist.bio;
        artist.socialLinks = socialLinks || artist.socialLinks;
        artist.image = image || artist.image || defaultImagePath;
        await artist.save();
      } else {
        // Create new artist profile
        artist = new Artist({
          user: user._id,
          genre: genre || "Not specified",
          bio: bio || "New artist",
          socialLinks: socialLinks || {},
          image: image || defaultImagePath,
        });
        await artist.save();
      }
    }

    res.json(user);
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).send("Server Error");
  }
};

/**
 * Helper function to check if profile is complete
 * @param {Object} user - User object to check
 * @returns {boolean} - Whether profile is complete
 */
function checkProfileCompletion(user) {
  const requiredFields = ["name", "email", "country"];

  if (user.userType === "artist") {
    requiredFields.push("genre", "bio");
  } else if (user.userType === "eventHost") {
    requiredFields.push(
      "companyName",
      "description",
      "contactInfo.phone",
      "contactInfo.website"
    );
  }

  return requiredFields.every((field) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      return user[parent] && user[parent][child];
    }
    return user[field];
  });
}

/**
 * Change user password
 * PUT /api/users/change-password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get current user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password:", err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * Delete current user profile
 * DELETE /api/users/profile
 */
export const deleteUserProfile = async (req, res) => {
  try {
    // Delete user
    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Also delete artist profile if exists
    if (user.userType === "artist") {
      await Artist.findOneAndDelete({ user: user._id });
    }

    res.json({ msg: "User account has been deleted" });
  } catch (err) {
    console.error("Error deleting user profile:", err.message);
    res.status(500).send("Server Error");
  }
};
