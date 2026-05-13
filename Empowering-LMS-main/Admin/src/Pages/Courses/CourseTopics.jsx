import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CourseTopics = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course;

  const [topicName, setTopicName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCreateTopic = () => {
    if (!topicName.trim()) return;

    // 🔥 Save topic (temporary)
    const savedTopics =
      JSON.parse(localStorage.getItem("courseTopics")) || [];

    localStorage.setItem(
      "courseTopics",
      JSON.stringify([
        { id: Date.now(), title: topicName },
        ...savedTopics,
      ])
    );

    setShowSuccess(true);
    setTopicName("");
  };

  // 🔁 AUTO REDIRECT AFTER 2 SEC
  useEffect(() => {
    if (!showSuccess) return;

    const timer = setTimeout(() => {
      navigate(`/courses/${course?._id}`, {
        state: { course },
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [showSuccess, navigate, course]);

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">

        {/* CREATE TOPIC FORM */}
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">
            Create a Topic
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Enter a name for your new topic or{" "}
            <span className="text-sky-500 cursor-pointer">
              copy an existing topic
            </span>.
          </p>

          <div className="max-w-md mx-auto text-left">
            <label className="block text-sm font-medium mb-2">
              Topic Name
            </label>

            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="Enter a name for the topic"
              className="w-full border p-3 rounded mb-4"
            />

            <button
              onClick={handleCreateTopic}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded transition"
            >
              Create Topic
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 text-center popup-up shadow-2xl">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="text-lg font-semibold text-green-600">
              Topic Created Successfully
            </h3>
            <p className="text-sm text-gray-500">
              Redirecting…
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseTopics;
