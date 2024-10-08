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
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res
        .status(400)
        .json({ msg: "Email, password, and user type are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ msg: "User already exists" }); 
    }

    user = new User({ email, password, userType });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email,
        userType,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
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

export const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) {
      return res.status(400).json({ msg: "Token ID is required" });
    }

    const response = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email_verified, name, email } = response.payload;

    if (!email_verified) {
      return res.status(400).json({ msg: "Google email not verified" });
    }

    let user = await User.findOne({ email });

    if (user) {
      // User already exists
      const token = generateToken(user);
      return res.json({
        isNewUser: false,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          country: user.country,
        },
      });
    } else {
      // Create a new user
      user = new User({
        name,
        email,
        googleId: response.payload.sub,
        userType: "regularUser",
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
      });
      await user.save();

      const token = generateToken(user);
      return res.json({
        isNewUser: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          country: user.country,
        },
      });
    }
  } catch (err) {
    console.error("Google login error:", err);
    if (err.message.includes("jwt.split is not a function")) {
      return res.status(400).json({ msg: "Invalid Google token" });
    }
    res.status(500).json({ msg: "Server error during Google login" });
  }
};

export const completeGoogleSignup = async (req, res) => {
  try {
    const { tempToken, userType, country } = req.body;
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);

    let user = await User.findOne({ email: decoded.email });
    if (!user) {
      user = new User({
        name: decoded.name,
        email: decoded.email,
        userType,
        country,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
      });
      await user.save();
    } else {
      user.userType = userType;
      user.country = country;
      await user.save();
    }

    if (userType === "artist") {
      let artist = await Artist.findOne({ user: user._id });
      if (!artist) {
        artist = new Artist({
          user: user._id,
          genre: "Not specified",
          bio: "New artist",
        });
        await artist.save();
      }
    } else if (userType === "eventHost") {
      let eventHost = await EventHost.findOne({ user: user._id });
      if (!eventHost) {
        eventHost = new EventHost({
          user: user._id,
          companyName: "Not specified",
          description: "New event host",
          contactInfo: { phone: "Not specified", website: "Not specified" },
        });
        await eventHost.save();
      }
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        country: user.country,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
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
