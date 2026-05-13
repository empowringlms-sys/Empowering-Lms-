// src/components/ContentBuilder/ContentTypes/Edit/EditVideoModal.js
import React, { useState, useEffect } from "react";
import { FiVideo } from "react-icons/fi";

const EditVideoModal = ({ content, onClose, onSave }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (content && content.data) {
      setVideoUrl(content.data.video || content.data.src || content.data.url || "");
      setTitle(content.data.title || "");
      setDescription(content.data.description || "");
    }
  }, [content]);

  const handleSave = () => {
    if (!videoUrl.trim()) {
      alert("Video URL is required");
      return;
    }
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    onSave({
      video: videoUrl.trim(),
      title: title.trim(),
      description: description.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded shadow-xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3 border-b">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <FiVideo /> Edit Video
          </h3>
          <button onClick={onClose} className="text-xl text-gray-500 hover:text-gray-700">×</button>
        </div>

        <div className="px-5 py-5 overflow-y-auto max-h-[70vh]">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Video URL *</label>
            <input
              type="text"
              placeholder="Enter video URL (YouTube, Vimeo, or direct MP4 link)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              placeholder="Enter video description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm h-24"
            />
          </div>

          {videoUrl && (
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Preview</label>
              <video
                src={videoUrl}
                controls
                className="w-full max-h-64 rounded-lg border"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 border-t">
          <button onClick={onClose} className="border px-4 py-1.5 rounded hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-sky-600 text-white px-4 py-1.5 rounded hover:bg-sky-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditVideoModal;