import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const auth = async function (req, res, next) {
  const token = req.header("x-auth-token") || req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    let decoded;
    if (token.startsWith("Bearer ")) {
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

export const isArtistOrAdmin = function (req, res, next) {
  if (
    req.user &&
    (req.user.userType === "artist" || req.user.userType === "admin")
  ) {
    next();
  } else {
    res
      .status(403)
      .json({ msg: "Access denied. Artist or admin privileges required." });
  }
};

export const isEventHostOrAdmin = function (req, res, next) {
  if (
    req.user &&
    (req.user.userType === "eventHost" || req.user.userType === "admin")
  ) {
    next();
  } else {
    res
      .status(403)
      .json({ msg: "Access denied. Event host or admin privileges required." });
  }
};
