

// src/pages/learner/CoursePage.jsx - Green Theme & No Logic
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiPlay,
  FiArrowLeft,
} from "react-icons/fi";
import { useAuthContext } from "../../../../modules/userAuth/AuthContext";
import axiosInstance from "../../../../utils/axiosInstance/axiosInstance";
import toast from "react-hot-toast";
import TopicList from "./TopicList";

const CoursePage = () => {
  const { courseId, slug } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuthContext();
  const learnerId = userData?._id;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);

  useEffect(() => {
    if (learnerId && courseId) {
      fetchCourseData();
    }
  }, [courseId, learnerId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        `/courses/${courseId}/${learnerId}/course-and-topics-summary-for-learner`
      );

      if (response.success) {
        setCourse(response.data);
      } else {
        setError(response.message || "Failed to load course");
        toast.error("Failed to load course data");
      }
    } catch (err) {
      console.error("Error fetching course:", err);
      setError(err.message || "Error loading course");
      toast.error("Error loading course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (topic) => {
    // No lock checks
    navigate(`/${slug}/dashboard/courses/${courseId}/topics/${topic._id}`, {
      state: { course, topic },
    });
  };

  const scrollToTopics = () => {
    const section = document.getElementById("topics");
    if (!section) return;

    const yOffset = -100;
    const y =
      section.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="bg-emerald-50 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative flex justify-center">
            <div className="w-20 h-20 border-4 border-emerald-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full absolute animate-spin"></div>
          </div>
          <p className="mt-6 text-emerald-700 font-medium">
            Loading your course...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="bg-emerald-50 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8 text-center max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBookOpen className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Course Unavailable
          </h3>
          <p className="text-gray-600 mb-6">
            {error ||
              "This course is currently unavailable or you don't have access."}
          </p>
          <button
            onClick={() => navigate(`/${slug}/dashboard/courses`)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-2 mx-auto hover:scale-[1.02] shadow-md"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Courses
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 min-h-screen p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-3 space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 shadow-xl"
            >
              <div className="relative p-3 md:p-4 lg:p-6 flex flex-col gap-8 items-start ">
                {/* Cover Art - Shown first/before text */}
                {course.coverArt && (
                  <div className="w-full flex-shrink-0">
                    <div className="rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={course.coverArt}
                        alt={course.courseName}
                        className="w-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="text-white flex-1 min-w-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    {course.courseName}
                  </h2>
                  <p className="text-emerald-100 opacity-95 text-lg leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Topics Section - Simplified */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden"
              id="topics"
            >
              <div className="p-6 border-b border-emerald-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FiBookOpen className="text-emerald-600" />
                      Course Topics
                    </h3>
                  </div>
                  <div className="text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    {course.topics?.length || 0} topics
                  </div>
                </div>
              </div>

              {!course.topics || course.topics.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiBookOpen className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    No Topics Available
                  </h4>
                  <p className="text-gray-600 max-w-md mx-auto">
                    This course doesn't have any topics yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-emerald-50/50">
                  <TopicList
                    topics={course.topics}
                    onTopicClick={handleTopicClick}
                    expandedTopic={expandedTopic}
                    setExpandedTopic={setExpandedTopic}
                  />
                </div>
              )}
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
