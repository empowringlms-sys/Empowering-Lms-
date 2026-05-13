const Company = require("./Company");
// const bcrypt = require("bcrypt"); // Removed bcrypt
const { encrypt, decrypt } = require("../../utils/encryption");
const { generateToken } = require("../../utils/jwtUtils");
const { generateOTP } = require("../../utils/randomUtils");
const sendOtpEmailToCompany = require("./utils/sendOTPEmail");
const OTP_EXPIRY_TIME = Number(process.env.OTP_EXPIRY_TIME);
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Utility function to clean company object
const cleanCompanyObject = (company) => {
  if (!company) return null;

  let companyObject = company.toObject();
  if (companyObject.account) {
    // We still remove password from the response
    delete companyObject.account.password;
    delete companyObject.account.otp;
  }

  return companyObject;
};

// Helper function for responses
const sendResponse = (
  res,
  status,
  success,
  message,
  data = null,
  error = null,
) => {
  const response = {
    success,
    message,
  };

  if (data) response.data = data;
  if (error && process.env.NODE_ENV === "development")
    response.error = error.message;

  return res.status(status).json(response);
};

// Helper function to handle OTP generation and sending
const generateAndSendOTP = async (company) => {
  const otpCode = generateOTP(6);
  const expiresAt = Date.now() + OTP_EXPIRY_TIME;

  company.account.otp = {
    otpCode: otpCode,
    expiresAt: expiresAt,
  };

  await company.save();
  await sendOtpEmailToCompany(company.account.email, otpCode);

  return {
    otpCode,
    expiresAt,
    remainingTime: expiresAt - Date.now(),
  };
};

// Add a new controller to get OTP status
const getOTPStatus = async (req, res) => {
  try {
    const companyData = req.user;

    if (!companyData || !companyData.account) {
      return sendResponse(res, 401, false, "Unauthorized access.");
    }

    const company = await Company.findOne({ "account.email": companyData.account.email });

    if (!company) {
      return sendResponse(res, 404, false, "Company not found.");
    }

    // If company is already verified or has no OTP
    if (company.account.isVerified || !company.account.otp) {
      return sendResponse(res, 400, false, "No active OTP found.");
    }

    const remainingTime = company.account.otp.expiresAt - Date.now();

    return sendResponse(res, 200, true, "OTP status fetched successfully.", {
      expiresAt: company.account.otp.expiresAt,
      remainingTime: remainingTime > 0 ? remainingTime : 0,
      expiresIn: OTP_EXPIRY_TIME,
    });
  } catch (error) {
    console.error("Error in getOTPStatus:", error);
    return sendResponse(res, 500, false, "Internal server error.", null, error);
  }
};

const loginWithToken = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.account) {
      return sendResponse(res, 401, false, "User not logged in.");
    }

    const dbCompany = await Company.findOne({ "account.email": user.account.email });

    if (dbCompany) {
      dbCompany.account.lastVisit = new Date();
      await dbCompany.save();

      const sanitizedCompany = cleanCompanyObject(dbCompany);
      const authToken = generateToken(sanitizedCompany);

      return sendResponse(res, 200, true, "Company logged in successfully.", {
        userData: sanitizedCompany, // Keeping key as userData for frontend compatibility
        authToken,
      });
    }

    return sendResponse(res, 404, false, "Company not found.");
  } catch (error) {
    console.error("Error verifying token:", error);
    return sendResponse(
      res,
      401,
      false,
      "Invalid or expired token.",
      null,
      error,
    );
  }
};

const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendResponse(res, 400, false, "Email and password are required.");
    }

    const company = await Company.findOne({ "account.email": email });

    if (!company) {
      return sendResponse(res, 404, false, "Company not found.");
    }

    // Decrypt the stored password
    const decryptedPassword = decrypt(company.account.password);

    if (password !== decryptedPassword) {
      return sendResponse(res, 400, false, "Invalid password.");
    }

    // If company is not verified, send OTP
    if (!company.account.isVerified) {
      await generateAndSendOTP(company);

      const sanitizedCompany = cleanCompanyObject(company);
      const authToken = generateToken(sanitizedCompany);

      return sendResponse(
        res,
        200,
        true,
        "OTP sent to email. Please verify your account.",
        {
          authToken,
          userData: sanitizedCompany,
          requiresOTP: true,
          otpExpiresAt: company.account.otp.expiresAt,
          otpExpiresIn: OTP_EXPIRY_TIME,
        },
      );
    }

    company.account.lastLogin = new Date();
    await company.save();

    // Send Login Confirmation Email
    try {
      const sendLoginEmail = require("./utils/sendLoginEmail");
      const adminUrl = process.env.ADMIN_PANEL_URL || "http://localhost:5173";

      await sendLoginEmail(
        company.account.email,
        company.account.name,
        company.account.lastLogin,
        adminUrl
      );
    } catch (emailErr) {
      console.error("Login email failed:", emailErr);
    }

    const sanitizedCompany = cleanCompanyObject(company);
    const authToken = generateToken(sanitizedCompany);

    return sendResponse(res, 200, true, "Login Successful", {
      authToken,
      userData: sanitizedCompany,
    });
  } catch (error) {
    console.error("Error in loginCompany:", error);
    return sendResponse(res, 500, false, "Internal server error.", null, error);
  }
};

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
};

const generateUniqueSlug = async (name) => {
  let slug = slugify(name);
  let isUnique = false;
  let attempt = 0;

  while (!isUnique) {
    const existing = await Company.findOne({ "profile.slug": slug });
    if (!existing) {
      isUnique = true;
    } else {
      attempt++;
      slug = `${slugify(name)}-${generateOTP(4)}`; // Append random 4 digit code
    }
  }
  return slug;
};

const signupCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic required fields
    if (!name || !email || !password) {
      return sendResponse(res, 400, false, "All fields are required.");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendResponse(res, 400, false, "Enter a valid email.");
    }

    // Check if email exists and is verified
    const existingCompany = await Company.findOne({ "account.email": email });

    if (existingCompany && existingCompany.account.isVerified) {
      return sendResponse(
        res,
        409,
        false,
        "Already have an account on this email.",
      );
    }

    // Check if name is already taken
    const existingName = await Company.findOne({ "account.name": name });
    if (existingName) {
      // If the found company is the same as the one checking (unverified email case), it's fine (will be handled below)
      // BUT here we are creating a NEW one usually. 
      // If existingCompany exists (unverified), we might allow updating it.
      // If existingName exists and it is NOT the same unverified company, then block.

      if (!existingCompany || (existingCompany._id.toString() !== existingName._id.toString())) {
        return sendResponse(res, 409, false, "Company name already taken.");
      }
    }

    // Encrypt the password before saving
    const encryptedPassword = encrypt(password);

    // If company exists but not verified, update it
    if (existingCompany && !existingCompany.account.isVerified) {
      // Update company data
      existingCompany.account.name = name;

      // Update password with encrypted version
      existingCompany.account.password = encryptedPassword;

      await generateAndSendOTP(existingCompany);

      const sanitizedCompany = cleanCompanyObject(existingCompany);
      const authToken = generateToken(sanitizedCompany);

      return sendResponse(
        res,
        201,
        true,
        "OTP sent successfully. Please verify your email.",
        {
          authToken,
          userData: sanitizedCompany,
          requiresOTP: true,
          otpExpiresAt: existingCompany.account.otp.expiresAt,
          otpExpiresIn: OTP_EXPIRY_TIME,
        },
      );
    }

    // Create new company
    const otpCode = generateOTP(6);

    // Generate unique slug
    const uniqueSlug = await generateUniqueSlug(name);

    const newCompany = new Company({
      account: {
        name,
        email,
        password: encryptedPassword, // Store encrypted password
        otp: {
          otpCode: otpCode,
          expiresAt: Date.now() + OTP_EXPIRY_TIME,
        },
        isVerified: false,
      },
      profile: {
        slug: uniqueSlug
      }
    });

    await newCompany.save();

    // Send OTP email
    try {
      await sendOtpEmailToCompany(email, otpCode);
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      // Still return success because company is created
    }

    // Generate token
    const sanitizedCompany = cleanCompanyObject(newCompany);
    const authToken = generateToken(sanitizedCompany);

    return sendResponse(
      res,
      201,
      true,
      "OTP sent successfully. Please verify your email.",
      {
        authToken,
        userData: sanitizedCompany,
        requiresOTP: true,
        otpExpiresAt: newCompany.account.otp.expiresAt,
        otpExpiresIn: OTP_EXPIRY_TIME,
      },
    );
  } catch (error) {
    console.error("Error in signupCompany:", error);
    return sendResponse(
      res,
      500,
      false,
      "Something went wrong. Try again later.",
      null,
      error,
    );
  }
};

const verifyCompanyOTP = async (req, res) => {
  try {
    const companyData = req.user;

    if (!companyData || !companyData.account) {
      return sendResponse(res, 401, false, "Unauthorized access.");
    }

    const company = await Company.findOne({ "account.email": companyData.account.email });

    if (!company) {
      return sendResponse(res, 404, false, "Company not found.");
    }

    const { otp } = req.body;

    if (!otp) {
      return sendResponse(res, 400, false, "OTP is required.");
    }

    // Check if OTP matches and is not expired
    if (!company.account.otp || company.account.otp.otpCode !== otp) {
      console.log(company.account.otp)
      return sendResponse(res, 400, false, "Invalid OTP.");
    }

    if (Date.now() > company.account.otp.expiresAt) {
      return sendResponse(res, 400, false, "OTP has expired.");
    }

    // Mark the company as verified and clear OTP
    company.account.isVerified = true;
    company.account.otp = null;
    company.account.lastLogin = new Date();
    await company.save();

    const sanitizedCompany = cleanCompanyObject(company);
    const authToken = generateToken(sanitizedCompany);

    return sendResponse(res, 200, true, "Company verified successfully.", {
      authToken,
      userData: sanitizedCompany,
    });
  } catch (error) {
    console.error("Error in verifyCompanyOTP:", error);
    return sendResponse(res, 500, false, "Internal server error.", null, error);
  }
};

const resendCompanyOTP = async (req, res) => {
  try {
    const companyData = req.user;

    if (!companyData || !companyData.account) {
      return sendResponse(res, 401, false, "Unauthorized access.");
    }

    const company = await Company.findOne({ "account.email": companyData.account.email });

    if (!company) {
      return sendResponse(res, 404, false, "Company not found.");
    }

    if (company.account.isVerified) {
      return sendResponse(res, 400, false, "Company is already verified.");
    }

    const otpData = await generateAndSendOTP(company);
    const sanitizedCompany = cleanCompanyObject(company);
    const authToken = generateToken(sanitizedCompany);

    return sendResponse(res, 200, true, "OTP resent successfully.", {
      authToken,
      userData: sanitizedCompany,
      otpExpiresAt: otpData.expiresAt,
      otpRemainingTime: otpData.remainingTime,
      otpExpiresIn: OTP_EXPIRY_TIME,
    });
  } catch (error) {
    console.error("Error in resendCompanyOTP:", error);
    return sendResponse(res, 500, false, "Internal server error.", null, error);
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ "account.isVerified": true }).select("-account.password -account.otp");

    return sendResponse(res, 200, true, "Companies fetched successfully.", companies);
  } catch (error) {
    console.error("Error in getAllCompanies:", error);
    return sendResponse(res, 500, false, "Internal server error.", null, error);
  }
};

const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id).select("-account.password -account.otp");

    if (!company) {
      return sendResponse(res, 404, false, "Company not found.");
    }

    return sendResponse(res, 200, true, "Company details fetched successfully.", company);
  } catch (error) {
    console.error("Error in getCompanyById:", error);
    return sendResponse(res, 500, false, "Internal server error.", null, error);
  }
};


const generateSSOToken = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.account) {
      return sendResponse(res, 401, false, "Unauthorized access.");
    }

    // Generate a short-lived token (1 minute) for SSO
    // We include a specific type to distinguish it from regular login tokens if needed,
    // though the 1m expiry is the main differentiator.
    const ssoPayload = {
      _id: user._id,
      sso: true,
    };

    const ssoToken = generateToken(ssoPayload, "1m");

    return sendResponse(res, 200, true, "SSO Token generated", { token: ssoToken });
  } catch (error) {
    console.error("Error generating SSO token:", error);
    return sendResponse(res, 500, false, "Internal Server Error", null, error);
  }
};

const loginBySSOToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return sendResponse(res, 400, false, "Token is required");
    }

    // Verify the token
    const { decodeToken } = require("../../utils/jwtUtils"); // Lazy load to ensure we get the function
    let decoded;
    try {
      decoded = decodeToken(token);
    } catch (err) {
      return sendResponse(res, 401, false, "Invalid or expired SSO token");
    }

    if (!decoded.sso) {
      return sendResponse(res, 401, false, "Invalid token type");
    }

    const companyId = decoded._id;
    const company = await Company.findById(companyId);

    if (!company) {
      return sendResponse(res, 404, false, "Company not found");
    }

    // Log the user in (generate standard long-lived token)
    company.account.lastLogin = new Date();
    await company.save();

    const sanitizedCompany = cleanCompanyObject(company);
    const authToken = generateToken(sanitizedCompany); // Default 30d

    return sendResponse(res, 200, true, "Login Successful", {
      authToken,
      userData: sanitizedCompany,
    });

  } catch (error) {
    console.error("Error logging in with SSO token:", error);
    return sendResponse(res, 500, false, "Internal Server Error", null, error);
  }
};

const getCompanyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const company = await Company.findOne({ "profile.slug": slug }).select("account.name profile");

    if (!company) {
      return sendResponse(res, 404, false, "Company not found.");
    }

    return sendResponse(res, 200, true, "Company details fetched successfully.", company);
  } catch (error) {
    console.error("Error in getCompanyBySlug:", error);
    return sendResponse(res, 500, false, "Internal server error.", null, error);
  }
};

module.exports = {
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
};


