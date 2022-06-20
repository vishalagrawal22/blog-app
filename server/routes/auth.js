const express = require("express");
const { Router } = express;
const router = Router();

const authController = require("../controllers/authController");

router.post("/login", authController.handleLogin);
router.post("/register", authController.handleRegister);
router.post("/token", authController.handleGenerateAccessToken);
router.delete("/logout", authController.handleLogout);

module.exports = router;
