const { verifySuperAdminToken } = require("./superAdminAuth.service");

const superAdmin = (req, res, next) => {
  let token = req.cookies?.super_admin_token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Super admin authentication required" });
  }

  try {
    const decoded = verifySuperAdminToken(token);

    if (
      decoded.role !== "super-admin" ||
      decoded.email !== process.env.SUPER_ADMIN_EMAIL
    ) {
      return res.status(403).json({ message: "Super admin access only" });
    }

    req.superAdmin = decoded;
    // CRITICAL: Clear any company context that might have been attached by global middleware (attachUser)
    // to prevent Super Admin from being treated as a Company Admin if cookies are shared.
    req.company = null;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired super admin token" });
  }
};

module.exports = { superAdmin };

