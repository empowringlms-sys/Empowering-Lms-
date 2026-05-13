import React from "react";
import { useLocation } from "react-router-dom";

const CourseLearners = () => {
  const { state } = useLocation();
  const course = state?.course;

  if (!course) {
    return (
      <div className="p-6 text-center text-gray-500">
        No course data found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* =====================
          COURSE INFO CARD
      ===================== */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

        {/* Cover */}
        <div className="h-48 w-full">
          <img
            src={course.coverArt}
            alt="course cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-2">
            {course.title}
          </h2>

          <p className="text-sm text-gray-600 mb-4">
            {course.description}
          </p>

          <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-500">

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="font-medium text-gray-700">
                Duration
              </div>
              <div className="italic">Not specified</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 sm:col-span-2">
              <div className="font-medium text-gray-700">
                Created At
              </div>
              <div className="break-words">
                {course.createdAt}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* =====================
          EMPTY LEARNERS STATE
      ===================== */}
      <div className="mt-10 text-center text-gray-400 text-sm">
        No learners enrolled yet.
      </div>

    </div>
  );
};

export default CourseLearners;
