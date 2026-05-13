// CreateCourse.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaPlus,
    FaCheck,
    FaSpinner,
    FaArrowLeft,
    FaPalette,
    FaFileAlt,
    FaGlobe,
    FaCamera,
    FaUpload, FaImage
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import useMediaPicker from "../../hooks/useMediaPicker";
import MediaPickerModal from "../../components/Media/MediaPickerModal";

const CreateCourse = () => {
    const navigate = useNavigate();
    const { openMediaPicker, isOpen, config, closeMediaPicker } = useMediaPicker();

    // Use environment variable for API URL or default
    const getBaseUrl = () => {
        let url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        if (url.endsWith("/")) url = url.slice(0, -1);
        if (!url.endsWith("/api")) url += "/api";
        return url;
    };
    const API_BASE_URL = getBaseUrl();

    // Form state
    const [formData, setFormData] = useState({
        courseName: "",
        description: "",
        coverArt: "",
        isVisible: true,
    });

    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    /* 🔥 HANDLE FORM INPUT CHANGES */
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    /* 🔥 HANDLE FORM SUBMISSION */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.courseName.trim()) {
            toast.error("Please enter a course name");
            return;
        }

        if (!formData.description.trim()) {
            toast.error("Please enter a course description");
            return;
        }

        if (!formData.coverArt) {
            toast.error("Please enter a cover image URL");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${API_BASE_URL}/courses`,
                {
                    courseName: formData.courseName,
                    description: formData.description,
                    coverArt: formData.coverArt,
                    isVisible: formData.isVisible,
                    isGlobal: true, // IMPORTANT: Create as Global Course
                },
                {
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                setShowSuccess(true);

                // Redirect after 2 seconds
                setTimeout(() => {
                    navigate("/courses");
                }, 800);
            }
        } catch (error) {
            console.error("Error creating course:", error);
            toast.error(error.response?.data?.message || "Failed to create course");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 p-4 md:p-6 w-full">
            <div className="max-w-400 mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate("/courses")}
                            className="p-2 hover:bg-teal-50 rounded-xl transition-colors duration-200 text-teal-600 hover:text-teal-700 cursor-pointer"
                        >
                            <FaArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                Create New Global Course
                            </h1>
                            <p className="text-gray-600">
                                Design your course visible to all companies
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-6">
                            <form onSubmit={handleSubmit}>
                                {/* Course Name */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <FaFileAlt className="text-teal-500" />
                                        Course Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="courseName"
                                        value={formData.courseName}
                                        onChange={handleInputChange}
                                        placeholder="Enter a descriptive course title"
                                        className="w-full px-4 py-3.5 bg-white border border-teal-100 rounded-xl focus:border-teal-300 focus:ring-3 focus:ring-teal-50 focus:outline-none transition-all duration-300 shadow-sm hover:border-teal-200 text-gray-700"
                                        maxLength={100}
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <FaFileAlt className="text-teal-500" />
                                        Course Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Describe what students will learn in this course..."
                                        className="w-full px-4 py-3.5 bg-white border border-teal-100 rounded-xl focus:border-teal-300 focus:ring-3 focus:ring-teal-50 focus:outline-none transition-all duration-300 shadow-sm hover:border-teal-200 text-gray-700 resize-none h-40"
                                        maxLength={500}
                                    />
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            Creating Course...
                                        </>
                                    ) : (
                                        <>
                                            <FaPlus />
                                            Create Course
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Right Column - Media Selection */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-6 h-full">
                            {/* Cover Image Section */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <FaPalette className="text-teal-500" />
                                    Cover Image URL *
                                </label>

                                {/* Cover Preview or Input */}
                                <div className="mb-4">
                                    {formData.coverArt ? (
                                        <div className="relative rounded-xl overflow-hidden border-2 border-teal-100 mb-3">
                                            <img
                                                src={formData.coverArt}
                                                alt="Course cover"
                                                className="w-full h-48 object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/400x200?text=Invalid+Image";
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-48 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 mb-3">
                                            <FaImage className="w-8 h-8 opacity-50" />
                                        </div>
                                    )}
                                    <div className="flex gap-2 mb-2">
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                const file = await openMediaPicker({
                                                    allowedTypes: "image",
                                                    title: "Select Cover Image",
                                                });
                                                if (file) {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        coverArt: file.src,
                                                    }));
                                                }
                                            }}
                                            className="px-4 py-3 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl font-medium hover:bg-teal-100 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
                                        >
                                            <FaImage /> Select Image
                                        </button>
                                        <input
                                            type="text"
                                            name="coverArt"
                                            value={formData.coverArt}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full px-4 py-3 bg-white border border-teal-100 rounded-xl focus:border-teal-300 focus:ring-3 focus:ring-teal-50 focus:outline-none transition-all duration-300 text-sm"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Select from library or enter a direct link.
                                    </p>
                                </div>
                            </div>

                            <MediaPickerModal
                                isOpen={isOpen}
                                onClose={closeMediaPicker}
                                {...config}
                            />

                            {/* Visibility Toggle */}
                            <div className="pt-6 border-t border-teal-100">
                                <label className="flex items-center justify-between p-4 bg-teal-50 rounded-xl border border-teal-100 cursor-pointer group hover:bg-teal-100 transition-colors duration-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
                                            <FaGlobe className="text-teal-600" />
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">
                                                Make public
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="isVisible"
                                            checked={formData.isVisible}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div
                                            className={`w-12 h-6 rounded-full transition-colors duration-200 ${formData.isVisible ? "bg-teal-500" : "bg-gray-300"
                                                }`}
                                        >
                                            <div
                                                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${formData.isVisible
                                                    ? "transform translate-x-7"
                                                    : "transform translate-x-1"
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Success Modal */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", damping: 25 }}
                                className="bg-white rounded-2xl p-8 text-center max-w-md"
                            >
                                <div
                                    className="w-20 h-20 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <FaCheck className="w-10 h-10 text-teal-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    Course Created Successfully!
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Your new global course is ready.
                                </p>
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-2 text-teal-600 mb-4">
                                        <FaSpinner className="animate-spin" />
                                        <span className="text-sm">Redirecting...</span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CreateCourse;
