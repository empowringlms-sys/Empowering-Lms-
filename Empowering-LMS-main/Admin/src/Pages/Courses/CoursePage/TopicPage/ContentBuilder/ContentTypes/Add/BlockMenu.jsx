import React, { useState } from "react";

const BlockMenu = ({ onMoveUp, onMoveDown, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-xl px-2"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-50">
          <button
            onClick={() => {
              onMoveUp();
              setOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
          >
            Move Up
          </button>
          <button
            onClick={() => {
              onMoveDown();
              setOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
          >
            Move Down
          </button>
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default BlockMenu;
