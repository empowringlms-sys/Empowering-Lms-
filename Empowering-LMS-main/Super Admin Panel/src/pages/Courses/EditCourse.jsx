import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaSave,
    FaTrash,
    FaTimes,
    FaUpload,
    FaImage,
    FaEye,
    FaSpinner,
    FaArrowLeft,
    FaPalette,
    FaFileAlt,
    FaGlobe,
    FaCamera,
    FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import useMediaPicker from "../../hooks/useMediaPicker";
import MediaPickerModal from "../../components/Media/MediaPickerModal";

const EditCourse = () => {
    const navigate = useNavigate();
    const { courseId } = useParams(); // Using courseId to match route
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

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [course, setCourse] = useState(null);

    // Media picker hook
    const { openMediaPicker, isOpen, config, closeMediaPicker } = useMediaPicker();

    /* 🔥 FETCH COURSE DETAILS */
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/courses/${courseId}`, {
                    withCredentials: true
                });

                if (response.data.success) {
                    const courseData = response.data.data;
                    setCourse(courseData);
                    setFormData({
                        courseName: courseData.courseName || "",
                        description: courseData.description || "",
                        coverArt: courseData.coverArt || "",
                        isVisible: courseData.isVisible !== false, // Default to true
                    });
                } else {
                    toast.error("Course not found");
                    navigate("/courses");
                }
            } catch (error) {
                console.error("Error fetching course:", error);
                toast.error("Failed to load course details");
                navigate("/courses");
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourse();
        }
    }, [courseId, navigate, API_BASE_URL]);

    /* 🔥 HANDLE FORM INPUT CHANGES */
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    /* 🔥 HANDLE MEDIA SELECTION */
    const handleSelectCover = async () => {
        const file = await openMediaPicker({
            allowedTypes: 'image',
            title: 'Select Cover Image'
        });

        if (file) {
            setFormData((prev) => ({
                ...prev,
                coverArt: file.src,
            }));
            toast.success("Cover image updated!");
        }
    };

    /* 🔥 HANDLE FORM SUBMISSION - UPDATE */
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
            toast.error("Please select a cover image");
            return;
        }

        try {
            setUpdating(true);

            const response = await axios.put(`${API_BASE_URL}/courses/${courseId}`, {
                courseName: formData.courseName,
                description: formData.description,
                coverArt: formData.coverArt,
                isVisible: formData.isVisible,
                isGlobal: true
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                setShowSuccess(true);
                // Redirect after 1 second
                setTimeout(() => {
                    navigate(`/courses/${courseId}`);
                }, 1000);
            }
        } catch (error) {
            console.error("Error updating course:", error);
            toast.error(error.response?.data?.message || "Failed to update course");
        } finally {
            setUpdating(false);
        }
    };

    /* 🔥 HANDLE COURSE DELETE */
    const handleDelete = async () => {
        try {
            setDeleting(true);
            const response = await axios.delete(`${API_BASE_URL}/courses/${courseId}`, {
                withCredentials: true
            });

            if (response.data.success) {
                toast.success("Course deleted successfully!");
                setShowDeleteConfirm(false);

                // Redirect after 1 second
                setTimeout(() => {
                    navigate("/courses");
                }, 500);
            }
        } catch (error) {
            console.error("Error deleting course:", error);
            toast.error(error.response?.data?.message || "Failed to delete course");
        } finally {
            setDeleting(false);
        }
    };

    /* 🔥 FORMAT FILE NAME */
    const formatFileName = (url) => {
        if (!url) return "No image selected";
        const name = url.split("/").pop();
        if (name.length > 30) {
            return name.substring(0, 15) + "..." + name.substring(name.length - 10);
        }
        return name;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 p-4 md:p-6 w-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading course details...</p>
                </div>
            </div>
        );
    }

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
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-teal-50 rounded-xl transition-colors duration-200 text-teal-600 hover:text-teal-700 cursor-pointer"
                            >
                                <FaArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                    Edit Course
                                </h1>
                                <p className="text-gray-600">
                                    Update your course details and content
                                </p>
                            </div>
                        </div>

                        {/* Delete Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowDeleteConfirm(true)}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                        >
                            <FaTrash className="w-4 h-4" />
                            Delete Course
                        </motion.button>
                    </div>
                </motion.div>

                {/* Desktop Layout */}
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
                                    <p className="text-xs text-gray-500 mt-2">
                                        {formData.courseName.length}/100 characters
                                    </p>
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
                                    <p className="text-xs text-gray-500 mt-2">
                                        {formData.description.length}/500 characters
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/courses")}
                                        className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={updating}
                                        className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                    >
                                        {updating ? (
                                            <>
                                                <FaSpinner className="animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave />
                                                Update Course
                                            </>
                                        )}
                                    </motion.button>
                                </div>
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
                                    Cover Image *
                                </label>

                                {/* Clickable Cover Area */}
                                <div
                                    onClick={handleSelectCover}
                                    className="cursor-pointer group mb-4"
                                >
                                    {formData.coverArt ? (
                                        <div className="relative rounded-xl overflow-hidden border-2 border-teal-100 group-hover:border-teal-300 transition-all duration-300">
                                            <img
                                                src={formData.coverArt}
                                                alt="Course cover"
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                                                    <FaCamera className="text-teal-600" />
                                                    <span className="font-medium text-teal-700">
                                                        Change Image
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="absolute top-3 right-3 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                Selected
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-48 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border-2 border-dashed border-teal-200 flex flex-col items-center justify-center text-gray-400 group-hover:border-teal-300 group-hover:bg-teal-100 transition-all duration-300">
                                            <FaUpload className="w-12 h-12 mb-3 group-hover:text-teal-500 transition-colors" />
                                            <p className="text-lg font-medium mb-1">
                                                Click to upload cover image
                                            </p>
                                            <p className="text-sm">or select from media library</p>
                                        </div>
                                    )}
                                </div>

                                {/* File Info */}
                                {formData.coverArt && (
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-2">
                                            {formatFileName(formData.coverArt)}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setPreviewImage(formData.coverArt)}
                                            className="text-xs text-teal-600 hover:text-teal-700 font-medium cursor-pointer hover:underline"
                                        >
                                            Preview Image
                                        </button>
                                    </div>
                                )}

                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    {formData.coverArt
                                        ? "Click on the image to change it"
                                        : "Click the upload area to select or upload cover image"}
                                </p>
                            </div>

                            {/* Visibility Toggle */}
                            <div className="pt-6 border-t border-teal-100">
                                <div
                                    className="flex items-center justify-between p-4 bg-teal-50 rounded-xl border border-teal-100 cursor-pointer group hover:bg-teal-100 transition-colors duration-200"
                                    onClick={() => setFormData(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
                                            <FaGlobe className="text-teal-600" />
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">
                                                Make course public
                                            </span>
                                            <p className="text-sm text-gray-500">
                                                Course will be visible to all students
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative">
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
                                </div>
                                <p className="text-xs text-gray-500 mt-3">
                                    {formData.isVisible
                                        ? "✓ This course will be visible to all students"
                                        : "✗ This course will be hidden from students"}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Preview Modal */}
                <AnimatePresence>
                    {previewImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                            onClick={() => setPreviewImage(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl p-6 max-w-4xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Image Preview
                                    </h3>
                                    <button
                                        onClick={() => setPreviewImage(null)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
                                    >
                                        <FaTimes className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                                />
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => setPreviewImage(null)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Media Picker Modal */}
                <MediaPickerModal
                    isOpen={isOpen}
                    onClose={closeMediaPicker}
                    {...config}
                />

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
                                    <FaSave className="w-10 h-10 text-teal-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    Course Updated Successfully!
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Your course has been updated successfully.
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

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {showDeleteConfirm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                            onClick={() => !deleting && setShowDeleteConfirm(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", damping: 25 }}
                                className="bg-white rounded-2xl p-8 max-w-md w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-red-100 rounded-xl">
                                        <FaExclamationTriangle className="w-8 h-8 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                            Delete Course
                                        </h3>
                                        <p className="text-gray-600">
                                            Are you sure you want to delete this course?
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                                    <p className="text-sm text-red-700">
                                        <strong>Warning:</strong> This action cannot be undone. All
                                        course data, including topics and content, will be
                                        permanently deleted.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-sm text-gray-700 mb-1">
                                            <strong>Course:</strong> {formData.courseName}
                                        </p>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            disabled={deleting}
                                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 cursor-pointer disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleDelete}
                                            disabled={deleting}
                                            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                        >
                                            {deleting ? (
                                                <>
                                                    <FaSpinner className="animate-spin" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <FaTrash />
                                                    Delete Course
                                                </>
                                            )}
                                        </motion.button>
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

export default EditCourse;
