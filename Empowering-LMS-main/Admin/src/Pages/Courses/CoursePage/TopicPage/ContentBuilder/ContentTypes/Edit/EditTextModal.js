// src/components/ContentBuilder/ContentTypes/Edit/EditTextModal.js
import React, { useState, useEffect } from "react";

const EditTextModal = ({ content, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    if (content && content.data) {
      setTitle(content.data.title || "");
      setTextContent(content.data.content || "");
    }
  }, [content]);

  const handleSave = () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    onSave({
      title: title.trim(),
      content: textContent
    });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded shadow-xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3 border-b">
          <h3 className="font-semibold text-base">Edit Text Content</h3>
          <button onClick={onClose} className="text-xl text-gray-500 hover:text-gray-700">×</button>
        </div>

        <div className="px-5 py-5 overflow-y-auto max-h-[70vh]">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm h-64"
              placeholder="Enter your text content..."
            />
          </div>
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

export default EditTextModal;