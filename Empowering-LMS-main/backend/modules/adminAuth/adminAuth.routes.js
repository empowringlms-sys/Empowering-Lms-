const express = require("express");
const {
  adminLogin,
  adminLogout,
  adminAutoLogin,
  loginWithSSO,
} = require("./adminAuth.controller");

const { admin } = require("./adminAuth.middleware");

const router = express.Router();

router.post("/login", adminLogin);
router.post("/login-sso", loginWithSSO);
router.post("/logout", adminLogout);
router.get("/me", admin, adminAutoLogin);

module.exports = router;
