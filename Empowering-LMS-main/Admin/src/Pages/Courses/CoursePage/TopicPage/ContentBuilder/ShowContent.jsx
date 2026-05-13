// src/pages/ContentBuilder/ShowContent.jsx
import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  FiFileText,
  FiImage,
  FiVideo,
  FiMusic,
  FiLink,
  FiFile,
  FiCode,
  FiMessageSquare,
  FiHelpCircle,
  FiUploadCloud,
  FiExternalLink,
  FiCopy,
  FiShare2,
  FiSave,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiEdit2,
} from "react-icons/fi";
import { HiLink } from "react-icons/hi";
import { MdArrowOutward } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import DeleteContent from "./ContentTypes/Edit/Delete/DeleteContent.jsx";
import RichTextEditor from "./ContentTypes/Add/RichTextEditor.jsx";
import { formatYouTubeIframe } from "../../../../../../utils/formatYouTubeIframe.js";
import { AddContentDivider } from "../TopicPage.jsx";
import axiosInstance from "../../../../../../utils/axiosInstance.js";

const ShowContent = ({ contentBlocks, courseId, topicId, loadTopicData, onAddContent, onEditContent, readOnly }) => {
  const [savingContents, setSavingContents] = useState({});
  const [lastSavedTimes, setLastSavedTimes] = useState({});
  const [localContent, setLocalContent] = useState({});
  const saveTimeoutsRef = useRef({});
  const lastSavedContentRef = useRef({});
  console.log("contentBlocks : ", contentBlocks);


  const getContentIcon = (type) => {
    switch (type) {
      case "TEXT":
        return <FiFileText className="w-5 h-5 text-emerald-600" />;
      case "IMAGE":
        return <FiImage className="w-5 h-5 text-blue-600" />;
      case "VIDEO":
        return <FiVideo className="w-5 h-5 text-purple-600" />;
      case "AUDIO":
        return <FiMusic className="w-5 h-5 text-amber-600" />;
      case "LINK":
        return <FiLink className="w-5 h-5 text-cyan-600" />;
      case "FILE":
        return <FiFile className="w-5 h-5 text-gray-600" />;
      case "DOCS":
        return <FiFileText className="w-5 h-5 text-red-600" />;
      case "EMBED":
        return <FiCode className="w-5 h-5 text-indigo-600" />;
      case "MCQ":
        return <FiHelpCircle className="w-5 h-5 text-green-600" />;
      case "DISCUSSION":
        return <FiMessageSquare className="w-5 h-5 text-pink-600" />;
      case "UPLOAD":
        return <FiUploadCloud className="w-5 h-5 text-teal-600" />;
      default:
        return <FiFileText className="w-5 h-5 text-gray-600" />;
    }
  };

  // API function to update text content
  const updateTextContent = useCallback(
    async (contentId, content, textName = "Text Content") => {
      try {
        const response = await axiosInstance.patch(
          `/courses/${courseId}/topics/${topicId}/content/${contentId}/text`,
          {
            content,
            textName,
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

  // Debounced auto-save function
  const debouncedAutoSave = useCallback(
    (contentId, content) => {
      // Clear existing timeout
      if (saveTimeoutsRef.current[contentId]) {
        clearTimeout(saveTimeoutsRef.current[contentId]);
      }

      // Don't save if content hasn't changed
      if (content === lastSavedContentRef.current[contentId]) {
        return;
      }

      // Set saving status
      setSavingContents((prev) => ({
        ...prev,
        [contentId]: "saving",
      }));

      // Set new timeout for auto-save
      saveTimeoutsRef.current[contentId] = setTimeout(async () => {
        try {
          const result = await updateTextContent(contentId, content);

          if (result.success) {
            // Update saved content reference
            lastSavedContentRef.current[contentId] = content;

            // Update status
            setSavingContents((prev) => ({
              ...prev,
              [contentId]: "saved",
            }));

            // Update last saved time
            setLastSavedTimes((prev) => ({
              ...prev,
              [contentId]: new Date(),
            }));

            // Clear saved status after 2 seconds
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
      }, 2000); // 2 second delay
    },
    [updateTextContent]
  );

  // Handle manual save
  const handleManualSave = useCallback(
    async (contentId) => {
      const content = localContent[contentId];
      if (!content) return;

      // Clear any pending auto-save
      if (saveTimeoutsRef.current[contentId]) {
        clearTimeout(saveTimeoutsRef.current[contentId]);
      }

      // Set saving status
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

          // Clear saved status after 2 seconds
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

  // Format time for display
  const formatTime = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Handle editor content change
  const handleEditorChange = useCallback(
    (contentId, newContent) => {
      // Update local content
      setLocalContent((prev) => ({
        ...prev,
        [contentId]: newContent,
      }));

      // Trigger debounced auto-save
      debouncedAutoSave(contentId, newContent);
    },
    [debouncedAutoSave]
  );

  // Initialize last saved content ref
  React.useEffect(() => {
    contentBlocks.forEach((block) => {
      if (block.type === "TEXT" && block.data?.content) {
        lastSavedContentRef.current[block._id] = block.data.content;
      }
    });
  }, [contentBlocks]);



  // Helper functions for audio block
  const formatDuration = (seconds) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div>
      {contentBlocks.map((block, index) => (
        <React.Fragment key={block._id}>
          {/* Content Block */}
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
                      {/* Save Status Indicator */}
                      {block.type === "TEXT" && savingContents[block._id] && !readOnly && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`text-xs font-medium px-2 py-1 rounded-full ${savingContents[block._id] === "saving"
                            ? "bg-amber-100 text-amber-700"
                            : savingContents[block._id] === "saved"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                            }`}
                        >
                          {savingContents[block._id] === "saving" &&
                            "Saving..."}
                          {savingContents[block._id] === "saved" && "Saved"}
                          {savingContents[block._id] === "error" && "Failed"}
                        </motion.span>
                      )}
                    </div>
                    {block.data?.title && (
                      <p className="text-sm text-emerald-900 font-medium">
                        {block.data.title}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!readOnly && (
                    <>
                      {/* Manual Save Button for TEXT content */}
                      {block.type === "TEXT" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleManualSave(block._id)}
                          disabled={savingContents[block._id] === "saving"}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${savingContents[block._id] === "saving"
                            ? "bg-amber-100 text-amber-700 cursor-not-allowed"
                            : savingContents[block._id] === "saved"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                        >
                          {savingContents[block._id] === "saving" ? (
                            <>
                              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                              <span className="text-sm font-medium">Saving...</span>
                            </>
                          ) : savingContents[block._id] === "saved" ? (
                            <>
                              <FiCheck className="w-4 h-4" />
                              <span className="text-sm font-medium">Saved</span>
                            </>
                          ) : (
                            <>
                              <FiSave className="w-4 h-4" />
                              <span className="text-sm font-medium">Save</span>
                            </>
                          )}
                        </motion.button>
                      )}

                      {/* Edit Button for all content types */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditContent && onEditContent(block);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-all duration-300 cursor-pointer"
                        title="Edit Content"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        {/* <span className="text-sm font-medium hidden sm:inline">Edit</span> */}
                      </motion.button>

                      <DeleteContent
                        courseId={courseId}
                        topicId={topicId}
                        contentId={block._id}
                        onDeleted={loadTopicData}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Block Content */}
              <div className="p-4 md:p-6">
                {block.type === "TEXT" && block.data && (
                  <div className="relative">
                    {/* Save Status Bar */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${savingContents[block._id] === "saving"
                              ? "bg-amber-500 animate-pulse"
                              : savingContents[block._id] === "saved"
                                ? "bg-emerald-500"
                                : savingContents[block._id] === "error"
                                  ? "bg-rose-500"
                                  : "bg-emerald-300"
                              }`}
                          />
                          <span className="text-sm font-medium text-emerald-700">
                            {savingContents[block._id] === "saving" &&
                              "Auto-saving..."}
                            {savingContents[block._id] === "saved" &&
                              "All changes saved"}
                            {savingContents[block._id] === "error" &&
                              "Failed to save"}
                            {!savingContents[block._id] && "All changes saved"}
                          </span>
                        </div>

                        {lastSavedTimes[block._id] && (
                          <div className="flex items-center gap-1 text-xs text-emerald-600">
                            <FiClock className="w-3 h-3" />
                            <span>
                              Last saved {formatTime(lastSavedTimes[block._id])}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Word Count */}
                      {localContent[block._id] && (
                        <div className="text-xs text-emerald-600">
                          {
                            localContent[block._id].replace(/<[^>]*>/g, "")
                              .length
                          }{" "}
                          characters
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-emerald-900 mb-3">
                      {block?.data?.textName || "Text Content"}
                    </h3>

                    <div className="border border-emerald-200 rounded-xl overflow-hidden">
                      <RichTextEditor
                        value={
                          localContent[block._id] || block.data.content || ""
                        }
                        onChange={(newContent) =>
                          handleEditorChange(block._id, newContent)
                        }
                        onSave={() => handleManualSave(block._id)}
                        height={400}
                        disabled={readOnly}
                        placeholder="Start typing your content here..."
                        isDarkMode={false}
                      />
                    </div>

                    {/* Save Tips */}
                    {!readOnly && (
                      <div className="mt-4 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                        <p className="text-sm text-emerald-600 flex items-center gap-2">
                          <FiAlertCircle className="w-4 h-4" />
                          <span>
                            Content auto-saves every 2 seconds. Press Ctrl+S to
                            manually save.
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {block.type === "IMAGE" && block.data && (
                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-2xl rounded-xl overflow-hidden">
                      <img
                        src={block.data.src || block.data.url}
                        alt={block.data.alt || "Content image"}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    {block.data.alt && (
                      <p className="mt-3 text-sm text-emerald-600 text-center">
                        {block.data.alt}
                      </p>
                    )}
                  </div>
                )}

                {block.type === "VIDEO" && block.data && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-emerald-900">
                        {block.data.title || "Video"}
                      </h3>
                      {block.data.description && (
                        <p className="text-emerald-600 mt-1">
                          {block.data.description}
                        </p>
                      )}
                    </div>
                    <div className="rounded-xl overflow-hidden border border-emerald-200">
                      {block.data.videoType === "src" ? (
                        <video
                          controls
                          className="w-full"
                          src={
                            block.data.video || block.data.src || block.data.url
                          }
                        />
                      ) : (
                        <div
                          className="w-full h-auto flex justify-center items-center aspect-video"
                          dangerouslySetInnerHTML={{
                            __html: formatYouTubeIframe(block.data.embed),
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* AUDIO Section */}
                {block.type === "AUDIO" && block.data && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-emerald-900">
                        {block.data.title || "Audio Content"}
                      </h3>
                      {block.data.description && (
                        <p className="text-emerald-600 mt-1">
                          {block.data.description}
                        </p>
                      )}
                    </div>

                    <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Audio Visualizer/Icon */}
                        <div className="flex-shrink-0 ">
                          <div className="w-20 h-20 mx-auto rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                            <svg
                              className="w-10 h-10 text-emerald-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Audio Player */}
                        <div className="flex-grow">
                          <div className="space-y-4">
                            <audio
                              controls
                              className="w-full h-12"
                              src={block.data.src || block.data.url}
                            >
                              Your browser does not support the audio element.
                            </audio>

                            {/* Audio Metadata */}
                            {(block.data.duration || block.data.fileSize) && (
                              <div className="flex flex-wrap gap-4 text-sm text-emerald-500">
                                {block.data.duration && (
                                  <div className="flex items-center gap-1">
                                    <svg
                                      className="w-4 h-4"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    <span>
                                      {formatDuration(block.data.duration)}
                                    </span>
                                  </div>
                                )}
                                {block.data.fileSize && (
                                  <div className="flex items-center gap-1">
                                    <svg
                                      className="w-4 h-4"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    <span>
                                      {formatFileSize(block.data.fileSize)}
                                    </span>
                                  </div>
                                )}
                                {block.data.format && (
                                  <div className="flex items-center gap-1">
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium">
                                      {block.data.format.toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {block.type === "LINK" && block.data && (
                  <div className="space-y-3">
                    {block.data.isButton ? (
                      // Button-style link
                      <div className="w-full">
                        <a
                          href={block.data.href}
                          target={
                            block.data.openType === "new" ? "_blank" : "_self"
                          }
                          rel={
                            block.data.openType === "new"
                              ? "noopener noreferrer"
                              : ""
                          }
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg border-2 border-emerald-600 hover:border-emerald-700"
                        >
                          <HiLink className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />

                          <span>{block.data.title || "Open Link"}</span>

                          {block.data.openType === "new" && (
                            <MdArrowOutward
                              FaArrowUpRightDots
                              className="w-4 h-4"
                            />
                          )}
                        </a>
                      </div>
                    ) : (
                      // Text-style link
                      <div className="group">
                        <a
                          href={block.data.href}
                          target={
                            block.data.openType === "new" ? "_blank" : "_self"
                          }
                          rel={
                            block.data.openType === "new"
                              ? "noopener noreferrer"
                              : ""
                          }
                          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-medium transition-colors duration-200 text-2xl"
                        >
                          <HiLink className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />

                          <span className="underline decoration-2 decoration-emerald-300 group-hover:decoration-emerald-500 transition-colors duration-200">
                            {block.data.title || block.data.href}
                          </span>

                          {block.data.openType === "new" && (
                            <FiExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          )}
                        </a>

                        {block.data.href && block.data.title && (
                          <p className="mt-1 text-xs text-emerald-500 truncate">
                            {block.data.href}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Optional description */}
                    {block.data.description && (
                      <p className="text-sm text-emerald-600 mt-2">
                        {block.data.description}
                      </p>
                    )}
                  </div>
                )}

                {block.type === "DOCS" && block.data && (
                  <div className="space-y-4">
                    {/* Header with icon and title */}
                    <div className="md:px-3">
                      <div className="flex gap-4 justify-center md:justify-start items-center mb-2 sm:pb-3">
                        <div className="">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                            <FaFileAlt className="w-6 h-6 text-emerald-600" />
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-emerald-90 h-full">
                          {block.data.title || "Document"}
                        </h3>
                      </div>
                      {block.data.description && (
                        <p className="text-emerald-600 mt-1 text-justify">
                          {block.data.description}
                        </p>
                      )}
                    </div>
                    {/* Google Docs Embed Frame */}
                    <div className="mt-4">
                      <div className="rounded-xl border border-emerald-200 overflow-hidden bg-emerald-50">
                        {/* Frame Header */}
                        <div className="bg-gradient-to-r from-emerald-100 to-emerald-50 px-4 py-3 border-b border-emerald-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          {/* Left section */}
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-10 h-10 p-1 flex-shrink-0 rounded-lg bg-white flex items-center justify-center">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/1147px-Google_Drive_icon_%282020%29.svg.png" />
                            </div>

                            <span className="font-medium text-emerald-800 truncate">
                              {block.data.title || "Google Document"}
                            </span>
                          </div>

                          {/* Action button */}
                          <a
                            href={block.data.src.replace("/preview", "")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 font-medium rounded-lg border border-emerald-200 transition-all duration-200 text-sm w-full sm:w-auto"
                          >
                            <FiExternalLink className="w-4 h-4" />
                            Open Full View
                          </a>
                        </div>

                        {/* Docs Embed Container */}
                        <div
                          className="relative w-full"
                          style={{ paddingBottom: "56.25%" }}
                        >
                          <iframe
                            src={block.data.src}
                            className="absolute top-0 left-0 w-full h-full border-0"
                            title={block.data.title || "Document Preview"}
                            loading="lazy"
                            allowFullScreen
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-emerald-100">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            block.data.src.replace("/preview", "")
                          );
                          // Show success message
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-700 font-medium rounded-lg border border-emerald-200 transition-colors duration-200 cursor-pointer"
                      >
                        <FiCopy className="w-5 h-5" />
                        Copy Link
                      </button>

                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: block.data.title,
                              text: block.data.description,
                              url: block.data.src.replace("/preview", ""),
                            });
                          }
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-700 font-medium rounded-lg border border-emerald-200 transition-colors duration-200 cursor-pointer"
                      >
                        <FiShare2 className="w-5 h-5" />
                        Share
                      </button>
                    </div>
                  </div>
                )}

                {block.type === "EMBED" && block.data && (
                  <div className="space-y-4">
                    {/* Optional title / description */}
                    {(block.data.title || block.data.description) && (
                      <div>
                        {block.data.title && (
                          <h3 className="text-xl font-bold text-emerald-900">
                            {block.data.title}
                          </h3>
                        )}
                        {block.data.description && (
                          <p className="text-emerald-600 mt-1">
                            {block.data.description}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Embed Output Card */}
                    <div className="border border-emerald-200 rounded-2xl bg-emerald-50 overflow-hidden">
                      <div className="flex justify-center">
                        <div
                          className="max-w-full"
                          dangerouslySetInnerHTML={{
                            __html: block.data.code,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {block.type === "FILE" && block.data && (
                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-4xl rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-emerald-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M8 2a1 1 0 00-1 1v12a1 1 0 002 0V3a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v12a1 1 0 002 0V3a1 1 0 00-1-1z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-lg font-medium text-emerald-900 truncate">
                            {"File"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          window.open(block.data, "_blank");
                        }}
                        className="px-3 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition cursor-pointer cursor-pointer"
                      >
                        Download File
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Add Content Button after this block (next order = block.order + 1) */}
          <AddContentDivider
            onAdd={() => onAddContent && onAddContent(block.order + 1)}
            label={`Add content after this ${block.type.toLowerCase()}`}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default ShowContent;
