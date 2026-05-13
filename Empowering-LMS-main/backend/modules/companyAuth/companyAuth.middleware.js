require("dotenv").config();
const { decodeToken } = require("../../utils/jwtUtils");
const Company = require("./Company");

// This middleware will decode the token and add the user to req.user
// Note: This is redundant if attachUser is used globally in server.js, but good to have for modularity
exports.attachCompany = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = await decodeToken(token);
      if (decoded) {
        req.user = decoded;
      }
    } catch (error) {
      console.log("Token decode error:", error.message);
      req.user = undefined;
    }
  }

  next();
};

// check company.
exports.company = async (req, res, next) => {
  if (req?.user) {
    try {
      // Verify the user exists in the Company collection
      // We use email to match, as it should be unique
      const email = req.user.account?.email || req.user.email;
      const company = await Company.findOne({ "account.email": email });
      if (company) {
        // 1. Check Manual Access
        if (company.profile.manualAccessStatus === false) {
          return res.status(403).json({
            success: false,
            message: "Your access has been revoked by the Super Admin.",
            reason: "ACCESS_REVOKED"
          });
        }

        // 2. Check Subscription Status
        const now = new Date();
        const expiresAt = company.subscription?.expiresAt ? new Date(company.subscription.expiresAt) : null;

        // Logic: Access allowed if active OR (expiresAt exists AND is in future)
        // If status is 'active' we usually trust it, but best to check expiration date too if available.
        // If status is 'inactive' or 'canceled' AND date passed -> Block.

        const isSubscriptionActive =
          company.subscription?.status === 'active' ||
          (expiresAt && expiresAt > now);

        if (!isSubscriptionActive && !company.subscription?.hasUsedTrial) {
          // Allow if they are new (maybe? but usually they need a plan). 
          // Requirement: "payment nahi koi pi plan purchase nahi kya ... login na kr suke"
          // So if inactive and expired -> Block.
          return res.status(403).json({
            success: false,
            message: "Your subscription has expired or is inactive. Please renew to continue.",
            reason: "SUBSCRIPTION_EXPIRED"
          });
        }

        // Extra check: If status is explicitly cancelled/past_due and date passed
        if (['past_due', 'canceled', 'unpaid', 'inactive'].includes(company.subscription?.status)) {
          if (!expiresAt || expiresAt < now) {
            return res.status(403).json({
              success: false,
              message: "Your subscription has expired. Please renew.",
              reason: "SUBSCRIPTION_EXPIRED"
            });
          }
        }

        req.company = company;
        return next();
      }
    } catch (error) {
      console.error("Error in company middleware:", error);
    }
  }

  res.status(403).json({
    success: false,
    message: "Not authorized as company",
  });
};
