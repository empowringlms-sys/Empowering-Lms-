import React, { useState } from "react";
import { FiX } from "react-icons/fi";

const AddDiscussionModal = ({ onClose, onAdd, initialData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [notifyAdmins, setNotifyAdmins] = useState(false);
  const [notifyMe, setNotifyMe] = useState(false);

  const [adding, setAdding] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      if (initialData.notifyAdmins !== undefined) setNotifyAdmins(initialData.notifyAdmins);
      if (initialData.notifyMe !== undefined) setNotifyMe(initialData.notifyMe);
    }
  }, [initialData]);

  const handleAdd = () => {
    if (!title.trim()) {
      alert("Discussion name is required");
      return;
    }

    setAdding(true);

    // 🔥 SEND DATA TO TextEditor
    onAdd({
      title,
      description,
      notifyAdmins,
      notifyMe,
      comments: initialData?.comments || [],
    });

    // ✅ LMS style delay
    setTimeout(() => {
      setAdding(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">{initialData ? 'Edit Discussion' : 'Add a Discussion'}</h2>
          <button onClick={onClose} disabled={adding}>
            <FiX />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 text-sm">

          <p className="text-gray-500">
            Discussions enable learners to chat with each other. As the course
            owner you can add comments, delete comments and reply to comments.
          </p>

          {/* NAME */}
          <div>
            <label className="font-medium block mb-1">
              Discussion Name
            </label>
            <p className="text-xs text-gray-400 mb-1">
              Enter a name for the discussion.
            </p>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="E.g. 'Group Discussion'"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="font-medium block mb-1">
              Discussion Description
            </label>
            <p className="text-xs text-gray-400 mb-1">
              Provide further instructions for people who will contribute to the discussion.
            </p>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={4}
              placeholder="A description for this discussion"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* NOTIFY ADMINS */}
          <div>
            <label className="font-medium block mb-1">
              Notify Administrators
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Administrators with permissions over this course will receive an email
              notification when a learner responds to this discussion.
            </p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={notifyAdmins}
                onChange={(e) => setNotifyAdmins(e.target.checked)}
              />
              Notify administrators by email
            </label>
          </div>

          {/* NOTIFY ME */}
          <div>
            <label className="font-medium block mb-1">
              Email Notifications
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Receive an email each time a learner comments on this discussion.
            </p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={notifyMe}
                onChange={(e) => setNotifyMe(e.target.checked)}
              />
              Notify me by email
            </label>
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            disabled={adding}
            className="border px-4 py-1.5 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleAdd}
            disabled={adding}
            className="bg-sky-600 text-white px-5 py-1.5 rounded"
          >
            {adding ? (initialData ? "Saving..." : "Adding...") : (initialData ? "Save Changes" : "Add Discussion")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDiscussionModal;
