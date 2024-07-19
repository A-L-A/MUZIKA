const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = async function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token") || req.header("Authorization");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    let decoded;
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
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

exports.isAdmin = function (req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ msg: "Access denied. Admin privileges required." });
  }
};


exports.isArtistOrAdmin = function (req, res, next) {
  if (req.user && (req.user.userType === "artist" || req.user.userType === "admin")) {
    next();
  } else {
    res.status(403).json({ msg: "Access denied. Artist or admin privileges required." });
  }
};

exports.isEventHostOrAdmin = function (req, res, next) {
  if (req.user && (req.user.userType === "eventHost" || req.user.userType === "admin")) {
    next();
  } else {
    res.status(403).json({ msg: "Access denied. Event host or admin privileges required." });
  }
};

exports.isEventHostOrAdmin = function (req, res, next) {
  if (
    req.user &&
    (req.user.userType === "eventHost" || req.user.userType === "admin")
  ) {
    next();
  } else {
    res
      .status(403)
      .json({ msg: "Access denied. Event Host or Admin privileges required." });
  }
};