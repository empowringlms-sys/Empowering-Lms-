import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
    FiFileText,
    FiEdit2,
    FiSave,
    FiCheck,
    FiClock,
    FiAlertCircle,
} from "react-icons/fi";
import DeleteContent from "./ContentTypes/Edit/Delete/DeleteContent";
import RichTextEditor from "./ContentTypes/Add/RichTextEditor";
import * as courseApi from "../../../../../services/courseApi";

const ShowContent = ({ contentBlocks, courseId, topicId, loadTopicData, onAddContent, onEditContent }) => {
    const [savingContents, setSavingContents] = useState({});
    const [lastSavedTimes, setLastSavedTimes] = useState({});
    const [localContent, setLocalContent] = useState({});
    const saveTimeoutsRef = useRef({});
    const lastSavedContentRef = useRef({});

    // Initialize last saved content ref
    React.useEffect(() => {
        contentBlocks.forEach((block) => {
            if (block.type === "TEXT" && block.data?.content) {
                lastSavedContentRef.current[block._id] = block.data.content;
            }
        });
    }, [contentBlocks]);

    const getContentIcon = (type) => {
        switch (type) {
            case "TEXT":
                return <FiFileText className="w-5 h-5 text-emerald-600" />;
            default:
                return <FiFileText className="w-5 h-5 text-gray-600" />;
        }
    };

    const updateTextContent = useCallback(
        async (contentId, content, textName = "Text Content") => {
            try {
                const response = await courseApi.updateContent(
                    courseId,
                    topicId,
                    contentId,
                    {
                        type: "TEXT",
                        data: {
                            content,
                            textName,
                        }
                    }
                );
                return response.data;
            } catch (error) {
                console.error("Error updating text content:", error);
                throw error;
            }
        },
        [courseId, topicId]
    );

    const debouncedAutoSave = useCallback(
        (contentId, content) => {
            if (saveTimeoutsRef.current[contentId]) {
                clearTimeout(saveTimeoutsRef.current[contentId]);
            }

            if (content === lastSavedContentRef.current[contentId]) {
                return;
            }

            setSavingContents((prev) => ({
                ...prev,
                [contentId]: "saving",
            }));

            saveTimeoutsRef.current[contentId] = setTimeout(async () => {
                try {
                    const result = await updateTextContent(contentId, content);

                    if (result.success) {
                        lastSavedContentRef.current[contentId] = content;
                        setSavingContents((prev) => ({
                            ...prev,
                            [contentId]: "saved",
                        }));
                        setLastSavedTimes((prev) => ({
                            ...prev,
                            [contentId]: new Date(),
                        }));
                        setTimeout(() => {
                            setSavingContents((prev) => ({
                                ...prev,
                                [contentId]: null,
                            }));
                        }, 2000);
                    } else {
                        setSavingContents((prev) => ({
                            ...prev,
                            [contentId]: "error",
                        }));
                    }
                } catch (error) {
                    setSavingContents((prev) => ({
                        ...prev,
                        [contentId]: "error",
                    }));
                }
            }, 2000);
        },
        [updateTextContent]
    );

    const handleManualSave = useCallback(
        async (contentId) => {
            const content = localContent[contentId];
            if (!content) return;

            if (saveTimeoutsRef.current[contentId]) {
                clearTimeout(saveTimeoutsRef.current[contentId]);
            }

            setSavingContents((prev) => ({
                ...prev,
                [contentId]: "saving",
            }));

            try {
                const result = await updateTextContent(contentId, content);

                if (result.success) {
                    lastSavedContentRef.current[contentId] = content;
                    setSavingContents((prev) => ({
                        ...prev,
                        [contentId]: "saved",
                    }));
                    setLastSavedTimes((prev) => ({
                        ...prev,
                        [contentId]: new Date(),
                    }));
                    setTimeout(() => {
                        setSavingContents((prev) => ({
                            ...prev,
                            [contentId]: null,
                        }));
                    }, 2000);
                }
            } catch (error) {
                setSavingContents((prev) => ({
                    ...prev,
                    [contentId]: "error",
                }));
            }
        },
        [localContent, updateTextContent]
    );

    const handleEditorChange = useCallback(
        (contentId, newContent) => {
            setLocalContent((prev) => ({
                ...prev,
                [contentId]: newContent,
            }));
            debouncedAutoSave(contentId, newContent);
        },
        [debouncedAutoSave]
    );

    return (
        <div>
            {contentBlocks.map((block, index) => (
                <React.Fragment key={block._id}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="mb-6"
                    >
                        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                            {/* Block Header */}
                            <div className="px-6 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-white flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                        {getContentIcon(block.type)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-emerald-800">
                                                {block.type}
                                            </span>
                                            {block.type === "TEXT" && savingContents[block._id] && (
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${savingContents[block._id] === "saving" ? "bg-amber-100 text-amber-700" :
                                                        savingContents[block._id] === "saved" ? "bg-emerald-100 text-emerald-700" :
                                                            "bg-rose-100 text-rose-700"
                                                    }`}>
                                                    {savingContents[block._id] === "saving" && "Saving..."}
                                                    {savingContents[block._id] === "saved" && "Saved"}
                                                    {savingContents[block._id] === "error" && "Failed"}
                                                </span>
                                            )}
                                        </div>
                                        {block.data?.textName && (
                                            <p className="text-sm text-emerald-900 font-medium">
                                                {block.data.textName}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {block.type === "TEXT" && (
                                        <button
                                            onClick={() => handleManualSave(block._id)}
                                            className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                                            title="Save Content"
                                        >
                                            <FiSave className="w-4 h-4" />
                                        </button>
                                    )}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditContent && onEditContent(block);
                                        }}
                                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                                        title="Edit Content"
                                    >
                                        <FiEdit2 className="w-4 h-4" />
                                    </button>

                                    <DeleteContent
                                        courseId={courseId}
                                        topicId={topicId}
                                        contentId={block._id}
                                        onDeleted={loadTopicData}
                                    />
                                </div>
                            </div>

                            {/* Block Content */}
                            <div className="p-4 md:p-6">
                                {block.type === "TEXT" && (
                                    <div className="relative">
                                        <h3 className="text-lg font-semibold text-emerald-900 mb-3">
                                            {block?.data?.textName || "Text Content"}
                                        </h3>
                                        <div className="border border-emerald-200 rounded-xl overflow-hidden">
                                            <RichTextEditor
                                                value={localContent[block._id] || block.data.content || ""}
                                                onChange={(newContent) => handleEditorChange(block._id, newContent)}
                                                onSave={() => handleManualSave(block._id)}
                                                height={400}
                                                placeholder="Start typing your content here..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Fallback for other types */}
                                {block.type !== "TEXT" && (
                                    <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg">
                                        Preview for type {block.type} is not yet implemented in Super Admin Panel.
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </React.Fragment>
            ))}
        </div>
    );
};

export default ShowContent;
