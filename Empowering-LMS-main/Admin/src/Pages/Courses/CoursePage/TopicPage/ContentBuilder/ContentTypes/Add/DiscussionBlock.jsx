import React, { useState } from "react";
import RichTextEditor from "./RichTextEditor";

const DiscussionBlock = ({ block, onUpdate }) => {
  const [editorValue, setEditorValue] = useState("");
  const [comments, setComments] = useState(block.comments || []);

  const addComment = () => {
    if (!editorValue.trim()) return;

    const newComment = {
      id: Date.now(),
      user: "User",
      text: editorValue,
      time: "a few seconds ago",
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    setEditorValue("");

    onUpdate({
      ...block,
      comments: updatedComments,
    });
  };

  return (
    <div className="border rounded-xl p-6 bg-white">

      <h2 className="text-xl font-semibold">{block.title}</h2>
      {block.description && (
        <p className="text-sm text-gray-500 mt-1">
          {block.description}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-100 rounded-lg px-4 py-3 max-w-lg">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{c.user}</span>
              <span className="text-gray-500">{c.time}</span>
            </div>
            <div
              className="mt-1 text-sm"
              dangerouslySetInnerHTML={{ __html: c.text }}
            />
            <button className="text-sky-600 text-xs mt-1">Reply</button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="font-medium mb-2">Ahmed Shah</div>

        <RichTextEditor
          value={editorValue}
          onChange={setEditorValue}
          height={200}
        />

        <button
          onClick={addComment}
          className="mt-4 bg-sky-600 text-white px-6 py-2 rounded"
        >
          Comment
        </button>
      </div>
    </div>
  );
};

export default DiscussionBlock;
