// src/pages/TopicPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ContentBuilder from "./ContentBuilder/ContentBuilder";
import RichTextEditor from "./ContentBuilder/ContentTypes/Add/RichTextEditor";
import * as courseApi from "../../../../../src/services/courseApi.js";
import {
  FiArrowLeft,
  FiFileText,
  FiImage,
  FiVideo,
  FiMusic,
  FiLink,
  FiFile,
  FiCode,
  FiMessageSquare,
  FiHelpCircle,
  FiUploadCloud,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiShare2,
  FiCopy,
  FiDownload,
  FiMenu,
} from "react-icons/fi";
import { formatYouTubeIframe } from "../../../../../utils/formatYouTubeIframe.js";
import { MdArrowOutward } from "react-icons/md";
import { HiLink } from "react-icons/hi";
import { FaFileAlt, FaGoogleDrive } from "react-icons/fa";
import DeleteContent from "./ContentBuilder/ContentTypes/Edit/Delete/DeleteContent.jsx";
import ShowContent from "./ContentBuilder/ShowContent.jsx";

const TopicPage = () => {
  const navigate = useNavigate();
  const { topicId, courseId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [course, setCourse] = useState(null);
  const [topic, setTopic] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [insertPosition, setInsertPosition] = useState(null);
  const [editingContent, setEditingContent] = useState(null);

  // Load only the specific topic data
  useEffect(() => {
    loadTopicData();
  }, [courseId, topicId]);

  const loadTopicData = async () => {
    try {
      setLoading(true);

      // Use the new optimized API
      const response = await courseApi.getTopicById(courseId, topicId);
      if (response.data.success) {
        const { course: courseData, topic: topicData } = response.data.data;

        setCourse(courseData);
        setTopic(topicData);

        // Sort content by order
        const sortedContent = [...(topicData.content?.data || [])].sort(
          (a, b) => a.order - b.order
        );
        setContentBlocks(sortedContent);
      } else {
        setError(response.data.message || "Failed to load topic");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load topic");
      console.error("Error loading topic:", err);
    } finally {
      setLoading(false);
    }
  };

  // Simple content type icon getter
  const getContentIcon = (type) => {
    switch (type) {
      case "TEXT":
        return <FiFileText className="w-5 h-5 text-emerald-600" />;
      case "IMAGE":
        return <FiImage className="w-5 h-5 text-blue-600" />;
      case "VIDEO":
        return <FiVideo className="w-5 h-5 text-purple-600" />;
      case "AUDIO":
        return <FiMusic className="w-5 h-5 text-amber-600" />;
      case "LINK":
        return <FiLink className="w-5 h-5 text-cyan-600" />;
      case "FILE":
        return <FiFile className="w-5 h-5 text-gray-600" />;
      case "DOCS":
        return <FiFileText className="w-5 h-5 text-red-600" />;
      case "EMBED":
        return <FiCode className="w-5 h-5 text-indigo-600" />;
      case "MCQ":
        return <FiHelpCircle className="w-5 h-5 text-green-600" />;
      case "DISCUSSION":
        return <FiMessageSquare className="w-5 h-5 text-pink-600" />;
      case "UPLOAD":
        return <FiUploadCloud className="w-5 h-5 text-teal-600" />;
      default:
        return <FiFileText className="w-5 h-5 text-gray-600" />;
    }
  };

  // Handle edit click
  const handleEditClick = (content) => {
    setEditingContent(content);
    setShowBuilder(true);
  };


  // Open content builder at specific position
  const openBuilderAtPosition = (order) => {
    setInsertPosition({ order });
    setEditingContent(null); // Ensure we are not in edit mode
    setShowBuilder(true);
  };

  // Refresh page after content is added
  const handleContentAdded = () => {
    setShowBuilder(false);
    setInsertPosition(null);
    setEditingContent(null);
    loadTopicData(); // Refresh only the topic data
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-emerald-700 font-medium">Loading topic...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Topic
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(`/admin/courses/${courseId}`)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Topic Not Found
          </h2>
          <button
            onClick={() => navigate(`/admin/courses/${courseId}`)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}

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

      <div className="max-w-[1500px] mx-auto px-2 sm:px-6 lg:px-8 py-8">
        {contentBlocks.length > 0 && !course?.isGlobal && (
          <AddContentDivider
            onAdd={() => openBuilderAtPosition(1)}
            label="Add content at the beginning"
          />
        )}

        <ShowContent
          contentBlocks={contentBlocks}
          courseId={courseId}
          topicId={topicId}
          loadTopicData={loadTopicData}
          onAddContent={openBuilderAtPosition}
          onEditContent={handleEditClick}
          readOnly={course?.isGlobal}
        />
        {/* Show empty state if no content */}
        {contentBlocks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mx-auto mb-6">
              <FiPlus className="w-12 h-12 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-900 mb-3">
              No Content Yet
            </h3>
            <p className="text-emerald-600 max-w-md mx-auto mb-8">
              {course?.isGlobal
                ? "This topic has no content."
                : "Start building your topic by adding the first content block."}
            </p>
            {!course?.isGlobal && (
              <button
                onClick={() => openBuilderAtPosition(1)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                Add First Content
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Content Builder Modal */}
      {showBuilder && (
        <ContentBuilder
          onClose={() => {
            setShowBuilder(false);
            setInsertPosition(null);
            setEditingContent(null);
          }}
          onSelect={handleContentAdded}
          courseId={courseId}
          topicId={topicId}
          insertOrder={insertPosition?.order}
          editingContent={editingContent}
        />
      )}
    </div>
  );
};

// Add Content Divider Component
export const AddContentDivider = ({ onAdd, label }) => (
  <div className="relative flex items-center gap-6 my-6">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
    <button
      onClick={onAdd}
      className="group relative flex flex-col items-center cursor-pointer"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
        <FiPlus className="w-5 h-5" />
      </div>
    </button>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
  </div>
);

export default TopicPage;
