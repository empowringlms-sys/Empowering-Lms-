import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaPlus,
    FaChevronRight,
    FaBook,
    FaList,
    FaArrowLeft,
    FaEye,
    FaEdit,
    FaFileAlt,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import AddTopicModal from "./components/AddTopicModal";
import CourseTopicsList from "./components/CourseTopicsList/CourseTopicsList";

const CoursePage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showAddTopicModal, setShowAddTopicModal] = useState(false);
    const getBaseUrl = () => {
        let url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        if (url.endsWith("/")) url = url.slice(0, -1);
        if (!url.endsWith("/api")) url += "/api";
        return url;
    };
    const API_BASE_URL = getBaseUrl();

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `${API_BASE_URL}/courses/${courseId}/course-and-topics-summary`,
                { withCredentials: true }
            );


            if (response.data.success) {
                setCourse(response.data.data);
            } else {
                setError("Failed to load course details");
                toast.error("Failed to load course details");
            }
        } catch (error) {
            console.error("Error fetching course:", error);
            setError("Error loading course. Please try again.");
            toast.error("Error loading course details");
        } finally {
            setLoading(false);
        }
    };

    const handleAddTopic = () => {
        setShowAddTopicModal(true);
    };

    const handleTopicAdded = (newTopic) => {
        // Refresh course data
        fetchCourseDetails();
    };

    const handleTopicsReordered = (updatedTopics) => {
        // Update local state with new order
        setCourse((prev) => ({
            ...prev,
            topics: updatedTopics,
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
                    <p className="text-teal-700 font-medium">Loading course...</p>
                    <p className="text-sm text-teal-600/70 mt-2">Please wait</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg border border-teal-100 p-8 text-center max-w-md"
                >
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBook className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Course Not Found
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {error ||
                            "The course you're looking for doesn't exist or you don't have access to it."}
                    </p>
                    <button
                        onClick={() => navigate("/courses")}
                        className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-2 mx-auto hover:scale-[1.02] shadow-md"
                    >
                        <FaArrowLeft className="w-4 h-4" />
                        Back to Courses
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 p-2 sm:p-4 md:p-6 lg:p-10">
            {/* Add Topic Modal */}
            <AddTopicModal
                isOpen={showAddTopicModal}
                onClose={() => setShowAddTopicModal(false)}
                courseId={courseId}
                onTopicAdded={handleTopicAdded}
            />

            <div className="max-w-[1600px] mx-auto">
                {/* Header with Back Button */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {course.courseName}
                            </h1>
                        </div>
                    </div>
                </motion.div>

                {/* Course Cover and Basic Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="bg-white rounded-2xl shadow-sm border border-teal-100 overflow-hidden">
                        {/* Cover Image */}
                        <div className="relative  overflow-hidden">
                            <img
                                src={course.coverArt}
                                alt={course.courseName}
                                className="w-full h-full max-h-120 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>

                        {/* Course Stats and Actions */}
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-teal-700 bg-teal-50 px-4 py-2 rounded-xl">
                                        <FaBook className="w-4 h-4" />
                                        <span className="font-semibold">
                                            {course.topics?.length || 0} Topics
                                        </span>
                                    </div>

                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDetails(!showDetails)}
                                        className="px-4 py-2.5 bg-white border border-teal-200 text-teal-700 rounded-xl font-medium hover:bg-teal-50 transition-all duration-200 cursor-pointer flex items-center gap-2 hover:shadow-sm"
                                    >
                                        <FaEye className="w-4 h-4" />
                                        {showDetails ? "Hide Details" : "Show Details"}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/courses/${courseId}/edit`)}
                                        className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-medium hover:bg-emerald-100 transition-all duration-200 cursor-pointer flex items-center gap-2 hover:shadow-sm"
                                    >
                                        <FaEdit className="w-4 h-4" />
                                        Edit
                                    </button>
                                </div>
                            </div>

                            {/* Course Details (Collapsible) */}
                            <AnimatePresence>
                                {showDetails && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-6 pt-6 border-t border-teal-100 space-y-6"
                                    >
                                        {/* Course Information */}
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                <FaList className="text-teal-500" />
                                                Course Information
                                            </h4>

                                            <div className="space-y-3">
                                                {/* Status Bar */}
                                                <div
                                                    className={`flex items-center justify-between px-4 py-3 rounded-lg ${course.isVisible
                                                        ? "bg-green-50 border border-green-200"
                                                        : "bg-amber-50 border border-amber-200"
                                                        }`}
                                                >
                                                    <span className="text-sm font-medium text-gray-700">
                                                        Status
                                                    </span>
                                                    <span
                                                        className={`text-sm font-semibold ${course.isVisible
                                                            ? "text-green-700"
                                                            : "text-amber-700"
                                                            }`}
                                                    >
                                                        {course.isVisible ? "Public" : "Private"}
                                                    </span>
                                                </div>

                                                {/* Total Topics Bar */}
                                                <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-teal-50 border border-teal-200">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        Total Topics
                                                    </span>
                                                    <span className="text-sm font-semibold text-teal-700">
                                                        {course.topics?.length ?? 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Course Description */}
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                <FaFileAlt className="text-teal-500" />
                                                Course Description
                                            </h4>
                                            <p className="text-gray-600 bg-teal-50/50 p-4 rounded-lg">
                                                {course.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* Topics Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="bg-white/80 backdrop-blur-sm border border-teal-100 rounded-2xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                                <FaList className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Course Topics</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="flex h-2 w-2 rounded-full bg-teal-500"></span>
                                    <span className="text-sm font-medium text-teal-600">
                                        {course.topics?.length || 0} {(course.topics?.length || 0) === 1 ? "Topic" : "Topics"} Published
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleAddTopic}
                            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer"
                        >
                            <FaPlus className="w-4 h-4" />
                            Add New Topic
                        </button>
                    </div>

                    {!course.topics || course.topics.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gradient-to-br from-white to-teal-50 rounded-2xl border-2 border-dashed border-teal-200 p-12 text-center"
                        >
                            <div className="w-20 h-20 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaBook className="w-10 h-10 text-teal-600" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3">
                                No Topics Yet
                            </h4>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                Start building your course by adding topics. Each topic can
                                contain text, images, videos, quizzes, and more.
                            </p>
                            <button
                                onClick={handleAddTopic}
                                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-2 mx-auto hover:scale-[1.02] shadow-md"
                            >
                                <FaPlus className="w-4 h-4" />
                                Create Your First Topic
                            </button>
                        </motion.div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-6">
                            <CourseTopicsList
                                course={course}
                                handleAddTopic={handleAddTopic}
                                topics={course.topics}
                                onReorder={handleTopicsReordered}
                                refreshCourse={fetchCourseDetails}
                            />
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default CoursePage;
