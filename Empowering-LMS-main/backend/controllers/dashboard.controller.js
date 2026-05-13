const Student = require("../modules/userAuth/Learner.js");
const { Course } = require("../modules/courses/course.model.js");

exports.getDashboardStats = async (req, res) => {
  try {
    // Ensure company exists (middleware should handle this, but for safety)
    if (!req.company) {
      return res.status(401).json({ success: false, message: "Unauthorized: Company not found" });
    }

    const totalUsers = await Student.countDocuments({ company: req.company._id });
    const totalCourses = await Course.countDocuments({ company: req.company._id });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};
