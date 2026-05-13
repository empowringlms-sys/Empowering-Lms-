import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiVideo, FiX, FiYoutube, FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";
import MediaPickerModal from "../../../../../../../../modules/media-files/MediaPickerModal";
import useMediaPicker from "../../../../../../../../modules/media-files/useMediaPicker";
import { IoMdCloseCircleOutline } from "react-icons/io";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 16,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const AddVideoInTopic = ({ onClose, onAdd, loading, initialData }) => {
  const { isOpen, openMediaPicker, closeMediaPicker } = useMediaPicker();

  const [activeTab, setActiveTab] = useState("UPLOAD"); // "UPLOAD" or "EMBED"

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Initialize with data if editing
  React.useEffect(() => {
    if (initialData) {
      if (initialData.title) setTitle(initialData.title);
      if (initialData.description) setDescription(initialData.description);

      if (initialData.videoType === 'embed') {
        setActiveTab('EMBED');
        if (initialData.embed) setEmbedCode(initialData.embed);
      } else {
        // Assume src/upload if not embed
        setActiveTab('UPLOAD');
        if (initialData.src || initialData.url || initialData.video) {
          setSelectedVideo({
            src: initialData.src || initialData.url || initialData.video,
            name: 'Current Video',
            // We might not have size, but that's okay for display
          });
        }
      }
    }
  }, [initialData]);

  /* ================= OPEN MEDIA PICKER ================= */
  const handleOpenMediaPicker = async () => {
    try {
      const videoFile = await openMediaPicker({
        allowedTypes: "video",
        title: "Select Video File",
        showUpload: true,
        multiSelect: false,
        preselectedFile: selectedVideo, // Pass current video if any
      });

      if (videoFile) {
        setSelectedVideo(videoFile);
      }
    } catch (error) {
      console.error("Error selecting video:", error);
      toast.error("Failed to select video");
    }
  };

  /* ================= SUBMIT ================= */
  const handleAddVideo = () => {
    if (!title.trim()) {
      toast.error("Video title is required");
      return;
    }

    if (activeTab === "UPLOAD") {
      if (!selectedVideo) {
        toast.error("Please select a video file");
        return;
      }

      onAdd({
        title: title.trim(),
        description: description.trim(),
        videoType: "src",
        src: selectedVideo.src,
      });

      return;
    }

    if (activeTab === "EMBED") {
      if (!embedCode.trim()) {
        toast.error("Please enter embed code");
        return;
      }

      onAdd({
        title: title.trim(),
        description: description.trim(),
        videoType: "embed",
        embed: embedCode.trim(),
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center px-2"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden"
          >
            {/* HEADER */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg">
                  <FiVideo className="text-emerald-600 text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{initialData ? 'Edit Video' : 'Add Video'}</h3>
                  <p className="text-sm text-gray-500">
                    {initialData ? 'Update video details' : 'Add video content to your topic'}
                  </p>
                </div>
              </div>
              <div
                onClick={onClose}
                className="text-xl font-bold group-hover:scale-110 transition-transform cursor-pointer  text-gray-600 hover:text-gray-700">
                <IoMdCloseCircleOutline size={25} />
              </div>
            </div>

            {/* CONTENT - Scrollable */}
            <div className="flex-1 overflow-y-auto max-h-[60vh] p-6">
              {/* Video Type Tabs */}
              <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                {[
                  { id: "UPLOAD", label: "Upload Video", icon: FiUpload },
                  { id: "EMBED", label: "Embed Video", icon: FiYoutube },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`
                      flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium 
                      transition-all duration-200 cursor-pointer
                      ${activeTab === tab.id
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                      }
                    `}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Title Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Video Title <span className="text-red-500">*</span>
                </label>
                <input
                  className="
                    w-full rounded-xl border border-gray-200 
                    px-4 py-3 text-sm text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent
                    transition placeholder-gray-400
                  "
                  placeholder="Enter a descriptive video title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Description
                </label>
                <textarea
                  className="
                    w-full rounded-xl border border-gray-200 
                    px-4 py-3 text-sm text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent
                    transition placeholder-gray-400 resize-none
                  "
                  rows={3}
                  placeholder="Add a brief description about the video (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Video Content Section */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600 mb-3">
                  {activeTab === "UPLOAD" ? "Video File" : "Embed Code"}{" "}
                  <span className="text-red-500">*</span>
                </label>

                {/* Upload Video Tab */}
                {activeTab === "UPLOAD" && (
                  <div className="space-y-4">
                    {selectedVideo ? (
                      <div className="border-2 border-emerald-500 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-50/50 to-white">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <FiVideo className="text-white text-sm" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                  {selectedVideo.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {selectedVideo.size
                                    ? `${(
                                      selectedVideo.size /
                                      (1024 * 1024)
                                    ).toFixed(2)} MB`
                                    : "Video file"}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedVideo(null)}
                              className="
                                text-xs font-medium text-rose-600 hover:text-rose-700 
                                px-3 py-1.5 hover:bg-rose-50 rounded-lg transition cursor-pointer
                              "
                            >
                              Remove
                            </button>
                          </div>

                          {/* Video Preview */}
                          <div className="mt-3 rounded-lg overflow-hidden bg-gray-900">
                            <video
                              src={selectedVideo.src}
                              controls
                              className="w-full h-auto max-h-48 object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={handleOpenMediaPicker}
                        className="
                          w-full border-2 border-dashed border-gray-300 rounded-xl p-8 
                          text-center hover:bg-gray-50 hover:border-emerald-400 
                          transition-all duration-200 cursor-pointer group
                        "
                      >
                        <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FiUpload className="text-xl text-emerald-600" />
                        </div>
                        <p className="font-medium text-gray-900 mb-1">
                          Select Video
                        </p>
                        <p className="text-sm text-gray-500">
                          Choose from media library or upload a new video
                        </p>
                      </button>
                    )}
                  </div>
                )}

                {/* Embed Video Tab */}
                {activeTab === "EMBED" && (
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <textarea
                        className="
                          w-full p-4 focus:outline-none text-gray-900 
                          placeholder-gray-400 resize-none font-mono text-sm
                          bg-gray-50
                        "
                        rows={5}
                        placeholder='Paste your embed code here...
Example: <iframe width="560" height="315" src="https://www.youtube.com/embed/..." frameborder="0" allowfullscreen></iframe>'
                        value={embedCode}
                        onChange={(e) => setEmbedCode(e.target.value)}
                      />
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <FiYoutube className="text-amber-600 text-lg" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Embed Code Tips
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li className="flex items-start gap-2">
                            <span className="text-amber-500 mt-0.5">•</span>
                            <span>
                              YouTube: Copy embed code from "Share" → "Embed"
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-500 mt-0.5">•</span>
                            <span>
                              Vimeo: Copy embed code from "Share" → "Embed"
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-500 mt-0.5">•</span>
                            <span>
                              Ensure the iframe includes proper src attribute
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 px-6 pb-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="
                  px-4 py-2 rounded-lg text-sm 
                  bg-gray-100 border border-gray-300 text-gray-600 
                  hover:bg-gray-200 transition cursor-pointer
                "
              >
                Cancel
              </button>

              <button
                disabled={
                  loading ||
                  !title.trim() ||
                  (activeTab === "UPLOAD" && !selectedVideo) ||
                  (activeTab === "EMBED" && !embedCode.trim())
                }
                onClick={handleAddVideo}
                className="
                  px-5 py-2 rounded-lg text-sm font-medium
                  bg-emerald-500 hover:bg-emerald-600 text-white
                  transition disabled:opacity-50
                  flex items-center justify-center min-w-[150px] cursor-pointer
                "
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    {initialData ? 'Saving...' : 'Adding...'}
                  </span>
                ) : (
                  initialData ? 'Save Changes' : 'Add Video to Topic'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Media Picker Modal */}
      {isOpen && (
        <MediaPickerModal
          isOpen={isOpen}
          onClose={closeMediaPicker}
          onSelect={(file) => {
            setSelectedVideo(file);
            closeMediaPicker();
          }}
          allowedTypes="video"
          title="Select Video File"
          showUpload={true}
          multiSelect={false}
        />
      )}
    </>
  );
};

export default AddVideoInTopic;
