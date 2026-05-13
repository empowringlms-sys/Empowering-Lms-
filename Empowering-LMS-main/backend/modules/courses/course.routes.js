const express = require("express");
const router = express.Router();
const {
  createCourse,
  updateCourse,
  getAllCourses,
  getCourseById,
  addTopic,
  updateTopic,
  deleteTopic,
  updateContent,
  deleteContent,
  reorderTopics,
  reorderContent,
  getAllCoursesSummaries,
  getCourseSummaryById,
  deleteCourse,
  getCourseAndTopicsSummary,
  editTopicName,
  getTopicById,
  createContent,
  updateTextContent,
  // Add the new controller functions
  getAllCoursesComplete,
  getLearnerCourses,
  getCourseAndTopicsSummaryForLearner,
  getTopicByIdForLearner,
  getEnrolledCourseSummaries,
  getCourseNames, // Add this
  toggleCourseVisibility,
} = require("./course.controller");
const { user } = require("../userAuth/learners.middleware");
const { admin } = require("../adminAuth/adminAuth.middleware");
const { superAdmin } = require("../superAdminAuth/superAdminAuth.middleware");
const { company, attachCompany } = require("../companyAuth/companyAuth.middleware");

// Combined Auth Middleware
const allowAuth = async (req, res, next) => {
  const portal = req.headers['x-portal'];

  // 1. If Explicitly Super Admin Portal
  if (portal === 'super-admin' && req.cookies?.super_admin_token) {
    return superAdmin(req, res, next);
  }

  // 2. If Explicitly Company Portal (Cookie or Header)
  if (portal === 'company') {
    if (req.cookies?.admin_token) return admin(req, res, next);
    if (req.headers?.authorization) {
      await attachCompany(req, res, async () => {
        return company(req, res, next);
      });
      return;
    }
  }

  // 3. Fallback (Legacy/No Header)
  if (req.cookies?.super_admin_token) {
    return superAdmin(req, res, next);
  }

  if (req.cookies?.admin_token) {
    return admin(req, res, next);
  }

  if (req.headers?.authorization) {
    await attachCompany(req, res, async () => {
      return company(req, res, next);
    });
    return;
  }

  return res.status(401).json({ message: "Authentication required" });
};

router.get("/all-complete", getAllCoursesComplete);
router.get("/names", getCourseNames);

// Course routes
router.route("/").post(allowAuth, createCourse).get(getAllCourses);
router.get("/summary", allowAuth, getAllCoursesSummaries); // for admin AND super admin
router.get("/summary/:learnerId", getEnrolledCourseSummaries); // for learner
router.get("/:courseId/summary", getCourseSummaryById);
router.get(
  "/:courseId/course-and-topics-summary",
  allowAuth,
  getCourseAndTopicsSummary
); // for admin AND super admin
router.get(
  "/:courseId/:learnerId/course-and-topics-summary-for-learner",
  getCourseAndTopicsSummaryForLearner
); // for learner

router
  .route("/:courseId")
  .get(getCourseById)
  .put(updateCourse)
  .delete(deleteCourse);

router.patch("/:courseId/toggle-visibility", allowAuth, toggleCourseVisibility);

// Learner management routes
router.get("/learner-courses/:learnerId", getLearnerCourses); // get enrolled courses whole data

// Topic routes
router.route("/:courseId/topics").post(allowAuth, addTopic);
router.put("/:courseId/edit-topic-name/:topicId", allowAuth, editTopicName);
router.route("/:courseId/topics/:topicId").put(allowAuth, updateTopic).delete(allowAuth, deleteTopic);

// Content routes
router
  .route("/:courseId/topics/:topicId/content/:contentId")
  .put(allowAuth, updateContent)
  .delete(allowAuth, deleteContent);

// Reordering routes
router.put("/:courseId/reorder-topics", allowAuth, reorderTopics);
router.put("/:courseId/topics/:topicId/reorder-content", allowAuth, reorderContent);

// topic page data of the admin panel
router.get("/:courseId/topics/:topicId", allowAuth, getTopicById); // for admin AND super admin
router.get("/:courseId/topics/:topicId/:learnerId", getTopicByIdForLearner); // for learner
router.post("/:courseId/topics/:topicId/content", allowAuth, createContent);
router.patch(
  "/:courseId/topics/:topicId/content/:contentId/text",
  allowAuth,
  updateTextContent
);

module.exports = router;
