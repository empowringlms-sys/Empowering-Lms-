// src/components/Content/DeleteContent.js
import React, { useState } from "react";
import { FiTrash2, FiX, FiAlertTriangle, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../../../../../../../../../utils/axiosInstance";

const DeleteContent = ({ courseId, topicId, contentId, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deletionStage, setDeletionStage] = useState("confirm"); // confirm, deleting, success

  const handleDelete = async () => {
    setLoading(true);
    setDeletionStage("deleting");

    try {
      await axiosInstance.delete(
        `/courses/${courseId}/topics/${topicId}/content/${contentId}`
      );

      // Show success state
      setDeletionStage("success");

      // Delay before closing and refreshing
      setTimeout(() => {
        toast.success("Content deleted successfully");
        setShowModal(false);
        setDeletionStage("confirm");
        setLoading(false);
        onDeleted?.(); // Refresh content in parent
      }, 1000);
    } catch (err) {
      console.error("Delete error:", err);
      setDeletionStage("confirm");
      setLoading(false);
      toast.error("Failed to delete content");
    }
  };

  const handleCloseModal = () => {
    if (loading) return; // Prevent closing during deletion
    setShowModal(false);
    setDeletionStage("confirm");
  };

  return (
    <>
      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        className="group relative cursor-pointer p-2.5 rounded-xl bg-gradient-to-br from-rose-100 to-rose-50 text-rose-600 hover:text-rose-800 hover:from-rose-200 hover:to-rose-100 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95 border border-rose-200/50 hover:border-rose-300/70 overflow-hidden"
        title="Delete content"
        disabled={loading}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-rose-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full pointer-events-none"></div>

        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="relative z-10 w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full"
          />
        ) : (
          <FiTrash2 className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
        )}
      </button>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4"
            >
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-2xl overflow-hidden border border-emerald-100/50"
              >
                {/* Progress Indicator */}
                {loading && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-100 via-amber-100 to-emerald-100 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  </div>
                )}

                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg
                        ${deletionStage === "success"
                            ? "bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 border border-emerald-200/50"
                            : deletionStage === "deleting"
                              ? "bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 border border-amber-200/50"
                              : "bg-gradient-to-br from-rose-100 to-rose-50 text-rose-600 border border-rose-200/50"
                          }`}
                      >
                        {deletionStage === "success" ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                          >
                            <FiCheck className="w-7 h-7" />
                          </motion.div>
                        ) : deletionStage === "deleting" ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <FiAlertTriangle className="w-7 h-7" />
                          </motion.div>
                        ) : (
                          <FiAlertTriangle className="w-7 h-7" />
                        )}

                        {/* Pulse effect */}
                        {deletionStage === "confirm" && (
                          <div className="absolute inset-0 rounded-2xl bg-rose-500/20 animate-ping opacity-75"></div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {deletionStage === "success"
                            ? "Successfully Deleted!"
                            : deletionStage === "deleting"
                              ? "Deleting Content..."
                              : "Confirm Deletion"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {deletionStage === "success"
                            ? "Content has been removed"
                            : deletionStage === "deleting"
                              ? "Please wait while we delete..."
                              : "This action cannot be undone"}
                        </p>
                      </div>
                    </div>

                    {/* Close Button (only when not loading) */}
                    {!loading && deletionStage === "confirm" && (
                      <button
                        onClick={handleCloseModal}
                        className="p-2 hover:bg-gray-100/80 rounded-xl transition-colors duration-200 border border-gray-200/50 cursor-pointer"
                      >
                        <FiX className="w-5 h-5 text-gray-500" />
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mb-8">
                    {deletionStage === "confirm" && (
                      <>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          Are you sure you want to permanently delete this
                          content? This will remove all associated data and
                          cannot be recovered.
                        </p>
                      </>
                    )}

                    {deletionStage === "deleting" && (
                      <div className="text-center py-6">
                        <div className="space-y-4">
                          <div className="flex justify-center gap-2">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-500 to-amber-600"
                                animate={{
                                  scale: [1, 1.5, 1],
                                  opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                              />
                            ))}
                          </div>
                          <p className="text-gray-600 font-medium">
                            Removing content from the system...
                          </p>
                        </div>
                      </div>
                    )}

                    {deletionStage === "success" && (
                      <div className="text-center py-4">
                        <div className="space-y-4">
                          <div className="relative w-20 h-20 mx-auto">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 animate-ping opacity-20"></div>
                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                              <FiCheck className="w-10 h-10 text-white" />
                            </div>
                          </div>
                          <p className="text-emerald-700 font-medium">
                            Content deleted successfully!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {deletionStage === "confirm" && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleCloseModal}
                        disabled={loading}
                        className="flex-1 py-3.5 px-6 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700 font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300/50 shadow-sm hover:shadow cursor-pointer whitespace-nowrap"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 py-3.5 px-6 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-700 hover:via-rose-600 hover:to-rose-700 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 relative group overflow-hidden cursor-pointer whitespace-nowrap"
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {loading ? (
                            <>
                              <motion.div
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <FiTrash2 className="w-4 h-4" />
                              Delete
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  )}

                  {deletionStage === "success" && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-4">Wait ...</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DeleteContent;
