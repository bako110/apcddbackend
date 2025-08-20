// routes/settingsRoutes.js
const express = require("express");
const { updateSettings, changePassword, addAdmin, uploadLogo } = require("../controllers/settingsController");

const router = express.Router();

// Routes
router.put("/settings", updateSettings);
router.put("/settings/password", changePassword);
router.post("/admins", addAdmin);

// Upload logo/fav handled directly in controller
router.post("/settings/logo", uploadLogo);

module.exports = router;
