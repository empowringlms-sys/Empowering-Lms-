const express = require("express");
const {
  loginWithToken,
  loginCompany,
  signupCompany,
  verifyCompanyOTP,
  resendCompanyOTP,
  getOTPStatus,
  getAllCompanies,
  getCompanyById,
  generateSSOToken,
  loginBySSOToken,
  getCompanyBySlug,
} = require("./companyAuth.controller.js");
const { company } = require("./companyAuth.middleware.js");
const { superAdmin } = require("../superAdminAuth/superAdminAuth.middleware.js");

const router = express.Router();

// Company Signup and Verification
router.get("/login-by-token", company, loginWithToken);
router.post("/login", loginCompany);
router.post("/signup", signupCompany);
router.post("/verify-company-otp", company, verifyCompanyOTP);
router.post("/resend-company-otp", company, resendCompanyOTP);
router.get("/otp-status", company, getOTPStatus);

// SSO Logic
router.post("/generate-sso-token", company, generateSSOToken);
router.post("/login-by-sso-token", loginBySSOToken);

// Public Route for Slug Check
router.get("/public/:slug", getCompanyBySlug);

// Super Admin Routes
router.get("/all", getAllCompanies);
router.get("/:id", getCompanyById);

module.exports = router;
