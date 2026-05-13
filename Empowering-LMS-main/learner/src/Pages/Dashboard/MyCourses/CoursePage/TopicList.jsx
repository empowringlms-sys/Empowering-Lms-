// CoursePage/components/TopicList.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlayCircle,
  FiClock,
} from "react-icons/fi";

const TopicList = ({
  topics,
  onTopicClick,
  expandedTopic,
  setExpandedTopic,
}) => {
  const toggleTopic = (topicId) => {
    if (expandedTopic === topicId) {
      setExpandedTopic(null);
    } else {
      setExpandedTopic(topicId);
    }
  };

  return (
    <>
      {topics.map((topic, index) => (
        <motion.div
          key={topic._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          onClick={() => {
            // Unlock logic removed
            toggleTopic(topic._id);
            onTopicClick?.(topic);
          }}
          className={`p-4 transition-all cursor-pointer border-b border-emerald-100 hover:bg-emerald-50 ${expandedTopic === topic._id ? "bg-emerald-50/80" : ""
            }`}
        >
          <div className="flex items-center gap-4">
            {/* Topic Number - Replaced Lock logic with just number */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-emerald-700">
                  {index + 1}
                </span>
              </div>
            </div>

            {/* Topic Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-900 truncate group-hover:text-emerald-700">
                  {topic.topicName}
                </h4>
                <FiPlayCircle className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {topic?.description && (
                <p className="text-sm text-gray-500 truncate">
                  {topic.description}
                </p>
              )}
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {expandedTopic === topic._id && topic.description && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pl-12 pr-4"
              >
                <div className="bg-white/50 border border-emerald-100 rounded-lg p-4">
                  <p className="text-gray-700">{topic.description}</p>
                  {topic.duration && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-emerald-600">
                      <FiClock className="w-4 h-4" />
                      <span>Estimated time: {topic.duration}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </>
  );
};

export default TopicList;
