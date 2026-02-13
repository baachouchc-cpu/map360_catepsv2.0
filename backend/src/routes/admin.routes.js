const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const adminController = require("../controllers/admin.controller");

// LOGIN (pública)
router.get("/login", adminController.loginPage);

// ADMIN (protegida 🔐)
router.get("/admin", authMiddleware, adminController.adminPage);
router.get("/tecnic", authMiddleware, adminController.tecniPage);

module.exports = router;
