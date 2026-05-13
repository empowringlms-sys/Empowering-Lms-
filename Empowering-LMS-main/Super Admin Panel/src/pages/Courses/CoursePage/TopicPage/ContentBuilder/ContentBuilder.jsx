import React, { useState } from "react";
import {
    FiType,
    FiImage,
    FiVideo,
    FiMusic,
    FiLink,
    FiFolder,
    FiCode,
    FiMessageSquare,
    FiUploadCloud,
    FiHelpCircle,
} from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import * as courseApi from "../../../../../services/courseApi";
import AddTextFieldInTopicModal from "./ContentTypes/Add/AddTextFieldInTopicModal";
import useMediaPicker from "../../../../../hooks/useMediaPicker";
import MediaPickerModal from "../../../../../components/Media/MediaPickerModal";

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.96,
        y: 20,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.25,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        scale: 0.96,
        y: 20,
        transition: {
            duration: 0.2,
            ease: "easeIn",
        },
    },
};

const items = [
    {
        label: "Text Field",
        type: "TEXT",
        icon: <FiType />,
        color: "text-teal-500",
    },
    { label: "Image", type: "IMAGE", icon: <FiImage />, color: "text-sky-500", disabled: false },
    { label: "Video", type: "VIDEO", icon: <FiVideo />, color: "text-gray-600", disabled: false },
    { label: "Audio", type: "AUDIO", icon: <FiMusic />, color: "text-orange-400", disabled: true },
    { label: "Link", type: "LINK", icon: <FiLink />, color: "text-cyan-500", disabled: true },
    // ... other items
];

const ContentBuilder = ({
    onClose,
    onSelect,
    courseId,
    topicId,
    insertOrder,
    editingContent,
}) => {
    const [hideBuilder, setHideBuilder] = useState(false);
    const [addingContent, setAddingContent] = useState(false);
    const [showTextModal, setShowTextModal] = useState(false);

    const { openMediaPicker, isOpen, config, closeMediaPicker } = useMediaPicker();

    // Auto-open modal if editing
    React.useEffect(() => {
        if (editingContent) {
            setHideBuilder(true);
            const type = editingContent.type;
            if (type === "TEXT") setShowTextModal(true);
            // Add other types as implemented
        }
    }, [editingContent]);

    const handleAddContent = async (contentType, contentData) => {
        try {
            setAddingContent(true);

            let response;

            if (editingContent) {
                // UPDATE EXISTING CONTENT
                const contentToUpdate = {
                    type: contentType,
                    data: contentData,
                };

                response = await courseApi.updateContent(
                    courseId,
                    topicId,
                    editingContent._id,
                    contentToUpdate
                );
            } else {
                // ADD NEW CONTENT
                const contentToAdd = {
                    type: contentType,
                    order: insertOrder || 1,
                    data: contentData,
                };

                response = await courseApi.addContent(
                    courseId,
                    topicId,
                    contentToAdd
                );
            }

            if (response.data.success) {
                onSelect();
                setShowTextModal(false);
                setHideBuilder(false);
                onClose();
            } else {
                alert(response.data.message || "Failed to save content");
                setHideBuilder(false);
            }
        } catch (error) {
            console.error("Error saving content:", error);
            alert(
                error.response?.data?.message ||
                "Failed to save content. Please try again."
            );
            setHideBuilder(false);
        } finally {
            setAddingContent(false);
        }
    };

    const handleModalClose = () => {
        setHideBuilder(false);
        onClose();
    };

    return (
        <>
            <AnimatePresence>
                {!hideBuilder && !editingContent && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/70 flex justify-center items-start"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={handleModalClose}
                    >
                        <motion.div
                            className="bg-white w-full max-w-5xl rounded-xl shadow-xl mx-2 sm:mx-6 my-auto"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="py-6 text-center">
                                <p className="text-gray-400 text-sm px-3 pb-1">
                                    Choose an element below to begin building your topic
                                </p>
                            </div>

                            <div className="px-5 md:px-10">
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-y-6 md:gap-y-10 text-center">
                                    {items.map((item) => (
                                        <div
                                            key={item.label}
                                            className={`flex flex-col items-center gap-3 transition-opacity ${item.disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"}`}
                                            onClick={async () => {
                                                if (item.disabled) return;

                                                setHideBuilder(true);

                                                if (item.type === "TEXT") {
                                                    setShowTextModal(true);
                                                } else if (item.type === "IMAGE" || item.type === "VIDEO") {
                                                    const file = await openMediaPicker({
                                                        allowedTypes: item.type.toLowerCase(),
                                                        title: `Select ${item.label}`,
                                                    });

                                                    if (file) {
                                                        const contentData = {
                                                            url: file.src,
                                                            caption: file.name,
                                                            fileId: file._id,
                                                            publicId: file.publicId // If available, good to handle
                                                        };
                                                        await handleAddContent(item.type, contentData);
                                                    } else {
                                                        // Cancelled
                                                        setHideBuilder(false);
                                                    }
                                                }
                                            }}
                                        >
                                            <div className={`text-4xl flex items-center justify-center ${item.color}`}>
                                                {item.icon}
                                            </div>
                                            <p className="text-sm text-gray-700">{item.label}</p>
                                            {item.disabled && <p className="text-xs text-gray-400">(Coming Soon)</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pb-6 text-center">
                                <button
                                    onClick={handleModalClose}
                                    className="text-sm text-gray-500 hover:text-black cursor-pointer mt-6"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modals */}
            {showTextModal && (
                <AddTextFieldInTopicModal
                    onClose={() => {
                        setShowTextModal(false);
                        setHideBuilder(false);
                        if (!editingContent) onClose();
                    }}
                    onAdd={(data) => handleAddContent("TEXT", data)}
                    loading={addingContent}
                    initialData={editingContent?.data}
                />
            )}

            <MediaPickerModal
                isOpen={isOpen}
                onClose={closeMediaPicker}
                {...config}
            />
        </>
    );
};

export default ContentBuilder;
