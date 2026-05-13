const express = require("express");
const router = express.Router();
const { createCheckoutSession, handlePaymentSuccess } = require("./payment.controller");
const { protect } = require("../companyAuth/companyAuth.middleware"); // Assuming middleware exists or I need to find it.

// Check middleware path
// Previously viewed: backend/modules/companyAuth/companyAuth.middleware.js

// Middleware to use:
const { attachCompany, company } = require("../companyAuth/companyAuth.middleware");

// Apply both middlewares: first attach the user/company from token, then verify it's a valid company
router.post("/create-checkout-session", attachCompany, company, createCheckoutSession);
router.post("/payment-success", attachCompany, company, handlePaymentSuccess);

module.exports = router;
