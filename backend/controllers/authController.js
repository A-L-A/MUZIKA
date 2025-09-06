import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Artist from "../models/Artist.js";
import EventHost from "../models/EventHost.js";

const EXPRESS_SECRET = process.env.EXPRESS_SECRET;

let adminCreated = false;

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, userType: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    if (!password) {
      return res.status(400).json({ msg: "Password is required" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
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

export const signup = async (req, res) => {
  try {
    const {
      email,
      password,
      userType,
      name,
      country,
      genre,
      bio,
      companyName,
      description,
      contactInfo,
    } = req.body;

    if (!email || !password || !userType) {
      return res
        .status(400)
        .json({ msg: "Email, password, and user type are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ msg: "User already exists" });
    }

    // Create user with all provided fields
    user = new User({
      email,
      password,
      userType,
      name,
      country,
      genre,
      bio,
      companyName,
      description,
      contactInfo,
    });

    await user.save();

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        name: user.name,
        country: user.country,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const setupAdmin = async (req, res) => {
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
