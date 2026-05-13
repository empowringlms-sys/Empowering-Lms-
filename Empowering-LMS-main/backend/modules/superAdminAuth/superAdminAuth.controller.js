const {
  validateSuperAdminCredentials,
  generateSuperAdminToken,
} = require("./superAdminAuth.service");

const superAdminLogin = (req, res) => {
  const { email, password } = req.body;

  if (!validateSuperAdminCredentials(email, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateSuperAdminToken({
    email,
    role: "super-admin",
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("super_admin_token", token, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.json({
    success: true,
    message: "Super admin logged in successfully",
    data: {
      authToken: token,
      superAdmin: { email, role: "super-admin" }
    }
  });
};

const superAdminLogout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("super_admin_token", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

const superAdminAutoLogin = (req, res) => {
  res.json({
    success: true,
    authenticated: true,
    superAdmin: req.superAdmin,
  });
};

module.exports = {
  superAdminLogin,
  superAdminLogout,
  superAdminAutoLogin,
};

