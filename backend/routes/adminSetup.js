const express = require("express");
const router = express.Router();
const User = require("../models/User");

const EXPRESS_SECRET = process.env.EXPRESS_SECRET;

let adminCreated = false;

router.post(
  "/setup",
  (req, res, next) => {
    console.log("Incoming secret:", req.body.secret);
    console.log("Stored secret:", process.env.EXPRESS_SECRET);

    const { secret } = req.body;
    if (secret !== process.env.EXPRESS_SECRET) {
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
      const admin = new User({
        name,
        email,
        password, 
        userType: "admin",
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
