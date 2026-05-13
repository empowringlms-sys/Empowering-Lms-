import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    FaGripVertical,
    FaChevronRight,
    FaBook,
    FaEdit,
    FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import EditTopicModal from "../EditTopicModal";
import DeleteTopicModal from "../DeleteTopicModal";

export const SortableTopicItem = ({
    course,
    id,
    topic,
    dragOverlay,
    onTopicUpdated,
    onTopicDeleted,
}) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleTopicClick = () => {
        navigate(`topic/${topic?._id}`);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setShowEditModal(true);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setShowDeleteModal(true);
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                className={`group relative bg-white border rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer ${isDragging
                        ? "border-teal-500 shadow-lg scale-[1.02]"
                        : "border-teal-100 hover:border-teal-200"
                    } ${dragOverlay ? "shadow-xl border-teal-300" : ""}`}
                onClick={handleTopicClick}
            >
                {/* Drag Handle */}
                <div
                    className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg ${dragOverlay
                            ? "bg-teal-100 text-teal-600"
                            : "text-gray-400 hover:text-teal-500 hover:bg-teal-50"
                        } transition-colors duration-200 cursor-grab active:cursor-grabbing`}
                    {...attributes}
                    {...listeners}
                >
                    <FaGripVertical className="w-4 h-4" />
                </div>

                <div className="ml-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center">
                                <FaBook className="w-5 h-5 text-teal-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">
                                    {topic.topicName}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    Order: {topic.order} • Content items:{" "}
                                    {topic.content?.data?.length || 0}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Edit Button */}
                            <button
                                onClick={handleEditClick}
                                className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors duration-200 cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Edit topic name"
                            >
                                <FaEdit className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                                onClick={handleDeleteClick}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Delete topic"
                            >
                                <FaTrash className="w-4 h-4" />
                            </button>

                            {/* Existing chevron */}
                            <FaChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Progress Indicator */}
                {topic.content?.data?.length > 0 && (
                    <div className="mt-3 ml-10">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
                                    style={{ width: "75%" }}
                                />
                            </div>
                            <span className="text-xs font-medium text-teal-700">75%</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Topic Modal */}
            <EditTopicModal
                course={course}
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                topic={topic}
                onTopicUpdated={onTopicUpdated}
            />

            {/* Delete Topic Modal */}
            <DeleteTopicModal
                course={course}
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                topic={topic}
                onTopicDeleted={onTopicDeleted}
            />
        </>
    );
};
