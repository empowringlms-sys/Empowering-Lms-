// modules/userAuth/userAuth.middleware.js
require("dotenv").config();
const { decodeToken } = require("../../utils/jwtUtils");

// This middleware will decode the token and add the user to req.user
exports.attachUser = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && (req.cookies.admin_token || req.cookies.token)) {
    // Check cookies as fallback
    token = req.cookies.admin_token || req.cookies.token;
  }

  // SKIP for Super Admin routes to prevent accidental blocking
  if (req.path.startsWith('/api/super-admin')) {
    return next();
  }

  if (token) {
    try {
      const decoded = await decodeToken(token);
      if (decoded) {
        req.user = decoded;
      }
    } catch (error) {
      console.log("Token decode error:", error.message);
      req.user = undefined;
    }
  }

  if (req.user) {
    try {
      const Company = require("../companyAuth/Company");
      // Scenario 1: User is a Company Admin (found by email)
      const email = req.user.account?.email || req.user.email;
      let company = await Company.findOne({ "account.email": email });

      // Scenario 2: User is a Learner (check their companyId from token or find by ID)
      if (!company && req.user.companyId) {
        company = await Company.findById(req.user.companyId);
      }

      // If we found a relevant company (either own or parent), check status
      if (company) {
        // SKIP Access control checks for Login/Signup/OTP routes to prevent Lockout Loop
        // Note: The controllers for these routes MUST perform their own active checks before issuing new tokens.
        const isAuthRoute = req.path.includes('/login') || req.path.includes('/signup') || req.path.includes('/otp') || req.path.includes('/verify');

        if (isAuthRoute) {
          req.company = company; // Still attach for context if needed
          return next();
        }

        const now = new Date();
        const expiresAt = company.subscription?.expiresAt ? new Date(company.subscription.expiresAt) : null;

        // 1. Manual Block
        if (company.profile.manualAccessStatus === false) {
          return res.status(403).json({
            success: false,
            message: "Institute access has been revoked.",
            reason: "INSTITUTE_ACCESS_REVOKED"
          });
        }

        // 2. Subscription Check
        const isSubscriptionActive =
          company.subscription?.status === 'active' ||
          (expiresAt && expiresAt > now);

        // Strict Block if subscription issue
        if (!isSubscriptionActive && !company.subscription?.hasUsedTrial) {
          return res.status(403).json({
            success: false,
            message: "Institute subscription expired.",
            reason: "INSTITUTE_SUBSCRIPTION_EXPIRED"
          });
        }

        if (['past_due', 'canceled', 'unpaid', 'inactive'].includes(company.subscription?.status)) {
          if (!expiresAt || expiresAt < now) {
            return res.status(403).json({
              success: false,
              message: "Institute subscription expired.",
              reason: "INSTITUTE_SUBSCRIPTION_EXPIRED"
            });
          }
        }

        req.company = company;
      }
    } catch (error) {
      console.log("Company attach error:", error.message);
    }
  }

  next();
};

// check user.
exports.user = (req, res, next) => {
  if (req?.user && !req?.user?.isAdmin) {
    return next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized as user",
    });
  }
};
