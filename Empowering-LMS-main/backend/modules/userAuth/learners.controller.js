const Student = require("./Learner");
const Company = require("../companyAuth/Company");
const bcrypt = require("bcrypt");
const { generateToken, decodeToken } = require("../../utils/jwtUtils");

const sendEmail = require("../../utils/sendEmail");
const OTP_EXPIRY_TIME = Number(process.env.OTP_EXPIRY_TIME);

// Utility function to clean user object
const cleanUserObject = (user, companySlug) => {
  if (!user) return null;

  let userObject = user.toObject ? user.toObject() : user;
  delete userObject.password;
  delete userObject.otp;

  if (companySlug) {
    userObject.companySlug = companySlug;
  } else if (userObject.company && userObject.company.profile && userObject.company.profile.slug) {
    userObject.companySlug = userObject.company.profile.slug;
  }

  return userObject;
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



// Add a new controller to get OTP status
const getOTPStatus = async (req, res) => {
  try {
    const userData = req.user;

    if (!userData) {
      return sendResponse(res, 401, false, "Unauthorized access.");
    }

    const user = await Student.findOne({ _id: userData._id, company: userData.company });

    if (!user) {
      return sendResponse(res, 404, false, "User not found.");
    }

    // If user is already verified or has no OTP
    if (user.isVerified || !user.otp) {
      return sendResponse(res, 400, false, "No active OTP found.");
    }

    const remainingTime = user.otp.expiresAt - Date.now();

    return sendResponse(res, 200, true, "OTP status fetched successfully.", {
      expiresAt: user.otp.expiresAt,
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
    if (!user) {
      return sendResponse(res, 401, false, "User not logged in.");
    }

    const dbUser = await Student.findOne({ _id: user._id, company: user.company }).populate("company");

    if (dbUser) {
      dbUser.lastVisit = new Date();
      await dbUser.save();

      const companySlug = dbUser.company?.profile?.slug;
      const sanitizedUser = cleanUserObject(dbUser, companySlug);
      const authToken = generateToken(sanitizedUser);

      return sendResponse(res, 200, true, "User logged in successfully.", {
        userData: sanitizedUser,
        authToken,
        companyData: {
          name: dbUser.company?.account?.name,
          profile: dbUser.company?.profile
        }
      });
    }

    return sendResponse(res, 404, false, "User not found.");
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

const loginUser = async (req, res) => {
  try {
    const { email, password, companySlug } = req.body;
    if (!email || !password || !companySlug) {
      return sendResponse(res, 400, false, "Email, password, and Company Slug are required.");
    }

    // Find company by slug
    const company = await Company.findOne({ "profile.slug": companySlug });
    if (!company) {
      return sendResponse(res, 404, false, "Company not found.");
    }

    // 1. Check Manual Access (Institute Level)
    if (company.profile.manualAccessStatus === false) {
      return sendResponse(res, 403, false, "Institute access has been revoked.");
    }

    // 2. Check Subscription Status (Institute Level)
    const now = new Date();
    const expiresAt = company.subscription?.expiresAt ? new Date(company.subscription.expiresAt) : null;

    const isSubscriptionActive =
      company.subscription?.status === 'active' ||
      (expiresAt && expiresAt > now);

    if (!isSubscriptionActive && !company.subscription?.hasUsedTrial) {
      return sendResponse(res, 403, false, "Institute subscription expired.");
    }

    if (['past_due', 'canceled', 'unpaid', 'inactive'].includes(company.subscription?.status)) {
      if (!expiresAt || expiresAt < now) {
        return sendResponse(res, 403, false, "Institute subscription expired.");
      }
    }

    const user = await Student.findOne({ email, company: company._id });

    if (!user) {
      return sendResponse(res, 404, false, "User not found in this company.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendResponse(res, 400, false, "Invalid password.");
    }

    // If user is not verified, send OTP
    if (!user.isVerified) {
      await generateAndSendOTP(user);

      const sanitizedUser = cleanUserObject(user, company.profile.slug);
      const authToken = generateToken(sanitizedUser);

      return sendResponse(
        res,
        200,
        true,
        "OTP sent to email. Please verify your account.",
        {
          authToken,
          userData: sanitizedUser,
          requiresOTP: true,
          otpExpiresAt: user.otp.expiresAt,
          otpExpiresIn: OTP_EXPIRY_TIME,
        },
      );
    }

    user.lastLogin = new Date();
    await user.save();

    const sanitizedUser = cleanUserObject(user, company.profile.slug);
    const authToken = generateToken(sanitizedUser);

    return sendResponse(res, 200, true, "Login Successful", {
      authToken,
      userData: sanitizedUser,
      companyData: {
        name: company.account.name,
        profile: company.profile
      }
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return sendResponse(res, 500, false, "Internal server error.", null, error);
  }
};



const createLearner = async (req, res) => {
  try {
    const { name, email, password, contactNo, courses, avatar } = req.body;

    if (!name || !email || !password) {
      return sendResponse(res, 400, false, "Name, email and password are required.");
    }

    const existingUser = await Student.findOne({ email, company: req.company._id });
    if (existingUser) {
      return sendResponse(res, 400, false, "Email not available.");
    }

    // Create new user
    // Create new user
    const newUser = new Student({
      name,
      email,
      password, // Will be hashed by pre-save hook
      company: req.company._id,
      isVerified: true, // Auto-verify manually created users
      avatar: avatar || "",
      courses: courses || [], // Save courses directly to learner
      contactNo: contactNo || "N/A",
    });

    await newUser.save();

    // Fetch enrolled course names for email (if any courses are selected)
    let enrolledCoursesNames = [];
    if (courses && Array.isArray(courses) && courses.length > 0) {
      const { Course } = require("../courses/course.model");
      const enrolledCourses = await Course.find({ _id: { $in: courses } }).select("courseName");
      enrolledCoursesNames = enrolledCourses.map(c => c.courseName);
    }

    // Send Welcome Email
    // Fetch Company to get slug
    const company = await Company.findById(req.company._id);
    const learnerSlug = company?.profile?.slug || "login";
    // Fallback to /login if no slug, but ideally we have one. 
    // If slug exists: http://learner-panel-url/slug
    // User requested: company ka learner panel ka link.
    // If we assume the slug handles the "home" of the company learner panel.

    // Check if LEARNER_PANEL_URL is defined, else fallback to something or throw warning
    const baseUrl = process.env.LEARNER_PANEL_URL || "http://localhost:5174";
    const loginUrl = `${baseUrl}/${learnerSlug}`;
    let emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #059669;">Welcome to Empowering LMS!</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your account has been successfully created by the administrator.</p>
        <p>Here are your login credentials:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
        </div>
        
        ${enrolledCoursesNames.length > 0 ? `
        <p>You have been enrolled in the following courses:</p>
        <ul>
            ${enrolledCoursesNames.map(c => `<li>${c}</li>`).join('')}
        </ul>
        ` : ''}

        <p>Please login to your account and start exploring!</p>
        <a href="${loginUrl}" style="display: inline-block; background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Login Now</a>
        
        <p style="margin-top: 30px; font-size: 12px; color: #666;">If you have any questions, please contact support.</p>
      </div>
    `;

    try {
      await sendEmail(email, "Welcome to Empowering LMS - Account Created", emailHtml);
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Don't fail the request if email fails, but maybe warn?
    }

    return sendResponse(res, 201, true, "Learner created successfully.", {
      user: cleanUserObject(newUser, learnerSlug),
      companyData: {
        name: company.account?.name,
        profile: company.profile
      }
    });

  } catch (error) {
    console.error("Error in createLearner:", error);
    return sendResponse(res, 500, false, "Internal server error.", null, error);
  }
};

const verifyUserOTP = async (req, res) => {
  try {
    const userData = req.user;

    if (!userData) {
      return sendResponse(res, 401, false, "Unauthorized access.");
    }

    const user = await Student.findOne({ _id: userData._id, company: userData.company });

    if (!user) {
      return sendResponse(res, 404, false, "User not found.");
    }

    const { otp } = req.body;

    if (!otp) {
      return sendResponse(res, 400, false, "OTP is required.");
    }

    // Check if OTP matches and is not expired
    if (!user.otp || user.otp.otpCode !== otp) {
      return sendResponse(res, 400, false, "Invalid OTP.");
    }

    if (Date.now() > user.otp.expiresAt) {
      return sendResponse(res, 400, false, "OTP has expired.");
    }

    // Mark the user as verified and clear OTP
    user.isVerified = true;
    user.otp = null;
    user.lastLogin = new Date();
    await user.save();

    // Re-fetch company to get slug for token
    const company = await Company.findById(user.company);
    const companySlug = company?.profile?.slug;

    const sanitizedUser = cleanUserObject(user, companySlug);
    const authToken = generateToken(sanitizedUser);

    return sendResponse(res, 200, true, "User verified successfully.", {
      authToken,
      userData: sanitizedUser,
      companyData: {
        name: company?.account?.name,
        profile: company?.profile
      }
    });
  } catch (error) {
    console.error("Error in verifyUserOTP:", error);
    return sendResponse(res, 500, false, "Internal server error.", null, error);
  }
};

const resendUserOTP = async (req, res) => {
  return sendResponse(res, 403, false, "OTP verification is disabled.");
};

// Other controller functions remain similar but with sendResponse
const handleGetAllUsers = async (req, res) => {
  try {
    // Fetch only necessary fields for the modal
    let users = await Student.find({ company: req.company._id })
      .select("name email isVerified contactNo") // Only select needed fields
      .lean(); // Returns plain JavaScript objects

    // Transform the data to match frontend needs
    const formattedUsers = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      contactNo: user.contactNo || "N/A",
    }));

    return sendResponse(res, 200, true, "Users fetched successfully", {
      users: formattedUsers,
    });
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, false, "Error fetching users", null, error);
  }
};

const handleDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, false, "User ID is required");
    }

    const deletedUser = await Student.findOneAndDelete({ _id: id, company: req.company._id });

    if (!deletedUser) {
      return sendResponse(res, 404, false, "User not found");
    }

    return sendResponse(res, 200, true, "User deleted successfully", {
      user: deletedUser,
    });
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, false, "Error deleting user", null, error);
  }
};

// In your users controller
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    // Build search query
    let query = { company: req.company._id };
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Select only required fields for listing
    const selectFields = "name email createdAt avatar"; // Only include fields you show in table

    const [users, totalUsers] = await Promise.all([
      Student.find(query)
        .select(selectFields)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Student.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);
    const hasMore = page < totalPages;

    res.status(200).json({
      success: true,
      data: {
        learners: users,
        pagination: {
          currentPage: page,
          totalPages,
          hasMore,
          totalUsers,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getUserStatistics = async (req, res) => {
  try {
    // Get total count
    const totalUsers = await Student.countDocuments({ company: req.company._id });

    // Get verified count
    const verifiedUsers = await Student.countDocuments({ company: req.company._id, isVerified: true });

    // Get today's registrations
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const todayRegistrations = await Student.countDocuments({
      company: req.company._id,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // Get this week's registrations
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const thisWeekRegistrations = await Student.countDocuments({
      company: req.company._id,
      createdAt: { $gte: startOfWeek },
    });

    // Get users with last login in last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeUsers = await Student.countDocuments({
      company: req.company._id,
      lastLogin: { $gte: last24Hours },
    });

    return sendResponse(res, 200, true, "Statistics fetched successfully", {
      statistics: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers,
        todayRegistrations,
        thisWeekRegistrations,
        activeUsers,
        verifiedPercentage:
          totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return sendResponse(
      res,
      500,
      false,
      "Error fetching statistics",
      null,
      error,
    );
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Learner ID is required",
      });
    }

    const learner = await Student.findOne({ _id: id, company: req.company._id }).select("-password -otp").lean();

    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner not found",
      });
    }

    // Calculate days since registration
    const createdAt = new Date(learner.createdAt);
    const now = new Date();
    const daysSinceRegistration = Math.floor(
      (now - createdAt) / (1000 * 60 * 60 * 24),
    );

    // Format learner data
    const formattedLearner = {
      id: learner._id,
      name: learner.name,
      email: learner.email,
      contactNo: learner.contactNo || "N/A",
      whyJoinUs: learner.other?.whyJoinUs || "Not provided",
      isVerified: learner.isVerified,
      avatar: learner.avatar, // Include avatar
      lastLogin: learner.lastLogin,
      lastVisit: learner.lastVisit,
      createdAt: learner.createdAt,
      updatedAt: learner.updatedAt,
      registrationInfo: {
        date: createdAt.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        daysAgo: daysSinceRegistration,
        time: createdAt.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    };

    res.status(200).json({
      success: true,
      data: {
        learner: formattedLearner,
      },
    });
  } catch (error) {
    console.error("Error fetching learner:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch learner details",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Learner ID is required",
      });
    }

    // Check if the user exists
    const existingUser = await Student.findOne({ _id: id, company: req.company._id });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Learner not found",
      });
    }

    // Handle the update properly - merge other fields
    const updateFields = {
      name: updateData.name,
      email: updateData.email,
      isVerified: updateData.isVerified,
      avatar: updateData.avatar || existingUser.avatar, // Update avatar
    };

    // Handle contactNo directly
    if (updateData.contactNo) {
      updateFields.contactNo = updateData.contactNo;
    } else {
      updateFields.contactNo = existingUser.contactNo;
    }

    const learner = await Student.findOneAndUpdate({ _id: id, company: req.company._id }, updateFields, {
      new: true,
      runValidators: true,
    })
      .select("-password -otp")
      .lean();

    // Format the response to match the frontend expectations
    const formattedLearner = {
      id: learner._id,
      name: learner.name,
      email: learner.email,
      contactNo: learner.contactNo || "N/A",

      isVerified: learner.isVerified,
      avatar: learner.avatar, // Include avatar
      lastLogin: learner.lastLogin,
      lastVisit: learner.lastVisit,
      createdAt: learner.createdAt,
      updatedAt: learner.updatedAt,
      registrationInfo: {
        date: new Date(learner.createdAt).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        daysAgo: Math.floor(
          (new Date() - new Date(learner.createdAt)) / (1000 * 60 * 60 * 24),
        ),
        time: new Date(learner.createdAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    };

    res.status(200).json({
      success: true,
      data: {
        learner: formattedLearner,
        message: "Learner updated successfully",
      },
    });
  } catch (error) {
    console.error("Error updating learner:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update learner",
    });
  }
};

const sendEmailToLearner = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, html } = req.body;

    if (!id) {
      return sendResponse(res, 400, false, "Learner ID is required");
    }
    if (!subject || !html) {
      return sendResponse(res, 400, false, "Subject and message content are required");
    }

    const learner = await Student.findOne({ _id: id, company: req.company._id });
    if (!learner) {
      return sendResponse(res, 404, false, "Learner not found");
    }

    await sendEmail(learner.email, subject, html);

    return sendResponse(res, 200, true, "Email sent successfully");

  } catch (error) {
    console.error("Error sending email:", error);
    return sendResponse(res, 500, false, "Failed to send email", null, error);
  }
};


// ==========================================
// LEARNER PROFILE HANDLERS
// ==========================================
const getLearnerProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return sendResponse(res, 401, false, "Unauthorized");

    const dbUser = await Student.findOne({ _id: user._id, company: user.company }).populate("company");

    if (!dbUser) {
      return sendResponse(res, 404, false, "User not found");
    }

    const companySlug = dbUser.company?.profile?.slug;
    const sanitizedUser = cleanUserObject(dbUser, companySlug);

    return sendResponse(res, 200, true, "Profile fetched successfully", {
      user: sanitizedUser
    });

  } catch (error) {
    console.error("Error fetching profile:", error);
    return sendResponse(res, 500, false, "Failed to fetch profile", null, error);
  }
};

const updateLearnerProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return sendResponse(res, 401, false, "Unauthorized");

    const { name, contactNo } = req.body;

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (contactNo) updateData.contactNo = contactNo;

    // Handle Avatar Upload if file exists
    if (req.file) {
      // Initialize Cloudinary
      const cloudinary = require('cloudinary').v2;
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "learner_avatars",
        width: 300,
        height: 300,
        crop: "fill",
        gravity: "face"
      });

      updateData.avatar = result.secure_url;

      // Clean up local file
      try {
        const fs = require('fs');
        fs.unlinkSync(req.file.path);
      } catch (e) { /* ignore */ }
    }

    const updatedLearner = await Student.findByIdAndUpdate(
      user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -otp");

    return sendResponse(res, 200, true, "Profile updated successfully", {
      user: cleanUserObject(updatedLearner)
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    return sendResponse(res, 500, false, "Failed to update profile", null, error);
  }
};

const uploadLearnerAvatar = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return sendResponse(res, 401, false, "Unauthorized");

    if (!req.file) {
      return sendResponse(res, 400, false, "No image file provided");
    }

    // Initialize Cloudinary
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "learner_avatars",
      width: 300,
      height: 300,
      crop: "fill",
      gravity: "face"
    });

    // Update user avatar URL
    user.avatar = result.secure_url;
    await user.save();

    // Clean up local file
    try {
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
    } catch (e) { /* ignore */ }

    return sendResponse(res, 200, true, "Avatar updated successfully", {
      avatar: user.avatar
    });

  } catch (error) {
    console.error("Error uploading avatar:", error);
    return sendResponse(res, 500, false, "Failed to upload avatar", null, error);
  }
};

module.exports = {
  loginWithToken,
  loginUser,

  handleGetAllUsers,
  handleDeleteUser,
  updateUser,
  getAllUsers,
  getOTPStatus,
  getUserStatistics,
  getUserById,
  sendEmailToLearner,
  createLearner,

  // New exports
  updateLearnerProfile,
  uploadLearnerAvatar,
  getLearnerProfile
};




