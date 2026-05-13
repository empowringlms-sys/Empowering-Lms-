const { verifyAdminToken } = require("./adminAuth.service");

const admin = (req, res, next) => {
  let token = req.cookies?.admin_token;

  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Admin authentication required" });
  }

  try {
    const decoded = verifyAdminToken(token);

    if (decoded.role !== "company") {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
};

module.exports = { admin };
