import React, { useState } from "react";
import { FiX, FiTrash2 } from "react-icons/fi";

const AddMCQModal = ({ onClose, onAdd, initialData }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectionType, setSelectionType] = useState("single");

  const [choices, setChoices] = useState([
    { id: Date.now(), text: "", correct: false },
    { id: Date.now() + 1, text: "", correct: false },
  ]);

  const [attempts, setAttempts] = useState("unlimited");
  const [noFeedback, setNoFeedback] = useState(false);
  const [incorrectFeedback, setIncorrectFeedback] = useState("");
  const [correctFeedback, setCorrectFeedback] = useState("");

  // 🔥 FIX
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      if (initialData.selectionType) setSelectionType(initialData.selectionType);

      if (initialData.choices && initialData.choices.length > 0) {
        setChoices(initialData.choices);
      }

      if (initialData.attempts) setAttempts(initialData.attempts);

      if (initialData.feedback) {
        setCorrectFeedback(initialData.feedback.correct || "");
        setIncorrectFeedback(initialData.feedback.incorrect || "");
        setNoFeedback(false);
      } else {
        setNoFeedback(true);
      }
    }
  }, [initialData]);

  const addChoice = () => {
    setChoices([...choices, { id: Date.now(), text: "", correct: false }]);
  };

  const updateChoice = (id, key, value) => {
    setChoices(
      choices.map((c) =>
        c.id === id
          ? { ...c, [key]: value }
          : selectionType === "single" && key === "correct"
            ? { ...c, correct: false }
            : c
      )
    );
  };

  const removeChoice = (id) => {
    setChoices(choices.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    if (saving) return;

    if (!title.trim()) {
      alert("Question title is required");
      return;
    }

    // ✅ FIRST render Saving...
    setSaving(true);

    // ✅ THEN actually save (allow UI to paint)
    setTimeout(() => {
      onAdd({
        title,
        content,
        selectionType,
        choices,
        attempts,
        feedback: noFeedback
          ? null
          : {
            correct: correctFeedback,
            incorrect: incorrectFeedback,
          },
      });

      setSaving(false);
      onClose();
    }, 300); // 👈 small delay is enough
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-xl shadow-lg flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">{initialData ? 'Edit Multiple Choice' : 'Add Multiple Choice'}</h2>
          <button onClick={onClose} disabled={saving}>
            <FiX />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">

          {/* TITLE */}
          <div>
            <label className="font-medium">Question Title</label>
            <input
              className="w-full border rounded px-3 py-2 mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* CONTENT */}
          <div>
            <label className="font-medium">Question Content</label>
            <textarea
              className="w-full border rounded px-3 py-2 mt-1"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* TYPE */}
          <div>
            <label className="font-medium block mb-2">
              Multiple Choice Type
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={selectionType === "single"}
                onChange={() => setSelectionType("single")}
              />
              Single Selection
            </label>
            <label className="flex items-center gap-2 mt-1">
              <input
                type="radio"
                checked={selectionType === "multiple"}
                onChange={() => setSelectionType("multiple")}
              />
              Multiple Selection
            </label>
          </div>

          {/* OPTIONS */}
          <div>
            <label className="font-medium block mb-2">Options</label>

            {choices.map((choice) => (
              <div key={choice.id} className="flex items-center gap-3 mb-2">
                <input
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="Option text"
                  value={choice.text}
                  onChange={(e) =>
                    updateChoice(choice.id, "text", e.target.value)
                  }
                />

                <label className="flex items-center gap-1 text-xs">
                  <input
                    type={selectionType === "single" ? "radio" : "checkbox"}
                    checked={choice.correct}
                    onChange={(e) =>
                      updateChoice(choice.id, "correct", e.target.checked)
                    }
                  />
                  Correct
                </label>

                <button
                  onClick={() => removeChoice(choice.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}

            <button
              onClick={addChoice}
              className="text-sky-600 text-sm mt-2"
            >
              + Add Choice
            </button>
          </div>

          {/* FEEDBACK */}
          <div>
            <label className="font-medium block mb-2">Feedback Options</label>

            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={noFeedback}
                onChange={(e) => setNoFeedback(e.target.checked)}
              />
              Do not give feedback
            </label>

            {!noFeedback && (
              <>
                <textarea
                  className="w-full border rounded px-3 py-2 mb-2"
                  rows={2}
                  placeholder="Incorrect feedback"
                  value={incorrectFeedback}
                  onChange={(e) =>
                    setIncorrectFeedback(e.target.value)
                  }
                />

                <textarea
                  className="w-full border rounded px-3 py-2"
                  rows={2}
                  placeholder="Correct feedback"
                  value={correctFeedback}
                  onChange={(e) =>
                    setCorrectFeedback(e.target.value)
                  }
                />
              </>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            disabled={saving}
            className="border px-4 py-1.5 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-sky-600 text-white px-4 py-1.5 rounded"
          >
            {saving ? (initialData ? "Saving..." : "Adding...") : (initialData ? "Save Changes" : "Save Changes")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMCQModal;
