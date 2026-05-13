const express = require("express");
const router = express.Router();
const upload = require("../../middleware/uploadMiddleware");
const { updateProfile, getProfile } = require("./companyProfile.controller");

// Middleware to ensure company is logged in (reusing existing auth logic)
// Assuming we attach user to req in server.js or global middleware
// If not, we need to import `attachUser` or similar. 
// Based on server.js usage `app.use(attachUser)`, user is attached.
const ensureAuthenticated = (req, res, next) => {
    if (req.user) return next();
    res.status(401).json({ success: false, message: "Unauthorized" });
};

router.get("/", ensureAuthenticated, getProfile);
router.put("/", ensureAuthenticated, upload.single("logo"), updateProfile);

module.exports = router;
