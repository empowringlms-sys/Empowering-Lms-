import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus, FiArrowLeft } from "react-icons/fi";
import * as courseApi from "../../../../services/courseApi";
import AddContentDivider from "./components/AddContentDivider";
// Placeholder imports for now - will create these next
import ContentBuilder from "./ContentBuilder/ContentBuilder";
import ShowContent from "./ContentBuilder/ShowContent";

const TopicPage = () => {
    const navigate = useNavigate();
    const { courseId, topicId } = useParams(); // Note: courseId isn't in url but topicId is? No, both should be. 
    // Wait, in my App.jsx I only added /courses/:courseId.
    // I need to add /courses/:courseId/topic/:topicId.
    // But inside TopicPage, I can get courseId if it's in the path or passed as prop. 
    // If I navigate to `topic/:topicId`, the URL is `/courses/:courseId/topic/:topicId`.

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [course, setCourse] = useState(null);
    const [topic, setTopic] = useState(null);
    const [contentBlocks, setContentBlocks] = useState([]);
    const [showBuilder, setShowBuilder] = useState(false);
    const [insertPosition, setInsertPosition] = useState(null);
    const [editingContent, setEditingContent] = useState(null);

    useEffect(() => {
        loadTopicData();
    }, [courseId, topicId]);

    const loadTopicData = async () => {
        try {
            setLoading(true);
            // Use the API service
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

    const handleEditClick = (content) => {
        setEditingContent(content);
        setShowBuilder(true);
    };

    const openBuilderAtPosition = (order) => {
        setInsertPosition({ order });
        setEditingContent(null);
        setShowBuilder(true);
    };

    const handleContentAdded = () => {
        setShowBuilder(false);
        setInsertPosition(null);
        setEditingContent(null);
        loadTopicData();
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
                        onClick={() => navigate(`/courses/${courseId}`)}
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer"
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
                        onClick={() => navigate(`/courses/${courseId}`)}
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer"
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
                <div className="bg-gradient-to-r from-emerald-100 mx-2 md:mx-5 my-2 to-green-200 text-emerald-900 px-3 md:px-6 py-3 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2 shadow-sm rounded-lg">
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal md:font-bold tracking-wide flex items-center gap-2">
                        <button
                            onClick={() => navigate(`/courses/${courseId}`)}
                            className="p-1 hover:bg-emerald-200/50 rounded-full transition-colors cursor-pointer mr-2"
                        >
                            <FiArrowLeft />
                        </button>
                        {course?.courseName}
                    </h1>
                </div>

                <p className="text-base sm:text-lg md:text-xl rounded-lg bg-emerald-50 mx-2 md:mx-5 my-1 px-3 md:px-6 py-2 md:py-2.5 font-normal md:font-medium text-emerald-700 shadow-sm">
                    {topic?.topicName}
                </p>
            </header>

            <div className="max-w-[1500px] mx-auto px-2 sm:px-6 lg:px-8 py-8">
                {contentBlocks.length > 0 && (
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
                            Start building your topic by adding the first content block.
                        </p>
                        <button
                            onClick={() => openBuilderAtPosition(1)}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                            Add First Content
                        </button>
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

export default TopicPage;
