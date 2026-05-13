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
import { BsCheckCircle } from "react-icons/bs";
import AddTextFieldInTopicModal from "./ContentTypes/Add/AddTextFieldInTopicModal";
import AddVideoInTopic from "./ContentTypes/Add/videomodel/AddVideoInTopic";
import AddImageInTopic from "./ContentTypes/Add/AddImageInTopic";
import AddAudioInTopicModal from "./ContentTypes/Add/AddAudioInTopicModal";
import AddLinkInTopicModal from "./ContentTypes/Add/AddLinkInTopicModal";
import AddFileInTopicModal from "./ContentTypes/Add/AddFileInTopicModal";
import AddGoogleDocInTopicModal from "./ContentTypes/Add/AddGoogleDocInTopicModal";
import EmbedCodeModal from "./ContentTypes/Add/EmbedCodeModal";
import AddLearnerUploadModal from "./ContentTypes/Add/AddLearnerUploadModal";
import AddQuestionInTopicModal from "./ContentTypes/Add/AddQuestionInTopicModal";
import AddMCQModal from "./ContentTypes/Add/AddMCQModal";
import AddDiscussionModal from "./ContentTypes/Add/AddDiscussionModal";
import * as courseApi from "../../../../../../src/services/courseApi.js";
import { motion, AnimatePresence } from "framer-motion";

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

/* ===== ITEMS ===== */
const items = [
  {
    label: "Text Field",
    type: "TEXT",
    icon: <FiType />,
    color: "text-teal-500",
  },
  { label: "Image", type: "IMAGE", icon: <FiImage />, color: "text-sky-500" },
  { label: "Video", type: "VIDEO", icon: <FiVideo />, color: "text-gray-600" },
  {
    label: "Audio",
    type: "AUDIO",
    icon: <FiMusic />,
    color: "text-orange-400",
  },
  { label: "Link", type: "LINK", icon: <FiLink />, color: "text-cyan-500" },
  {
    label: "Files",
    type: "FILE",
    icon: <FiFolder />,
    color: "text-yellow-500",
  },
  {
    label: "Google Doc",
    type: "DOCS",
    icon: <HiOutlineDocumentText />,
    color: "text-blue-500",
  },
  {
    label: "Embed Code",
    type: "EMBED",
    icon: <FiCode />,
    color: "text-gray-700",
  },
];

const ContentBuilder = ({
  onClose,
  onSelect,
  courseId,
  topicId,
  insertOrder,
  editingContent,
}) => {
  // 🔥 KEY STATE
  const [hideBuilder, setHideBuilder] = useState(false);
  const [addingContent, setAddingContent] = useState(false);

  const [showTextModal, setShowTextModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showMCQModal, setShowMCQModal] = useState(false);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);

  // Auto-open modal if editing
  React.useEffect(() => {
    if (editingContent) {
      setHideBuilder(true);
      const type = editingContent.type;
      if (type === "TEXT") setShowTextModal(true);
      if (type === "VIDEO") setShowVideoModal(true);
      if (type === "IMAGE") setShowImageModal(true);
      if (type === "AUDIO") setShowAudioModal(true);
      if (type === "LINK") setShowLinkModal(true);
      if (type === "FILE") setShowFileModal(true);
      if (type === "DOCS") setShowDocModal(true);
      if (type === "EMBED") setShowEmbedModal(true);
      if (type === "UPLOAD") setShowUploadModal(true);
      if (type === "QNA") setShowQuestionModal(true);
      if (type === "MCQ") setShowMCQModal(true);
      if (type === "DISCUSSION") setShowDiscussionModal(true);
    }
  }, [editingContent]);

  // Unified content creation/update function
  const handleAddContent = async (contentType, contentData) => {
    try {
      setAddingContent(true);

      let response;

      if (editingContent) {
        // UPDATE EXISTING CONTENT
        const contentToUpdate = {
          type: contentType,
          data: contentData,
          // Maintain existing order or other fields if needed
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
        setShowVideoModal(false);
        setShowImageModal(false);
        setShowAudioModal(false);
        setShowLinkModal(false);
        setShowFileModal(false);
        setShowDocModal(false);
        setShowEmbedModal(false);
        setShowUploadModal(false);
        setShowQuestionModal(false);
        setShowMCQModal(false);
        setShowDiscussionModal(false);
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

  // Handle modal close with builder reset
  const handleModalClose = () => {
    setHideBuilder(false);
    onClose();
  };

  return (
    <>
      {/* ===== MAIN BUILDER ===== */}
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
              onClick={(e) => e.stopPropagation()} // 👈 prevent inside click
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
                      className="flex flex-col items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setHideBuilder(true);

                          if (item.type === "TEXT") setShowTextModal(true);
                          if (item.type === "VIDEO") setShowVideoModal(true);
                          if (item.type === "IMAGE") setShowImageModal(true);
                          if (item.type === "AUDIO") setShowAudioModal(true);
                          if (item.type === "LINK") setShowLinkModal(true);
                          if (item.type === "FILE") setShowFileModal(true);
                          if (item.type === "DOCS") setShowDocModal(true);
                          if (item.type === "EMBED") setShowEmbedModal(true);
                          if (item.type === "UPLOAD") setShowUploadModal(true);
                          if (item.type === "QNA") setShowQuestionModal(true);
                          if (item.type === "MCQ") setShowMCQModal(true);
                          if (item.type === "DISCUSSION")
                            setShowDiscussionModal(true);
                        }}
                      >
                        <div
                          className={`text-4xl flex items-center justify-center   ${item.color}`}
                        >
                          {item.icon}
                        </div>
                        <p className="text-sm text-gray-700 ">{item.label}</p>
                      </div>
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

      {/* ===== MODALS ===== */}
      {showTextModal && (
        <AddTextFieldInTopicModal
          onClose={() => {
            setShowTextModal(false);
            setHideBuilder(false);
            onClose();
          }}
          onAdd={(data) => handleAddContent("TEXT", data)}
          loading={addingContent}
        />
      )}

      {showVideoModal && (
        <AddVideoInTopic
          onClose={() => {
            setShowVideoModal(false);
            setHideBuilder(false);
            onClose();
          }}
          onAdd={(data) => handleAddContent("VIDEO", data)}
          loading={addingContent}
        />
      )}

      {showImageModal && (
        <AddImageInTopic
          onClose={() => {
            setShowImageModal(false);
            setHideBuilder(false);
            onClose();
          }}
          onAdd={(data) => handleAddContent("IMAGE", data)}
          loading={addingContent}
          initialData={editingContent?.data}
        />
      )}

      {showAudioModal && (
        <AddAudioInTopicModal
          onClose={() => {
            setShowAudioModal(false);
            setHideBuilder(false);
            onClose();
          }}
          onAdd={(data) => handleAddContent("AUDIO", data)}
          loading={addingContent}
          initialData={editingContent?.data}
        />
      )}

      {showLinkModal && (
        <AddLinkInTopicModal
          onClose={() => {
            setShowLinkModal(false);
            setHideBuilder(false);
            onClose();
          }}
          onAdd={(data) => handleAddContent("LINK", data)}
          loading={addingContent}
          initialData={editingContent?.data}
        />
      )}

      {showFileModal && (
        <AddFileInTopicModal
          onClose={() => {
            setShowFileModal(false);
            setHideBuilder(false);
            onClose();
          }}
          onAdd={(data) => handleAddContent("FILE", data)}
          loading={addingContent}
          initialData={editingContent?.data}
        />
      )}

      {showDocModal && (
        <AddGoogleDocInTopicModal
          onClose={() => {
            setShowDocModal(false);
            setHideBuilder(false);
            onClose();
          }}
          onAdd={(data) => handleAddContent("DOCS", data)}
          loading={addingContent}
          initialData={editingContent?.data}
        />
      )}

      {showEmbedModal && (
        <EmbedCodeModal
          onClose={() => {
            setShowEmbedModal(false);
            setHideBuilder(false);
            onClose();
          }}
          onAdd={(data) => handleAddContent("EMBED", data)}
          loading={addingContent}
          initialData={editingContent?.data}
        />
      )}

      {showUploadModal && (
        <AddLearnerUploadModal
          onClose={() => {
            setShowUploadModal(false);
            setHideBuilder(false);
            onClose();
          }}
          onAdd={(data) => handleAddContent("UPLOAD", data)}
          loading={addingContent}
          initialData={editingContent?.data}
        />
      )}

      {showQuestionModal && (
        <AddQuestionInTopicModal
          onClose={() => {
            setShowQuestionModal(false);
            setHideBuilder(false);
            onClose();
          }}
          onAdd={(data) => handleAddContent("QNA", data)}
          loading={addingContent}
          initialData={editingContent?.data}
        />
      )}

      {showMCQModal && (
        <AddMCQModal
          onClose={() => {
            setShowMCQModal(false);
            setHideBuilder(false);
            onClose();
          }}
          onAdd={(data) => handleAddContent("MCQ", data)}
          loading={addingContent}
          initialData={editingContent?.data}
        />
      )}

      {showDiscussionModal && (
        <AddDiscussionModal
          onClose={() => {
            setShowDiscussionModal(false);
            setHideBuilder(false);
            onClose();
          }}
          onAdd={(data) => handleAddContent("DISCUSSION", data)}
          loading={addingContent}
          initialData={editingContent?.data}
        />
      )}
    </>
  );
};

export default ContentBuilder;
