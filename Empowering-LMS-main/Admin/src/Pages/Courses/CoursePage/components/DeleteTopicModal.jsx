import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaTrash, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import axiosInstance from "../../../../../utils/axiosInstance";
import toast from "react-hot-toast";

const DeleteTopicModal = ({ isOpen, onClose, topic, course, onTopicDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.delete(
        `/courses/${course?._id}/topics/${topic._id}`
      );

      if (response.data.success) {
        toast.success("Topic deleted successfully!");
        
        // Call the delete callback
        if (onTopicDeleted) {
          onTopicDeleted(topic._id);
        }
        
        onClose();
      } else {
        throw new Error(response.data.message || "Failed to delete topic");
      }
    } catch (err) {
      console.error("Error deleting topic:", err);
      setError(err.response?.data?.message || err.message || "Failed to delete topic");
      toast.error(err.response?.data?.message || "Failed to delete topic");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !topic) return null;

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
              <div className="relative bg-gradient-to-r from-red-500 to-orange-500 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
                      <FaExclamationTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Delete Topic
                      </h2>
                      <p className="text-red-100 text-sm mt-1">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <FaTimes className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Warning Message */}
                <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex items-start gap-3">
                    <FaExclamationTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800 mb-2">
                        Are you sure you want to delete this topic?
                      </p>
                      <p className="text-sm text-red-600">
                        All content within this topic will be permanently removed.
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Topic Details */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Topic to be deleted:
                  </p>
                  <p className="font-semibold text-gray-900">{topic.topicName}</p>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Order: {topic.order}</p>
                    <p>Content items: {topic.content?.data?.length || 0}</p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

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
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FaTrash className="w-4 h-4" />
                        Delete Topic
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteTopicModal;