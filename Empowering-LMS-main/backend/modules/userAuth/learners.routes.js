const express = require("express");
const {
  loginWithToken,
  loginUser,
  getOTPStatus,
  handleGetAllUsers,
  handleDeleteUser,
  updateUser,
  getAllUsers,
  getUserStatistics,

  getLearnerById,
  getUserById,
  sendEmailToLearner, // Add this
  createLearner,
} = require("./learners.controller.js");
const { user } = require("./learners.middleware.js");
const { admin } = require("../adminAuth/adminAuth.middleware.js");

const router = express.Router();

// User Signup and Verification
router.get("/login-by-token", user, loginWithToken);
router.post("/login", loginUser);
router.get("/otp-status", user, getOTPStatus);

// User Admin panel APIs 
router.get("/", admin, getAllUsers);
router.get("/statistics", admin, getUserStatistics);
router.get("/all", admin, handleGetAllUsers);
router.delete("/:id", admin, handleDeleteUser);
router.put("/:id", admin, updateUser);
router.get('/:id', admin, getUserById);
router.post('/:id/email', admin, sendEmailToLearner);
router.post('/create', admin, createLearner);

// Profile Management (Learner Self)
const upload = require("../../middleware/uploadMiddleware");
const { updateLearnerProfile, uploadLearnerAvatar, getLearnerProfile } = require("./learners.controller.js");

router.get("/profile/me", user, getLearnerProfile); // Fetch profile details

router.put("/profile/me", user, upload.single("avatar"), updateLearnerProfile); // Update details
router.post("/profile/avatar", user, upload.single("avatar"), uploadLearnerAvatar); // Upload avatar

module.exports = router;