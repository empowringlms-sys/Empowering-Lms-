import React, { useState } from "react";
import { FiX } from "react-icons/fi";

const AddQuestionInTopicModal = ({ onClose, onAdd, initialData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState("long"); // short | long
  const [mandatory, setMandatory] = useState(true);
  const [notifyAdmins, setNotifyAdmins] = useState(false);
  const [notifyMe, setNotifyMe] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setFormat(initialData.format || "long");
      if (initialData.mandatory !== undefined) setMandatory(initialData.mandatory);
      if (initialData.notifyAdmins !== undefined) setNotifyAdmins(initialData.notifyAdmins);
      if (initialData.notifyMe !== undefined) setNotifyMe(initialData.notifyMe);
    }
  }, [initialData]);

  const handleAdd = () => {
    if (!title.trim()) {
      alert("Question title is required");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      onAdd({
        title,
        description,
        format,
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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">{initialData ? 'Edit Question' : 'Add Question'}</h2>
          <button onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5 text-sm">
          <p className="text-gray-500">
            Questions enable learners to submit a typed response to you.
            Submitted responses will only be visible to you.
          </p>

          {/* TITLE */}
          <div>
            <label className="font-medium">Question Title</label>
            <input
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="E.g. Question 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="font-medium">Question Description</label>
            <textarea
              className="w-full border rounded px-3 py-2 mt-1"
              rows={3}
              placeholder="A description of the question"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* FORMAT */}
          <div>
            <label className="font-medium block mb-2">Question Format</label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={format === "short"}
                onChange={() => setFormat("short")}
              />
              Short answer – single line of text
            </label>

            <label className="flex items-center gap-2 mt-2">
              <input
                type="radio"
                checked={format === "long"}
                onChange={() => setFormat("long")}
              />
              Long answer – multiple lines of text
            </label>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="border px-4 py-1.5 rounded">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-sky-600 text-white px-4 py-1.5 rounded"
          >
            {loading ? (initialData ? "Saving..." : "Adding...") : (initialData ? "Save Changes" : "Add Question")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionInTopicModal;
