const mongoose = require("mongoose");
const { Course, CONTENT_TYPES } = require("./course.model");
const OrderAdjuster = require("./utils/course.orderAdjuster.js");
const Student = require("../userAuth/Learner.js");



const getCourseNames = async (req, res) => {
  try {
    // Determine the company ID safely
    const companyId = req.company?._id || req.user?.companyId;

    if (!companyId) {
      // If no company context, maybe return empty or handle super admin?
      // For now, let's assume this is strictly for company admins.
      // If it was super admin, they might want all courses?
      // Let's stick to the requirement: Global + Company
    }

    const courses = await Course.find({
      $or: [
        { company: companyId },
        { isGlobal: true }
      ]
    }).select("courseName _id");

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: {
        courses: courses
      },
    });
  } catch (error) {
    console.error("Error fetching course names:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course names",
      error: error.message,
    });
  }
};

const getAllCoursesComplete = async (req, res) => {
  try {
    // Fetch all courses with all fields including virtuals
    const courses = await Course.find({ company: req.company._id });
    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Error fetching all courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Public
 */
const createCourse = async (req, res) => {
  try {
    const { courseName, description, coverArt, isVisible = true, isGlobal = false } = req.body;

    // Validate required fields
    if (!courseName || !description) {
      return res.status(400).json({
        success: false,
        message: "Course name and description are required",
      });
    }

    // Determine owner: Company or Super Admin (Global)
    let companyId = null;
    let isGlobalCourse = false;

    if (req.company) {
      companyId = req.company._id;
      // Company cannot create global courses
      isGlobalCourse = false;
    } else if (req.superAdmin) {
      // Super Admin creating a global course
      companyId = null;
      isGlobalCourse = true;
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to create course",
      });
    }

    // Use the determined isGlobalCourse flag
    // If user sent isGlobal in body, ignore it for Company, force true for Super Admin
    // actually user requirement implies Super Admin ALWAYS creates Global courses here?
    // "super admin panel pr sirf global courses hi sow hon gi"
    // Let's rely on logic above.

    const course = new Course({
      courseName,
      description,
      coverArt: coverArt || null,
      isVisible,
      isVisible,
      isGlobal: isGlobalCourse,
      company: companyId,
      topics: [],
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error.message,
    });
  }
};

/**
 * @desc    Update a course
 * @route   PUT /api/courses/:courseId
 * @access  Public
 */
const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { courseName, description, coverArt, isVisible } = req.body;

    const course = await Course.findOne({ _id: courseId, company: req.company._id });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Update fields
    if (courseName !== undefined) course.courseName = courseName;
    if (description !== undefined) course.description = description;
    if (coverArt !== undefined) course.coverArt = coverArt;
    if (isVisible !== undefined) course.isVisible = isVisible;

    await course.save();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating course",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all courses
 * @route   GET /api/courses
 * @access  Public
 */
const getAllCourses = async (req, res) => {
  try {
    const query = {
      $or: [
        { isGlobal: true }
      ]
    };

    if (req.company) {
      query.$or.push({ company: req.company._id });
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single course with all details
 * @route   GET /api/courses/:courseId
 * @access  Public
 */
const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const query = { _id: courseId };

    // If not super admin (no company check implies super admin potentially, but safer to check specifically if needed)
    // For now, if req.company exists, restrict. If not, assume super admin or public?
    // Actually, this endpoint is public/protected. 
    // Let's check permissions based on ownership or globality.

    let course;
    if (req.company) {
      course = await Course.findOne({
        _id: courseId,
        $or: [{ company: req.company._id }, { isGlobal: true }]
      });
    } else if (req.superAdmin) {
      // Super Admin: Sees Global Only
      course = await Course.findOne({
        _id: courseId,
        isGlobal: true
      });
    } else {
      // Public / Other
      // Fallback or explicit public access logic if needed
      // For now restricting to authenticated or keep public?
      // Public API usually doesn't have req.company or req.superAdmin
      // If public, we might show valid courses.
      // But preserving existing behavior:
      course = await Course.findById(courseId);
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching course",
      error: error.message,
    });
  }
};

// for admin and super admin
const getAllCoursesSummaries = async (req, res) => {
  try {
    let query = {};

    if (req.company) {
      // Company Admin: Sees Own Courses + Global Courses
      query = {
        $or: [
          { company: req.company._id },
          { isGlobal: true }
        ]
      };
    } else if (req.superAdmin) {
      // Super Admin: Sees ONLY Global Courses
      // User requirement: "super admin panel pr sirf global courses hi show hon ge"
      query = { isGlobal: true };
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const courses = await Course.find(
      query,
      { topics: 0 } // 🚀 exclude topics completely
    ).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching course summaries",
      error: error.message,
    });
  }
};

// for learner
const getEnrolledCourseSummaries = async (req, res) => {
  try {
    const { learnerId } = req.params;

    // Validate learner ID
    if (!mongoose.Types.ObjectId.isValid(learnerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid learner ID",
      });
    }

    // Get learner info for response
    const learner = await Student.findById(learnerId).select("name email courses");

    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner not found",
      });
    }

    // Find courses where learner is enrolled based on their courses array
    const courses = await Course.find(
      {
        _id: { $in: learner.courses },
        isVisible: true
      }, // Use IDs from learner document
      {
        topics: 0, // 🚀 exclude topics completely
        learners: 0, // Also exclude learners array
      }
    ).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: courses.length,
      learner: {
        _id: learnerId,
        name: learner.name,
        email: learner.email,
      },
      courses,
    });
  } catch (error) {
    console.error("Error fetching enrolled course summaries:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching enrolled course summaries",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single course summary (without topics)
 * @route   GET /api/courses/:courseId/summary
 * @access  Public
 */
const getCourseSummaryById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne(
      { _id: courseId, company: req.company._id },
      { topics: 0 } // 🚀 exclude topics
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching course summary",
      error: error.message,
    });
  }
};

// for admin  pamnel
const getCourseAndTopicsSummary = async (req, res) => {
  try {
    const { courseId } = req.params;

    let course;
    if (req.company) {
      course = await Course.findOne({
        _id: courseId,
        $or: [{ company: req.company._id }, { isGlobal: true }]
      })
        .select(
          "courseName description coverArt isVisible createdAt updatedAt topics.topicName topics.order topics._id isGlobal company"
        )
        .lean();
    } else if (req.superAdmin) {
      // Super Admin - Explicit check
      course = await Course.findOne({
        _id: courseId,
        isGlobal: true // Restrict Super Admin to Global courses only? Or allow viewing?
        // "global admin panle kr courses page me wo courses show hon ko super admin panel se create hon."
        // Meaning Super Admin should only see their own Global Courses.
      })
        .select(
          "courseName description coverArt isVisible createdAt updatedAt topics.topicName topics.order topics._id isGlobal company"
        )
        .lean();
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Sort topics by order
    course.topics.sort((a, b) => a.order - b.order);

    res.status(200).json({
      success: true,
      message: "Course and topics summary retrieved successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving course summary",
      error: error.message,
    });
  }
};

// for learner panel
const getCourseAndTopicsSummaryForLearner = async (req, res) => {
  try {
    const { courseId, learnerId } = req.params;
    console.log(courseId, "     ", learnerId);

    // Validate that learnerId is provided
    if (!learnerId) {
      return res.status(400).json({
        success: false,
        message: "Learner ID is required",
      });
    }

    // Validate course ID
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    // Validate learner ID
    if (!mongoose.Types.ObjectId.isValid(learnerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid learner ID",
      });
    }

    // Find the course with basic information (removed learners select)
    const course = await Course.findById(courseId)
      .select(
        "courseName description coverArt isVisible createdAt updatedAt topics.topicName topics.order topics._id"
      )
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Get learner info and checking enrollment
    const learner = await Student.findById(learnerId).select("name email courses");

    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner not found",
      });
    }

    // Check if learner is enrolled in this course by checking user's courses array
    const isEnrolled = learner.courses && learner.courses.some(
      (id) => id.toString() === courseId
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Learner is not enrolled in this course",
      });
    }

    course.learnerInfo = {
      _id: learnerId,
      name: learner?.name || "Unknown",
      email: learner?.email || "Unknown",
    };



    // Sort topics by order
    course.topics.sort((a, b) => a.order - b.order);

    // Add virtual fields if needed
    course.topicCount = course.topics.length;

    res.status(200).json({
      success: true,
      message: "Course and topics summary retrieved successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error retrieving course summary:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving course summary",
      error: error.message,
    });
  }
};

// Reorder topics (drag and drop functionality)
const reorderTopics = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { topics } = req.body; // Array of { topicId, order }

    if (!Array.isArray(topics)) {
      return res.status(400).json({
        success: false,
        message: "Topics array is required",
      });
    }

    let query = { _id: courseId };
    if (req.company) {
      query.company = req.company._id;
    } else if (req.superAdmin) {
      query.isGlobal = true;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const course = await Course.findOne(query);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Validate all topic IDs
    const topicIds = course.topics.map((t) => t._id.toString());
    const validTopics = topics.filter((t) => topicIds.includes(t.topicId));

    if (validTopics.length !== topics.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid topic IDs provided",
      });
    }

    // Update topic orders
    validTopics.forEach(({ topicId, order }) => {
      const topic = course.topics.id(topicId);
      if (topic) {
        topic.order = order;
      }
    });

    // Sort topics by order
    course.topics.sort((a, b) => a.order - b.order);

    // Validate order continuity
    for (let i = 0; i < course.topics.length; i++) {
      course.topics[i].order = i + 1;
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Topics reordered successfully",
      data: course.topics.map((topic) => ({
        _id: topic._id,
        topicName: topic.topicName,
        order: topic.order,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error reordering topics",
      error: error.message,
    });
  }
};

// Update addTopic function to add topic at the end
const addTopic = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { topicName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    if (!topicName || typeof topicName !== "string" || !topicName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Valid topic name is required",
      });
    }

    let query = { _id: courseId };
    if (req.company) {
      query.company = req.company._id;
    } else if (req.superAdmin) {
      query.isGlobal = true;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const course = await Course.findOne(query);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Prevent duplicate topic names
    const exists = course.topics.some(
      (t) => t.topicName.toLowerCase() === topicName.trim().toLowerCase()
    );

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Topic with this name already exists",
      });
    }

    const newTopic = {
      topicName: topicName.trim(),
      order: course.topics.length + 1,
      content: { data: [] },
    };

    course.topics.push(newTopic);
    await course.save();

    const savedTopic = course.topics[course.topics.length - 1];

    return res.status(201).json({
      success: true,
      message: "Topic added successfully",
      data: savedTopic,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add topic",
      error: error.message,
    });
  }
};

/**
 * @desc    Edit topic name
 * @route   PUT /api/courses/:courseId/edit-topic-name/:topicId
 * @access  Private
 */
const editTopicName = async (req, res) => {
  try {
    const { courseId, topicId } = req.params;
    const { topicName } = req.body;

    // Validate input
    if (!topicName || topicName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Topic name is required",
      });
    }

    if (topicName.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: "Topic name must be less than 200 characters",
      });
    }

    // Find the course
    let query = { _id: courseId };
    if (req.company) {
      query.company = req.company._id;
    } else if (req.superAdmin) {
      query.isGlobal = true;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const course = await Course.findOne(query);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Find the topic within the course
    const topic = course.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    // Update topic name
    topic.topicName = topicName.trim();

    // Save the course
    await course.save();

    res.status(200).json({
      success: true,
      message: "Topic name updated successfully",
      data: {
        topic: {
          _id: topic._id,
          topicName: topic.topicName,
          order: topic.order,
        },
      },
    });
  } catch (error) {
    console.error("Error editing topic name:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * @desc    Update a topic
 * @route   PUT /api/courses/:courseId/topics/:topicId
 * @access  Public
 */
const updateTopic = async (req, res) => {
  try {
    const { courseId, topicId } = req.params;
    const { topicName, order } = req.body;

    let query = { _id: courseId };
    if (req.company) {
      query.company = req.company._id;
    } else if (req.superAdmin) {
      query.isGlobal = true;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const course = await Course.findOne(query);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const topic = course.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    // Update topic name if provided
    if (topicName !== undefined) topic.topicName = topicName;

    // Update order if provided and changed
    if (order !== undefined && order !== topic.order) {
      const oldOrder = topic.order;
      const newOrder = order;

      // Adjust other topics' orders
      course.topics = OrderAdjuster.adjustOrderAfterMove(
        course.topics,
        oldOrder,
        newOrder
      );

      // Find and update the moved topic's order
      const movedTopic = course.topics.find(
        (t) => t._id.toString() === topicId
      );
      if (movedTopic) {
        movedTopic.order = newOrder;
      }
    }

    // Sort topics by order
    course.topics.sort((a, b) => a.order - b.order);

    await course.save();

    res.json({
      success: true,
      message: "Topic updated successfully",
      data: course.topics.id(topicId),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating topic",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a topic
 * @route   DELETE /api/courses/:courseId/topics/:topicId
 * @access  Public
 */
const deleteTopic = async (req, res) => {
  try {
    const { courseId, topicId } = req.params;

    let query = { _id: courseId };
    if (req.company) {
      query.company = req.company._id;
    } else if (req.superAdmin) {
      query.isGlobal = true;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const course = await Course.findOne(query);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const topic = course.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    const deletedOrder = topic.order;

    // Remove the topic
    topic.deleteOne();

    // Adjust orders of remaining topics
    course.topics = OrderAdjuster.adjustOrderAfterInsert(
      course.topics,
      deletedOrder,
      true
    );

    // Fix sequence if needed
    if (!OrderAdjuster.validateSequentialOrder(course.topics)) {
      course.topics = OrderAdjuster.fixOrderSequence(course.topics);
    }

    await course.save();

    res.json({
      success: true,
      message: "Topic deleted successfully",
      data: { topicId, deletedOrder },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting topic",
      error: error.message,
    });
  }
};

/**
 * Unified content creation controller
 * Handles all content types with proper order insertion
 */
const createContent = async (req, res) => {
  try {
    const { courseId, topicId } = req.params;
    const { type, order: insertOrder, data } = req.body;

    // Validate required fields
    if (!type || !insertOrder || !data) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: type, order, data",
      });
    }

    // Find the course
    let query = { _id: courseId };
    if (req.company) {
      query.company = req.company._id;
    } else if (req.superAdmin) {
      query.isGlobal = true;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const course = await Course.findOne(query);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Find the topic
    const topic = course.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    // Validate content type
    const validTypes = [
      "TEXT",
      "IMAGE",
      "VIDEO",
      "AUDIO",
      "LINK",
      "FILE",
      "DOCS",
      "EMBED",
      "DISCUSSION",
      "QNA",
      "MCQ",
      "UPLOAD",
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid content type. Must be one of: ${validTypes.join(
          ", "
        )}`,
      });
    }

    // Get current content array
    const contentArray = topic.content.data || [];

    // If inserting at position larger than current length + 1, adjust
    const adjustedInsertOrder = Math.min(insertOrder, contentArray.length + 1);

    // Create new content object
    const newContent = {
      _id: new mongoose.Types.ObjectId(),
      type,
      order: adjustedInsertOrder,
      data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Shift orders of existing content to make space
    contentArray.forEach((content) => {
      if (content.order >= adjustedInsertOrder) {
        content.order += 1;
      }
    });

    // Insert the new content at the correct position
    contentArray.push(newContent);

    // Sort by order
    contentArray.sort((a, b) => a.order - b.order);

    // Reindex orders to ensure they're sequential
    contentArray.forEach((content, index) => {
      content.order = index + 1;
    });

    // Save the course
    await course.save();

    // Return success response only (no data to reduce payload)
    return res.status(201).json({
      success: true,
      message: "Content added successfully",
    });
  } catch (error) {
    console.error("Error creating content:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create content",
      error: error.message,
    });
  }
};

/**
 * Alternative optimized version using MongoDB arrayFilters
 */
exports.createContentOptimized = async (req, res) => {
  try {
    const { courseId, topicId } = req.params;
    const { type, order: insertOrder, data } = req.body;

    // Validate required fields
    if (!type || !insertOrder || !data) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: type, order, data",
      });
    }

    // Find the course and topic first to validate
    let query = { _id: courseId };
    if (req.company) {
      query.company = req.company._id;
    } else if (req.superAdmin) {
      query.isGlobal = true;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const course = await Course.findOne(query);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const topic = course.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    // Get current max order
    const contentArray = topic.content.data || [];
    const maxOrder = contentArray.length;
    const adjustedInsertOrder = Math.min(insertOrder, maxOrder + 1);

    // Prepare new content
    const newContent = {
      _id: new mongoose.Types.ObjectId(),
      type,
      order: adjustedInsertOrder,
      data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Single atomic operation
    const result = await Course.findOneAndUpdate(
      {
        _id: courseId,
        "topics._id": topicId,
      },
      [
        {
          $set: {
            "topics.$[topic].content.data": {
              $concatArrays: [
                {
                  $map: {
                    input: {
                      $filter: {
                        input: {
                          $ifNull: ["$topics.$[topic].content.data", []],
                        },
                        as: "content",
                        cond: { $lt: ["$$content.order", adjustedInsertOrder] },
                      },
                    },
                    as: "content",
                    in: "$$content",
                  },
                },
                [newContent],
                {
                  $map: {
                    input: {
                      $filter: {
                        input: {
                          $ifNull: ["$topics.$[topic].content.data", []],
                        },
                        as: "content",
                        cond: {
                          $gte: ["$$content.order", adjustedInsertOrder],
                        },
                      },
                    },
                    as: "content",
                    in: {
                      $mergeObjects: [
                        "$$content",
                        { order: { $add: ["$$content.order", 1] } },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
      {
        arrayFilters: [{ "topic._id": topicId }],
        new: true,
        runValidators: true,
      }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Course or topic not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Content added successfully",
    });
  } catch (error) {
    console.error("Error creating content:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create content",
      error: error.message,
    });
  }
};

/**
 * Simple version for basic content addition
 */
exports.createContentSimple = async (req, res) => {
  try {
    const { courseId, topicId } = req.params;
    const { type, order, data } = req.body;

    // Validate
    if (!type || !order || !data) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Add content using $push and $inc for order adjustment
    let filter = {
      _id: courseId,
      "topics._id": topicId,
    };
    if (req.company) {
      filter.company = req.company._id;
    } else if (req.superAdmin) {
      filter.isGlobal = true;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = await Course.findOneAndUpdate(
      filter,
      {
        $push: {
          "topics.$[topic].content.data": {
            _id: new mongoose.Types.ObjectId(),
            type,
            order,
            data,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        $inc: {
          "topics.$[topic].content.data.$[content].order": 1,
        },
      },
      {
        arrayFilters: [
          { "topic._id": topicId },
          { "content.order": { $gte: order } },
        ],
        new: true,
      }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Course or topic not found",
      });
    }

    // Sort the content array by order
    await Course.findOneAndUpdate(
      { _id: courseId, company: req.company._id },
      {
        $set: {
          "topics.$[topic].content.data": {
            $sortArray: {
              input: "$topics.$[topic].content.data",
              sortBy: { order: 1 },
            },
          },
        },
      },
      {
        arrayFilters: [{ "topic._id": topicId }],
      }
    );

    return res.status(201).json({
      success: true,
      message: "Content added successfully",
    });
  } catch (error) {
    console.error("Error creating content:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create content",
      error: error.message,
    });
  }
};

/**
 * @desc    Update content in a topic
 * @route   PUT /api/courses/:courseId/topics/:topicId/content/:contentId
 * @access  Public
 */
const updateContent = async (req, res) => {
  try {
    const { courseId, topicId, contentId } = req.params;
    const { type, order, data } = req.body;

    let query = { _id: courseId };
    if (req.company) {
      query.company = req.company._id;
    } else if (req.superAdmin) {
      query.isGlobal = true;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const course = await Course.findOne(query);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const topic = course.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    const content = topic.content.data.id(contentId);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // Update content type if provided and valid
    if (type !== undefined) {
      if (!CONTENT_TYPES.includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid content type",
          validTypes: CONTENT_TYPES,
        });
      }
      content.type = type;
    }

    // Update content data if provided
    if (data !== undefined) content.data = data;

    // Update order if provided and changed
    if (order !== undefined && order !== content.order) {
      const oldOrder = content.order;
      const newOrder = order;

      // Adjust other content orders
      topic.content.data = OrderAdjuster.adjustOrderAfterMove(
        topic.content.data,
        oldOrder,
        newOrder
      );

      // Find and update the moved content's order
      const movedContent = topic.content.data.find(
        (c) => c._id.toString() === contentId
      );
      if (movedContent) {
        movedContent.order = newOrder;
      }
    }

    // Sort content by order
    topic.content.data.sort((a, b) => a.order - b.order);

    await course.save();

    res.json({
      success: true,
      message: "Content updated successfully",
      data: topic.content.data.id(contentId),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating content",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete content from a topic
 * @route   DELETE /api/courses/:courseId/topics/:topicId/content/:contentId
 * @access  Public
 */
const deleteContent = async (req, res) => {
  try {
    const { courseId, topicId, contentId } = req.params;

    let query = { _id: courseId };
    if (req.company) {
      query.company = req.company._id;
    } else if (req.superAdmin) {
      query.isGlobal = true;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const course = await Course.findOne(query);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const topic = course.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    const content = topic.content.data.id(contentId);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    const deletedOrder = content.order;

    // Remove the content
    content.deleteOne();

    // Adjust orders of remaining content
    topic.content.data = OrderAdjuster.adjustOrderAfterInsert(
      topic.content.data,
      deletedOrder,
      true
    );

    // Fix sequence if needed
    if (!OrderAdjuster.validateSequentialOrder(topic.content.data)) {
      topic.content.data = OrderAdjuster.fixOrderSequence(topic.content.data);
    }

    await course.save();

    res.json({
      success: true,
      message: "Content deleted successfully",
      data: { contentId, deletedOrder },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting content",
      error: error.message,
    });
  }
};

/**
 * @desc    Reorder content in a topic
 * @route   PUT /api/courses/:courseId/topics/:topicId/reorder-content
 * @access  Public
 */
const reorderContent = async (req, res) => {
  try {
    const { courseId, topicId } = req.params;
    const { contentIds } = req.body; // Array of content IDs in new order

    if (!contentIds || !Array.isArray(contentIds)) {
      return res.status(400).json({
        success: false,
        message: "contentIds array is required",
      });
    }

    let query = { _id: courseId };
    if (req.company) {
      query.company = req.company._id;
    } else if (req.superAdmin) {
      query.isGlobal = true;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const course = await Course.findOne(query);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const topic = course.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    // Validate all content IDs exist
    const validContentIds = topic.content.data.map((content) =>
      content._id.toString()
    );
    const invalidContentIds = contentIds.filter(
      (id) => !validContentIds.includes(id)
    );

    if (invalidContentIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid content IDs found",
        invalidContentIds,
      });
    }

    // Update content orders based on new order
    contentIds.forEach((contentId, index) => {
      const content = topic.content.data.id(contentId);
      if (content) {
        content.order = index + 1;
      }
    });

    // Sort content by order
    topic.content.data.sort((a, b) => a.order - b.order);

    await course.save();

    res.json({
      success: true,
      message: "Content reordered successfully",
      data: topic.content.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error reordering content",
      error: error.message,
    });
  }
};

// Add this to your course.controller.js
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    let query = { _id: courseId };

    if (req.company) {
      // Company can only delete their OWN courses (not global)
      query.company = req.company._id;
    } else if (req.superAdmin) {
      // Super Admin can only delete GLOBAL courses
      query.isGlobal = true;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const course = await Course.findOne(query);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or unauthorized to delete",
      });
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
};

// for admin
const getTopicById = async (req, res) => {
  try {
    const { courseId, topicId } = req.params;

    // Find course and extract only the specific topic
    let query = {
      _id: courseId,
      "topics._id": topicId,
    };
    if (req.company) {
      query.company = req.company._id;
    } else if (req.superAdmin) {
      query.isGlobal = true;
    } else {
      // Allow if explicit override or different logic needed?
      // Assuming public/learner endpoint should be handled by allowAuth if protected?
      // "getTopicById" is labeled "// for admin" so assume protected.
      // But let's check current usage. Route says allowAuth.
      // Keep strict for now as it replaces company check.
    }

    // Since we returned above if unauthorized, extend query or handle 403.
    // Wait, let's keep it clean.

    let matchQuery = { _id: courseId, "topics._id": topicId };
    if (req.company) matchQuery.company = req.company._id;
    else if (req.superAdmin) matchQuery.isGlobal = true;
    else return res.status(403).json({ message: "Unauthorized" });

    const course = await Course.findOne(
      matchQuery,
      {
        courseName: 1,
        description: 1,
        coverArt: 1,
        isVisible: 1,
        createdAt: 1,
        "topics.$": 1, // $ operator returns only the matching topic
      }
    ).lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    // Extract the topic
    const topic = course.topics[0];

    // Sort content by order
    if (topic.content && topic.content.data) {
      topic.content.data.sort((a, b) => a.order - b.order);
    }

    // Prepare response
    const responseData = {
      course: {
        _id: course._id,
        courseName: course.courseName,
        description: course.description,
        coverArt: course.coverArt,
        isVisible: course.isVisible,
        createdAt: course.createdAt,
      },
      topic: {
        _id: topic._id,
        topicName: topic.topicName,
        order: topic.order,
        content: topic.content,
        createdAt: topic.createdAt,
        updatedAt: topic.updatedAt,
      },
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching topic:", error);
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// for learner
const getTopicByIdForLearner = async (req, res) => {
  try {
    const { courseId, topicId, learnerId } = req.params;

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(topicId) ||
      !mongoose.Types.ObjectId.isValid(learnerId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID(s) provided",
      });
    }

    // 1. Fetch learner to check enrollment
    const learner = await Student.findById(learnerId).select("name email courses");

    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner not found",
      });
    }

    // 2. Check enrollment in learner's course list
    const isEnrolled = learner.courses && learner.courses.some(
      (id) => id.toString() === courseId
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Learner is not enrolled in this course",
      });
    }

    // 3. Fetch Course and Topic (without checking learners array in course)
    const course = await Course.findOne(
      {
        _id: courseId,
        "topics._id": topicId
      },
      {
        courseName: 1,
        description: 1,
        coverArt: 1,
        isVisible: 1,
        createdAt: 1,
        "topics.$": 1, // Select only the matched topic
      }
    ).lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    const topic = course.topics[0];

    // Sort content by order
    if (topic.content && topic.content.data) {
      topic.content.data.sort((a, b) => a.order - b.order);
    }

    res.status(200).json({
      success: true,
      data: {
        course: {
          _id: course._id,
          courseName: course.courseName,
          description: course.description,
          coverArt: course.coverArt,
          isVisible: course.isVisible,
          createdAt: course.createdAt,
        },
        topic: {
          _id: topic._id,
          topicName: topic.topicName,
          order: topic.order,
          content: topic.content,
          createdAt: topic.createdAt,
          updatedAt: topic.updatedAt,
        },
        learnerInfo: {
          _id: learnerId,
          name: learner.name,
          email: learner.email,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching topic for learner:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving topic",
      error: error.message,
    });
  }
};

/**
 * Update text content (for real-time saving)
 */
const updateTextContent = async (req, res) => {
  try {
    const { courseId, topicId, contentId } = req.params;
    const { content, textName } = req.body;

    // Validate required fields
    if (content === undefined) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
        showMessage: false,
      });
    }

    // Find course
    // Find course
    let query = { _id: courseId };
    if (req.company) {
      query.company = req.company._id;
    } else if (req.superAdmin) {
      query.isGlobal = true;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const course = await Course.findOne(query);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
        showMessage: true,
      });
    }

    // Find topic
    const topic = course.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
        showMessage: true,
      });
    }

    // Find content
    const contentItem = topic.content.data.id(contentId);
    if (!contentItem) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
        showMessage: true,
      });
    }

    // Verify it's TEXT type
    if (contentItem.type !== "TEXT") {
      return res.status(400).json({
        success: false,
        message: "Content type mismatch",
        showMessage: true,
      });
    }

    // Update content - ensure proper structure
    contentItem.data = {
      ...contentItem.data,
      content: content,
      textName: textName || contentItem.data.textName || "Text Content",
    };

    // Update updatedAt timestamp
    contentItem.updatedAt = Date.now();

    // Save the course
    await course.save();

    res.json({
      success: true,
      message: "Content updated successfully",
      showMessage: false,
      data: {
        content: contentItem.data.content,
        textName: contentItem.data.textName,
        updatedAt: contentItem.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating text content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update content",
      showMessage: true,
    });
  }
};



/**
 * Get all courses for a specific learner
 * @route GET /api/courses/learner/:learnerId
 * @description Fetch all courses that a learner is enrolled in
 * @access Public/Admin
 */
const getLearnerCourses = async (req, res) => {
  try {
    const { learnerId } = req.params;

    // Validate learner ID
    if (!mongoose.Types.ObjectId.isValid(learnerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid learner ID",
      });
    }

    // Find the learner first to get their enrolled courses
    const learner = await Student.findById(learnerId).select("name email courses");

    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner not found",
      });
    }

    // Find all coursesmene where this learner is enrolled using the IDs from learner doc
    const courses = await Course.find({
      _id: { $in: learner.courses },
      isVisible: true,
    }).select("-learners"); // Remove learners field from response

    return res.status(200).json({
      success: true,
      count: courses.length,
      learner: {
        _id: learnerId,
        name: learner?.name || "Unknown",
        email: learner?.email || "Unknown",
      },
      courses,
    });
  } catch (error) {
    console.error("Error fetching learner courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch learner courses",
      error: error.message,
    });
  }
};

const toggleCourseVisibility = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Toggle visibility
    course.isVisible = !course.isVisible;
    await course.save();

    return res.status(200).json({
      success: true,
      message: `Course is now ${course.isVisible ? "Visible" : "Hidden"}`,
      isVisible: course.isVisible,
    });
  } catch (error) {
    console.error("Error toggling course visibility:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle course visibility",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCoursesComplete,
  createCourse,
  updateCourse,
  getAllCourses,
  getCourseById,
  getAllCoursesSummaries,
  getEnrolledCourseSummaries,
  getCourseSummaryById,
  addTopic,
  editTopicName,
  getCourseAndTopicsSummary, // for admin
  getCourseAndTopicsSummaryForLearner,
  updateTopic,
  deleteTopic,
  createContent,
  updateContent,
  deleteContent,
  reorderTopics,
  reorderContent,
  deleteCourse,
  getTopicById,
  getTopicByIdForLearner,
  updateTextContent,
  getLearnerCourses,
  getCourseNames,
  toggleCourseVisibility,
};
