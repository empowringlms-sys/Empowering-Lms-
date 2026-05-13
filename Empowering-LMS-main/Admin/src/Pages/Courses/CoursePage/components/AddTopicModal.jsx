import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTimes, FaSpinner } from "react-icons/fa";
import axiosInstance from "../../../../../utils/axiosInstance";
import toast from "react-hot-toast";

const AddTopicModal = ({ isOpen, onClose, courseId, onTopicAdded }) => {
  const [topicName, setTopicName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) setTopicName("");
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topicName.trim()) {
      toast.error("Please enter a topic name");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(`/courses/${courseId}/topics`, {
        topicName: topicName.trim(),
      });

      if (response.data.success) {
        toast.success("Topic added successfully!");
        onTopicAdded(response.data.data);
        setTopicName("");
        onClose();
      } else {
        toast.error(response.data.message || "Failed to add topic");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error adding topic");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-teal-500 to-cyan-500 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
                      <FaPlus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Add New Topic</h2>
                      <p className="text-teal-100 text-sm mt-1">
                        Add a topic to your course
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200 cursor-pointer group"
                  >
                    <FaTimes className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-2 mb-6">
                  <label
                    htmlFor="topicName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Topic Name
                  </label>
                  <input
                    id="topicName"
                    type="text"
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                    placeholder="Enter topic name"
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring-teal-500 focus:ring-2 focus:ring-opacity-20 outline-none transition-all duration-200"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Keep it descriptive and clear for your learners
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !topicName.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Topic"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddTopicModal;
