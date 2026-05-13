const {
  generateAdminToken,
} = require("./adminAuth.service");
const Company = require("../companyAuth/Company");
const { decrypt } = require("../../utils/encryption");

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  let user = null;

  // Check for Company Admin (Database)
  try {
    const company = await Company.findOne({ "account.email": email });
    if (company && company.account) {
      const decryptedPassword = decrypt(company.account.password);
      if (decryptedPassword === password) {
        // Manual Access Check
        if (company.profile && company.profile.manualAccessStatus === false) {
          return res.status(403).json({ message: "Institute access has been revoked." });
        }

        // Subscription Check
        const now = new Date();
        const expiresAt = company.subscription?.expiresAt ? new Date(company.subscription.expiresAt) : null;

        const isSubscriptionActive =
          company.subscription?.status === 'active' ||
          (expiresAt && expiresAt > now);

        if (!isSubscriptionActive && !company.subscription?.hasUsedTrial) {
          return res.status(403).json({ message: "Institute subscription expired." });
        }

        // Strict Status Check
        if (['past_due', 'canceled', 'unpaid', 'inactive'].includes(company.subscription?.status)) {
          if (!expiresAt || expiresAt < now) {
            return res.status(403).json({ message: "Institute subscription expired." });
          }
        }

        user = {
          email: company.account.email,
          id: company._id,
          name: company.account.name,
          role: "company"
        };
      }
    }
  } catch (err) {
    console.error("Error finding company:", err);
  }

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateAdminToken(user);

  // ✅ DYNAMIC cookie settings for production
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie("admin_token", token, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax", // "none" for Vercel
    secure: isProduction, // true for HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
    // DO NOT set domain - let browser handle it
  });

  // ✅ Also return success response
  // ✅ Also return success response
  res.json({
    success: true,
    message: "Logged in successfully",
    data: {
      authToken: token,
      admin: user
    }
  });
};

const adminLogout = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.clearCookie("admin_token", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
  });

  res.json({
    success: true,
    message: "Logged out successfully"
  });
};

const adminAutoLogin = async (req, res) => {
  try {
    // Fetch fresh data from DB
    const company = await Company.findById(req.admin.id);

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const user = {
      email: company.account.email,
      id: company._id,
      name: company.account.name,
      role: "company"
    };

    // Generate new token with fresh data
    const token = generateAdminToken(user);
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie("admin_token", token, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      success: true,
      authenticated: true,
      admin: user,
    });
  } catch (error) {
    console.error("Auto-login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const loginWithSSO = async (req, res) => { // New SSO Login
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" });
  }

  // Verify the SSO token
  // We can use verifyAdminToken or just jwt.verify directly since keys match
  try {
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.sso) {
      return res.status(401).json({ success: false, message: "Invalid token type" });
    }

    const companyId = decoded._id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    // Prepare user object (same as adminLogin)
    const user = {
      email: company.account.email,
      id: company._id,
      name: company.account.name,
      role: "company"
    };

    const adminToken = generateAdminToken(user);
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie("admin_token", adminToken, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    res.json({
      success: true,
      message: "Logged in successfully",
      data: {
        authToken: adminToken,
        admin: user
      }
    });

  } catch (error) {
    console.error("SSO Login Error:", error);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = {
  adminLogin,
  adminLogout,
  adminAutoLogin,
  loginWithSSO,
};