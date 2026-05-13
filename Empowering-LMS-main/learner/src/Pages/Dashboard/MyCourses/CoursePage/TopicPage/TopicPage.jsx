// src/pages/learner/TopicPage.jsx - Green Theme & No Logic
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBook,
  FiFileText, // Replaced FiCheckCircle/FiClock/FiUser with generic
} from "react-icons/fi";
import ShowContent from "./ShowContent.jsx";
import axiosInstance from "../../../../../utils/axiosInstance/axiosInstance.js";
import { useAuthContext } from "../../../../../modules/userAuth/AuthContext.jsx";

const TopicPage = () => {
  const navigate = useNavigate();
  const { topicId, courseId, slug } = useParams();
  const { userData } = useAuthContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [course, setCourse] = useState(null);
  const [topic, setTopic] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([]);

  // Load topic data for learner
  useEffect(() => {
    loadTopicData();
  }, [courseId, topicId, userData]);

  const loadTopicData = async () => {
    try {
      setLoading(true);

      const learnerId = userData?._id;
      if (!learnerId) {
        setError("Learner authentication required. Please log in.");
        setLoading(false);
        return;
      }

      // Make API call to get topic data for learner
      const response = await axiosInstance.get(
        `/courses/${courseId}/topics/${topicId}/${learnerId}`
      );

      if (response.success) {
        const { course: courseData, topic: topicData } = response.data;

        // Set data
        setCourse(courseData);
        setTopic(topicData);

        // Extract and sort content blocks
        const contentData = topicData.content?.data || [];
        const sortedContent = [...contentData].sort(
          (a, b) => a.order - b.order
        );
        setContentBlocks(sortedContent);

      } else {
        setError(response.message || "Failed to load topic");
      }
    } catch (err) {
      console.error("Error loading topic data:", err);
      if (err.status === 403) {
        setError("Access denied. You are not enrolled in this course.");
      } else if (err.status === 404) {
        setError("Topic not found.");
      } else {
        setError("Failed to load topic data.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-emerald-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-emerald-700 font-medium">Loading topic...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-emerald-50 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Topic
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(`/${slug}/dashboard/courses/${courseId}`)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="bg-emerald-50 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Topic Not Found
          </h2>
          <button
            onClick={() => navigate(`/${slug}/dashboard/courses/${courseId}`)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 min-h-screen">

      <header>
        <div class="bg-gradient-to-r from-emerald-100 mx-2 md:mx-5 my-2 to-green-200 text-emerald-900 px-3 md:px-6 py-3 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2 shadow-sm rounded-lg">
          <h1 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal  md:font-bold tracking-wide">
            {course?.courseName}
          </h1>
        </div>

        <p class="text-base sm:text-lg md:text-xl rounded-lg bg-emerald-50 mx-2 md:mx-5 my-1 px-3 md:px-6 py-2 md:py-2.5 font-normal md:font-medium text-emerald-700 shadow-sm">
          {topic?.topicName}
        </p>
      </header>


      {/* Main Content Area - Overlapping the header */}
      {/* <div className="max-w-[1500px] mx-auto px-4 md:px-6 -mt-8 pb-12">
        <div className="bg-white rounded-2xl shadow-xl shadow-emerald-900/5 border border-emerald-100 overflow-hidden min-h-[500px]"> */}
      {/* Content Header */}
      {/* <div className="bg-gradient-to-b from-emerald-50/50 to-white px-8 py-6 border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <FiFileText className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Topic Content
              </h2>
            </div>
          </div> */}

      <div className="">
        {/* Content Blocks */}
        {contentBlocks.length > 0 ? (
          <div className="space-y-12">
            <ShowContent
              contentBlocks={contentBlocks}
              courseId={courseId}
              topicId={topicId}
              learnerId={userData?._id}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <FiBook className="w-10 h-10 text-emerald-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Content Coming Soon
            </h3>
            <p className="text-gray-500 max-w-md mx-auto text-lg">
              We're putting the finishing touches on this topic. Check back later!
            </p>
          </div>
        )}
        {/* </div>
        </div> */}
      </div>
    </div>
  );
};

export default TopicPage;