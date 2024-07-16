const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const EXPRESS_SECRET = process.env.EXPRESS_SECRET;

let adminCreated = false;

router.post(
  "/setup",
  (req, res, next) => {
    const { secret } = req.body;
    if (secret !== EXPRESS_SECRET) {
      return res.status(403).json({ msg: "Invalid secret" });
    }
    next();
  },
  async (req, res) => {
    if (adminCreated) {
      return res.status(403).json({ msg: "Admin already created" });
    }

    const { name, email, password } = req.body;

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const admin = new User({
        name,
        email,
        password: hashedPassword,
        isAdmin: true,
      });

      await admin.save();
      adminCreated = true;

      res.status(201).json({ msg: "Admin created successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
