import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import Artist from "../models/Artist.js";
import EventHost from "../models/EventHost.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const EXPRESS_SECRET = process.env.EXPRESS_SECRET;

let adminCreated = false;

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, userType: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, userType, country, ...additionalInfo } =
      req.body;

    if (!name || !email || !password || !userType || !country) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ name, email, password, userType, country });

    if (userType === "artist") {
      const { genre, bio, socialLinks } = additionalInfo;
      if (!genre || !bio) {
        return res
          .status(400)
          .json({ msg: "Genre and bio are required for artists" });
      }
      const artist = new Artist({ user: user._id, genre, bio, socialLinks });
      await artist.save();
    } else if (userType === "eventHost") {
      const { companyName, description, contactInfo } = additionalInfo;
      if (!companyName || !description) {
        return res.status(400).json({
          msg: "Company name and description are required for event hosts",
        });
      }
      const eventHost = new EventHost({
        user: user._id,
        companyName,
        description,
        contactInfo,
      });
      await eventHost.save();
    } else if (userType !== "regularUser") {
      return res.status(400).json({ msg: "Invalid user type" });
    }

    await user.save();

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name,
        email,
        userType,
        country,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("No user found with email:", email);
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    console.log("User found:", user.email, user.userType);
    console.log("Stored password hash:", user.password);
    console.log("Entered password:", password);

    if (!password) {
      console.log("Password is undefined or null");
      return res.status(400).json({ msg: "Password is required" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Password does not match");
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        country: user.country,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;
    const response = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email_verified, name, email } = response.payload;
    if (email_verified) {
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          name,
          email,
          googleId: response.payload.sub,
          userType: "regularUser",
        });
        await user.save();
      }
      const token = generateToken(user);
      res.json({
        token,
        user: { id: user._id, name, email, userType: user.userType },
      });
    } else {
      return res.status(400).json({ msg: "Google login failed. Try again." });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const setupAdmin = async (req, res) => {
  console.log("Incoming secret:", req.body.secret);
  console.log("Stored secret:", process.env.EXPRESS_SECRET);

  const { secret, name, email, password, country } = req.body;

  if (secret !== EXPRESS_SECRET) {
    return res.status(403).json({ msg: "Invalid secret" });
  }

  if (adminCreated) {
    return res.status(403).json({ msg: "Admin already created" });
  }

  try {
    const admin = new User({
      name,
      email,
      password,
      userType: "admin",
      country,
    });

    await admin.save();
    adminCreated = true;

    res.status(201).json({ msg: "Admin created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
