const express = require("express");
const router = express.Router();
const { signup, login, googleLogin } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);

module.exports = router;
