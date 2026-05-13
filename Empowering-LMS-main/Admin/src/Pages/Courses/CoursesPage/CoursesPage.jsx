// Courses.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaSearch,
  FaTimes,
  FaSpinner,
  FaExclamationCircle,
  FaSort,
} from "react-icons/fa";
import CourseCard from "./CourseCard";
import axiosInstance from "../../../../utils/axiosInstance";

export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [sortOption, setSortOption] = useState("Newest First");


  /* 🔥 LOAD COURSES FROM API */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get("/courses/summary");
        if (response.data.success) {
          const coursesData = response.data.data.map((course) => ({
            _id: course._id,
            courseName: course.courseName || "",
            description: course.description || "",
            coverArt:
              course.coverArt ||
              "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=200&fit=crop",
            author: course.instructor || "Unknown Instructor",
            duration: course.duration || "0h 0m",
            category: course.category || "General",
            level: course.level || "Beginner",
            createdAt: course.createdAt || new Date().toISOString(),
            updatedAt: course.updatedAt || new Date().toISOString(),
            isVisible: course.isVisible !== false,
            isGlobal: course.isGlobal || false,
          }));
          setCourses(coursesData);
          setFilteredCourses(coursesData);
        }
      } catch (err) {
        setError("Failed to load courses. Please try again.");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  /* 🔍 SEARCH FILTER - Fixed error handling */
  useEffect(() => {
    let result = courses;

    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((course) => {
        const courseName = course?.courseName || "";
        const author = course?.author || "";
        const description = course?.description || "";

        return (
          courseName.toLowerCase().includes(searchLower) ||
          author.toLowerCase().includes(searchLower) ||
          description.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply sorting
    result = sortCourses(result, sortOption);

    setFilteredCourses(result);
  }, [searchTerm, courses, sortOption]);

  /* 📊 SORT COURSES - Fixed date handling */
  const sortCourses = (courses, option) => {
    const sorted = [...courses];

    switch (option) {
      case "Newest First":
        return sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        });
      case "Oldest First":
        return sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateA - dateB;
        });
      case "Title A-Z":
        return sorted.sort((a, b) => {
          const courseNameA = a.courseName || "";
          const courseNameB = b.courseName || "";
          return courseNameA.localeCompare(courseNameB);
        });
      case "Title Z-A":
        return sorted.sort((a, b) => {
          const courseNameA = a.courseName || "";
          const courseNameB = b.courseName || "";
          return courseNameB.localeCompare(courseNameA);
        });
      default:
        return sorted;
    }
  };

  /* ✏️ HANDLE EDIT - Navigate to edit page */
  const handleEditCourse = (courseId) => {
    navigate(`edit/${courseId}`);
  };

  /* 🗑 DELETE COURSE */
  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (window.confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
      try {
        await axiosInstance.delete(`/courses/${courseId}`);
        const updatedCourses = courses.filter((c) => c.id !== courseId);
        setCourses(updatedCourses);
      } catch (err) {
        console.error("Error deleting course:", err);
        alert("Failed to delete course. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 p-4 md:p-6 w-full">
      <div className="w-full max-w-400 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Course Management
                </h1>
                <p className="text-gray-600">
                  Manage and organize your learning content
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("create-course")}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <FaPlus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                Create New Course
              </motion.button>
            </div>

            {/* Search and Sort Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {/* Search Input */}
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses by courseName, author, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 bg-white rounded-xl border border-teal-100 focus:border-teal-300 focus:ring-3 focus:ring-teal-50 focus:outline-none transition-all duration-300 shadow-sm hover:border-teal-200 cursor-text text-gray-700"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-teal-300 hover:text-teal-500 cursor-pointer transition-colors duration-200"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full md:w-48 pl-12 pr-4 py-3.5 bg-white rounded-xl border border-teal-100 focus:border-teal-300 focus:ring-3 focus:ring-teal-50 focus:outline-none transition-all duration-300 shadow-sm hover:border-teal-200 cursor-pointer text-gray-700 appearance-none"
                >
                  <option value="Newest First">Newest First</option>
                  <option value="Oldest First">Oldest First</option>
                  <option value="Title A-Z">Title A-Z</option>
                  <option value="Title Z-A">Title Z-A</option>
                </select>
                <FaSort className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold text-teal-600">
                  {filteredCourses.length}
                </span>{" "}
                courses found
                {searchTerm && (
                  <span className="text-gray-500">
                    {" "}
                    for "<span className="font-medium">{searchTerm}</span>"
                  </span>
                )}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium cursor-pointer hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mb-4"
              >
                <FaSpinner className="w-12 h-12 text-teal-500" />
              </motion.div>
              <p className="text-gray-600 text-lg">Loading courses...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 rounded-2xl p-8 text-center mb-8"
            >
              <FaExclamationCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-red-600 mb-2">
                Error Loading Courses
              </h3>
              <p className="text-red-500 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-red-400 to-pink-400 text-white px-8 py-3 rounded-xl font-medium shadow-sm hover:shadow transition-all duration-300 cursor-pointer"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Courses Grid */}
          {!loading && !error && (
            <div className="w-full">
              {filteredCourses.length > 0 ? (
                <div className="w-full">
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 w-full"
                  >
                    <AnimatePresence>
                      {filteredCourses.map((course, index) => (
                        <CourseCard
                          key={course._id}
                          course={course}
                          index={index}
                          onEdit={() => handleEditCourse(course._id)}
                          onDelete={() =>
                            handleDeleteCourse(course._id, course.courseName)
                          }
                          onManage={() =>
                            navigate(`/courses/${course?._id}`, {
                              state: { courseId: course._id },
                            })
                          }
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white rounded-2xl border border-teal-50 shadow-sm w-full"
                >
                  <div className="text-teal-100 mb-6">
                    <FaSearch className="w-20 h-20 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                    No courses found
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    {searchTerm
                      ? `No courses found for "${searchTerm}". Try different search terms.`
                      : "Get started by creating your first course"}
                  </p>
                  {!searchTerm && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("create-course")}
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      Create First Course
                    </motion.button>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
