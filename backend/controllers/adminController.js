import express from "express";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const EXPRESS_SECRET = process.env.EXPRESS_SECRET;

let adminCreated = false;

router.post("/", async (req, res) => {


  const { secret, name, email, password, country } = req.body;

  if (!secret || !EXPRESS_SECRET) {
    console.error("Secret or EXPRESS_SECRET is undefined");
    return res.status(400).json({ msg: "Secret is missing" });
  }

  console.log("Are secrets equal?", secret === EXPRESS_SECRET);

  if (secret.trim() !== EXPRESS_SECRET.trim()) {
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
});

export default router;
