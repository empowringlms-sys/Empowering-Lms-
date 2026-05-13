import { useState } from "react";
import { FiX } from "react-icons/fi";

export default function AddLearnerUploadModal({ onClose, onAdd, initialData }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mandatory, setMandatory] = useState(false);
  const [notifyAdmins, setNotifyAdmins] = useState(false);
  const [notifyMe, setNotifyMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize state from initialData if editing
  useState(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setMandatory(initialData.mandatory || false);
      setNotifyAdmins(initialData.notifyAdmins || false);
      setNotifyMe(initialData.notifyMe || false);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Upload title is required");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      onAdd({
        title,
        description,
        mandatory,
        notifyAdmins,
        notifyMe,
        responses: initialData?.responses || [],
      });

      setLoading(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-lg shadow">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">{initialData ? 'Edit Learner Upload' : 'Add Learner Upload'}</h2>
          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="text-sm font-medium">Upload Title</label>
            <input
              className="w-full mt-1 border rounded px-3 py-2 text-sm"
              placeholder="E.g. Submit Documents"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Upload Description</label>
            <textarea
              className="w-full mt-1 border rounded px-3 py-2 text-sm"
              rows={3}
              placeholder="A description for the file upload"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={mandatory}
              onChange={(e) => setMandatory(e.target.checked)}
            />
            <span className="text-sm">Make this upload mandatory</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifyAdmins}
              onChange={(e) => setNotifyAdmins(e.target.checked)}
            />
            <span className="text-sm">Notify administrators by email</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifyMe}
              onChange={(e) => setNotifyMe(e.target.checked)}
            />
            <span className="text-sm">Notify me by email</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm bg-sky-600 text-white rounded"
          >
            {loading ? (initialData ? "Saving..." : "Adding...") : (initialData ? "Save Changes" : "Add Upload")}
          </button>
        </div>
      </div>
    </div>
  );
}
