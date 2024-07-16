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
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const token = generateToken(user);
    res
      .status(201)
      .json({ token, user: { id: user._id, name, email, userType } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const token = generateToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email, userType: user.userType },
    });
  } catch (err) {
    console.error(err.message);
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
