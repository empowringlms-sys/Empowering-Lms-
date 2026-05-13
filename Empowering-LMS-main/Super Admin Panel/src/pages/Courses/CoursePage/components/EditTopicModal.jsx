import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaEdit, FaSpinner } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const EditTopicModal = ({ isOpen, onClose, topic, course, onTopicUpdated }) => {
    const [topicName, setTopicName] = useState(topic?.topicName || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const getBaseUrl = () => {
        let url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        if (url.endsWith("/")) url = url.slice(0, -1);
        if (!url.endsWith("/api")) url += "/api";
        return url;
    };
    const API_BASE_URL = getBaseUrl();

    // Reset form when topic changes
    React.useEffect(() => {
        if (topic) {
            setTopicName(topic.topicName || "");
            setError("");
        }
    }, [topic]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!topicName.trim()) {
            setError("Topic name is required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.put(
                `${API_BASE_URL}/courses/${course?._id}/edit-topic-name/${topic._id}`,
                { topicName: topicName.trim() },
                { withCredentials: true }
            );

            if (response.data.success) {
                toast.success("Topic name updated successfully!");

                // Call the update callback with the updated topic
                if (onTopicUpdated) {
                    onTopicUpdated({
                        ...topic,
                        topicName: topicName.trim(),
                    });
                }

                onClose();
            } else {
                throw new Error(response.data.message || "Failed to update topic name");
            }
        } catch (err) {
            console.error("Error updating topic name:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to update topic name"
            );
            toast.error(err.response?.data?.message || "Failed to update topic name");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
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
                            <div className="relative bg-gradient-to-r from-teal-500 to-cyan-500 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
                                            <FaEdit className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">
                                                Edit Topic Name
                                            </h2>
                                            <p className="text-teal-100 text-sm mt-1">
                                                Update the name of your topic
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
                                {/* Current Topic Indicator */}
                                <div className="mb-6 p-4 bg-teal-50 rounded-xl border border-teal-100">
                                    <p className="text-sm font-medium text-teal-800 mb-1">
                                        Current Topic
                                    </p>
                                    <p className="text-gray-600 truncate">{topic.topicName}</p>
                                </div>

                                {/* Input Field */}
                                <div className="space-y-2 mb-6">
                                    <label
                                        htmlFor="topicName"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        New Topic Name
                                    </label>
                                    <input
                                        id="topicName"
                                        type="text"
                                        value={topicName}
                                        onChange={(e) => {
                                            setTopicName(e.target.value);
                                            if (error) setError("");
                                        }}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Enter new topic name"
                                        className={`w-full px-4 py-3 rounded-xl border ${error
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                                            } focus:ring-2 focus:ring-opacity-20 transition-all duration-200 outline-none`}
                                        autoFocus
                                        disabled={loading}
                                    />
                                    <div className="flex justify-between items-center">
                                        {error && <p className="text-sm text-red-600">{error}</p>}
                                    </div>
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
                                        disabled={
                                            loading ||
                                            !topicName.trim() ||
                                            topicName.trim() === topic.topicName
                                        }
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <FaSpinner className="w-4 h-4 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            "Update Topic"
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

export default EditTopicModal;
