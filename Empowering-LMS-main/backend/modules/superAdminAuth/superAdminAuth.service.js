const jwt = require("jsonwebtoken");

const validateSuperAdminCredentials = (email, password) => {
  return (
    email === process.env.SUPER_ADMIN_EMAIL &&
    password === process.env.SUPER_ADMIN_PASSWORD
  );
};

const generateSuperAdminToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const verifySuperAdminToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  validateSuperAdminCredentials,
  generateSuperAdminToken,
  verifySuperAdminToken,
};

