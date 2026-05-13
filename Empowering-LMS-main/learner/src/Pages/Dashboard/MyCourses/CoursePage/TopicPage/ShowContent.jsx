// src/pages/learner/ShowContent.jsx
import React, { useState } from "react";
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
  FiClock,
} from "react-icons/fi";
import { HiLink } from "react-icons/hi";
import { MdArrowOutward } from "react-icons/md";
import { FaGoogleDrive } from "react-icons/fa";

const ShowContent = ({ contentBlocks, courseId, topicId }) => {
  const [activeVideo, setActiveVideo] = useState(null);

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
    <div className="space-y-8">
      {contentBlocks.map((block, index) => (
        <motion.div
          key={block._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="pb-2 border-b border-gray-100 last:border-0"
        >
          {/* Content Body - Direct Render without Box */}
          <div className="">
            {block.type === "TEXT" && block.data && (
              <div className="prose prose-emerald max-w-none">
                {block.data.title && (
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{block.data.title}</h3>
                )}
                <div
                  dangerouslySetInnerHTML={{
                    __html: block.data.content || ""
                  }}
                  className="text-gray-700 leading-relaxed mx-6 my-6"
                />
              </div>
            )}

            {block.type === "IMAGE" && block.data && (
              <div className="flex flex-col items-center my-4 mt-8">
                <div className="max-w-3xl w-full rounded-xl overflow-hidden shadow-sm">
                  <img
                    src={block.data.src || block.data.url}
                    alt={block.data.alt || "Learning image"}
                    className="w-full h-auto object-contain"
                    loading="lazy"
                  />
                </div>
                {block.data.alt && (
                  <p className="mt-3 text-sm text-gray-500 text-center italic">
                    {block.data.alt}
                  </p>
                )}
              </div>
            )}

            {block.type === "VIDEO" && block.data && (
              <div className="space-y-4 my-4">
                {block.data.title && (
                  <h3 className="text-lg font-bold text-gray-900">{block.data.title}</h3>
                )}
                <div className="rounded-xl overflow-hidden shadow-sm bg-black max-w-4xl mx-auto">
                  {block.data.videoType === "src" ? (
                    <div className="relative">
                      <video
                        controls
                        className="w-full max-h-[600px]"
                        src={block.data.video || block.data.src || block.data.url}
                        onPlay={() => setActiveVideo(block._id)}
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${block.data.embed}?rel=0`}
                        className="absolute top-0 left-0 w-full h-full"
                        title={block.data.title || "Video content"}
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {block.type === "AUDIO" && block.data && (
              <div className="space-y-4 my-4">
                <div className="bg-emerald-50 rounded-xl p-4 md:p-6 border border-emerald-100/50 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
                    <FiMusic className="text-emerald-500 w-8 h-8" />
                  </div>
                  {block.data.title && (
                    <h4 className="font-semibold text-gray-900 mb-2">{block.data.title}</h4>
                  )}
                  <audio
                    controls
                    className="w-full max-w-md h-12"
                    src={block.data.src || block.data.url}
                  />
                </div>
              </div>
            )}

            {block.type === "LINK" && block.data && (
              <div className="my-4">
                <a
                  href={block.data.href}
                  target={block.data.openType === "new" ? "_blank" : "_self"}
                  rel={block.data.openType === "new" ? "noopener noreferrer" : ""}
                  className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 rounded-xl transition-all duration-200 group max-w-3xl mx-auto"
                >
                  <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0 text-emerald-600">
                    <HiLink className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 group-hover:text-emerald-700 truncate">{block.data.title || "External Resource"}</div>
                    {block.data.description && (
                      <div className="text-sm text-gray-500 group-hover:text-emerald-600/80 truncate">
                        {block.data.description}
                      </div>
                    )}
                  </div>
                  <MdArrowOutward className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              </div>
            )}

            {block.type === "DOCS" && block.data && (
              <div className="space-y-4 my-4">
                {block.data.title && (
                  <h3 className="text-lg font-semibold text-gray-900">{block.data.title}</h3>
                )}
                <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="relative w-full" style={{ paddingBottom: "75%" }}>
                    <iframe
                      src={block.data.src}
                      className="absolute top-0 left-0 w-full h-full border-0"
                      title={block.data.title || "Document Preview"}
                      loading="lazy"
                      allowFullScreen
                    />
                  </div>
                </div>
                <div className="text-center">
                  <a
                    href={block.data.src.replace("/preview", "")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm hover:underline"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    Open Document in New Tab
                  </a>
                </div>
              </div>
            )}

            {block.type === "EMBED" && block.data && (
              <div className="space-y-4 my-4">
                <div className="border border-gray-100 rounded-xl bg-gray-50 overflow-hidden p-4 flex justify-center">
                  <div
                    className="max-w-full overflow-auto"
                    dangerouslySetInnerHTML={{
                      __html: block.data.code,
                    }}
                  />
                </div>
              </div>
            )}

            {block.type === "FILE" && block.data && (
              <div className="my-4 max-w-md">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
                    <FiFile className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">Downloadable Resource</p>
                    {block.data.fileSize && (
                      <p className="text-sm text-gray-500">
                        {formatFileSize(block.data.fileSize)}
                      </p>
                    )}
                  </div>
                  <a
                    href={block.data}
                    download
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Download
                  </a>
                </div>
              </div>
            )}

            {block.type === "MCQ" && block.data && (
              <div className="my-6 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <FiHelpCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Quiz: {block.data.title || "Knowledge Check"}</h3>
                </div>
                <p className="text-gray-600 mb-6">{block.data.description || "Test your understanding of this topic."}</p>
                <button className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                  Start Quiz
                </button>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ShowContent;