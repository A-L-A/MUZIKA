import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Artist from "../models/Artist.js";
import { Event } from "../models/Event.js"; // Named import for Event

export const auth = async function (req, res, next) {
  const token = req.header("x-auth-token") || req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    let decoded;
    if (typeof token === "string" && token.startsWith("Bearer ")) {
      decoded = jwt.verify(token.slice(7), process.env.JWT_SECRET);
    } else {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ msg: "Token is not valid" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export const isAdmin = function (req, res, next) {
  if (req.user && req.user.userType === "admin") {
    next();
  } else {
    res.status(403).json({ msg: "Access denied. Admin privileges required." });
  }
};

export const isArtistOrAdmin = async function (req, res, next) {
  if (req.user.userType === "admin") {
    return next();
  }

  if (req.user.userType === "artist") {
    const artistId = req.params.id;
    if (artistId) {
      const artist = await Artist.findById(artistId);
      if (artist && artist.user.toString() === req.user._id.toString()) {
        return next();
      }
    } else {
      return next();
    }
  }

  res.status(403).json({
    msg: "Access denied. Artist can only modify their own profile or admin privileges required.",
  });
};

export const isEventHostOrAdmin = async function (req, res, next) {
  if (req.user.userType === "admin") {
    return next();
  }

  if (req.user.userType === "eventHost") {
    const eventId = req.params.id;
    if (eventId) {
      const event = await Event.findById(eventId);
      if (event && event.eventHost.toString() === req.user._id.toString()) {
        return next();
      }
    } else {
      return next();
    }
  }

  res.status(403).json({
    msg: "Access denied. Event host can only modify their own events or admin privileges required.",
  });
};
