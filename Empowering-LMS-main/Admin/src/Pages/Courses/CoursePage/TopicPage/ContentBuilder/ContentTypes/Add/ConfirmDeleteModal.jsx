import React from "react";

const ConfirmDeleteModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
        <h3 className="text-lg font-semibold mb-2">
          Delete block?
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete this block? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border px-4 py-1.5 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-1.5 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
