import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMusic, FiX, FiFile, FiUpload, FiHeadphones } from "react-icons/fi";
import toast from "react-hot-toast";
import MediaPickerModal from "../../../../../../../modules/media-files/MediaPickerModal";
import useMediaPicker from "../../../../../../../modules/media-files/useMediaPicker";

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

const uploadBoxVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

const AddAudioInTopicModal = ({ onClose, onAdd, initialData }) => {
  const { isOpen, openMediaPicker, closeMediaPicker } = useMediaPicker();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Initialize with data if editing
  React.useEffect(() => {
    if (initialData) {
      if (initialData.title) setTitle(initialData.title);
      if (initialData.description) setDescription(initialData.description);
      if (initialData.src || initialData.url) {
        setSelectedAudio({
          src: initialData.src || initialData.url,
          name: 'Current Audio',
          // We might not have size
        });
      }
    }
  }, [initialData]);

  /* ================= OPEN MEDIA PICKER ================= */
  const handleOpenMediaPicker = async () => {
    try {
      const audioFile = await openMediaPicker({
        allowedTypes: "audio",
        title: "Select Audio File",
        showUpload: true,
        multiSelect: false,
        preselectedFile: selectedAudio,
      });

      if (audioFile) {
        setSelectedAudio(audioFile);
        toast.success("Audio selected successfully!");
      }
    } catch (error) {
      console.error("Error selecting audio:", error);
      toast.error("Failed to select audio");
    }
  };

  /* ================= ADD AUDIO ================= */
  const handleAddAudio = async () => {
    if (!title.trim()) {
      toast.error("Audio title is required");
      return;
    }

    if (!selectedAudio) {
      toast.error("Please select an audio file");
      return;
    }

    setUploading(true);
    await onAdd({
      src: selectedAudio.src,
      title: title,
      description: description,
    });
    setUploading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && selectedAudio && title.trim()) {
      e.preventDefault();
      handleAddAudio();
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
            {/* ===== HEADER ===== */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <FiMusic className="text-emerald-600 text-lg" />
                </div>
                <h3 className="font-semibold text-gray-800">{initialData ? 'Edit Audio' : 'Add Audio'}</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 transition cursor-pointer p-1 hover:bg-gray-100 rounded-lg"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* ===== BODY ===== */}
            <div className="px-6 py-5 space-y-5">
              {/* TITLE */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">
                  Audio Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter audio title"
                  value={title}
                  autoFocus
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="
                    w-full rounded-xl border border-gray-200 
                    px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-emerald-300
                    transition
                  "
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Optional description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="
                    w-full rounded-xl border border-gray-200 
                    px-4 py-3 text-sm resize-none
                    focus:outline-none focus:ring-2 focus:ring-emerald-300
                    transition
                  "
                />
              </div>

              {/* AUDIO SELECTION */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Audio File <span className="text-red-500">*</span>
                </label>

                {selectedAudio ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-2 border-emerald-100 rounded-xl p-4 bg-emerald-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <FiHeadphones className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {selectedAudio.name || "Audio File"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedAudio.size
                              ? `${(selectedAudio.size / 1024 / 1024).toFixed(
                                1
                              )} MB`
                              : "Ready to add"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedAudio(null);
                          toast.success("Audio removed");
                        }}
                        className="
                          text-sm text-red-500 hover:text-red-700 
                          transition cursor-pointer px-3 py-1
                          hover:bg-red-50 rounded-lg
                        "
                      >
                        Remove
                      </button>
                    </div>

                    {selectedAudio.src && (
                      <div className="mt-3">
                        <audio
                          controls
                          src={selectedAudio.src}
                          className="w-full rounded-lg bg-white"
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-emerald-600">
                            Audio ready to play
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    variants={uploadBoxVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleOpenMediaPicker}
                    className="
                      w-full border-2 border-dashed border-gray-200 
                      rounded-xl p-8 text-center cursor-pointer
                      bg-gradient-to-br from-gray-50 to-white
                      hover:border-emerald-300 hover:bg-emerald-50/30
                      transition-all duration-300 relative
                      overflow-hidden group
                    "
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

                    <div className="relative">
                      <div
                        className="
                        w-16 h-16 mx-auto mb-4 rounded-full 
                        bg-gradient-to-br from-emerald-100 to-emerald-50
                        border-2 border-emerald-200 flex items-center justify-center
                        group-hover:scale-110 group-hover:border-emerald-300
                        transition-all duration-300
                      "
                      >
                        <FiUpload className="text-2xl text-emerald-500 group-hover:text-emerald-600" />
                      </div>
                      <p className="font-medium text-gray-700 mb-1 group-hover:text-emerald-700 transition-colors">
                        Select Audio File
                      </p>
                      <span className="text-sm text-gray-500 group-hover:text-gray-600">
                        Click to choose from Media Library
                      </span>
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          MP3
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          WAV
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          AAC
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <p className="text-xs text-gray-400 mt-2">
                  Supported formats: MP3, WAV, AAC, OGG, FLAC, M4A
                </p>
              </div>
            </div>

            {/* ===== FOOTER ===== */}
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button
                onClick={onClose}
                className="
                  px-4 py-2 rounded-lg text-sm 
                  bg-gray-100 border border-gray-300 
                  text-gray-600 hover:bg-gray-200 
                  transition cursor-pointer
                "
              >
                Cancel
              </button>

              <button
                onClick={handleAddAudio}
                disabled={!selectedAudio || !title.trim() || uploading}
                className="
                  px-5 py-2 rounded-lg text-sm font-medium
                  bg-emerald-500 hover:bg-emerald-600 text-white
                  transition disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center min-w-[110px] cursor-pointer
                  disabled:hover:bg-emerald-500
                "
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    {initialData ? 'Saving...' : 'Adding...'}
                  </span>
                ) : (
                  initialData ? 'Save Changes' : 'Add Audio'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* ===== MEDIA PICKER MODAL ===== */}
      {isOpen && (
        <MediaPickerModal
          isOpen={isOpen}
          onClose={closeMediaPicker}
          onSelect={(file) => {
            setSelectedAudio(file);
            closeMediaPicker();
          }}
          allowedTypes="audio"
          title="Select Audio File"
          showUpload={true}
          multiSelect={false}
          preselectedFile={selectedAudio}
        />
      )}
    </>
  );
};

export default AddAudioInTopicModal;
