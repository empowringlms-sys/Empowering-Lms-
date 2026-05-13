const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

const generateToken = (payload, expiresIn = "30d") => {
  try {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
  } catch (error) {
    throw new Error(error);
  }
};

const decodeToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { generateToken, decodeToken };
