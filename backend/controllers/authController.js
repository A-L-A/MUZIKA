const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, userType: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    user = new User({ name, email, password, userType });
    await user.save(); // The pre-save middleware will hash the password
    const token = generateToken(user);
    res
      .status(201)
      .json({
        token,
        user: { id: user._id, name, email, userType, isAdmin: user.isAdmin },
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", { email });

  try {
    let user = await User.findOne({ email });

    if (!user) {
      console.log("Login failed: User not found");
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
    const isMatch = await user.comparePassword(password);
    console.log("Password match:", isMatch ? "Yes" : "No");
    if (!isMatch) {
      console.log("Login failed: Password mismatch");
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Generate token and send response
    const token = generateToken(user);
    console.log(token);
  
    console.log("Login successful");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
};
 


exports.googleLogin = async (req, res) => {
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
          userType: "user",
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
