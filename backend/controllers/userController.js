import User from "../models/User.js";
import bcrypt from "bcryptjs";



export const getAllUsers  = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, userType, country } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    user = new User({ name, email, password, userType, country });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const updateUser = async (req, res) => {
  const { name, email, userType, country } = req.body;
  try {
    let user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { name, email, userType, country } },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const getUserProfile  = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

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
    } = req.body;

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
      let artist = await Artist.findOne({ user: user._id });
      if (artist) {
        artist.genre = genre || artist.genre;
        artist.bio = bio || artist.bio;
        artist.socialLinks = socialLinks || artist.socialLinks;
        await artist.save();
      } else {
        artist = new Artist({
          user: user._id,
          genre,
          bio,
          socialLinks,
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

// In your userController.js or a similar file
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
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
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


export const deleteUserProfile  = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ msg: "User account has been deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
