import React from "react";
import { useLocation } from "react-router-dom";

const CourseDashboard = () => {
  const location = useLocation();

  // 🧠 data from CreateCourse
  const coverArt = location.state?.coverArt || "/images/cover1.jpg";
  const courseName = location.state?.courseName || "Course Dashboard";

  return (
    <div className="max-w-6xl mx-auto p-6">
      
      {/* COVER IMAGE */}
      <div className="rounded-xl overflow-hidden mb-6">
        <img
          src={coverArt}
          alt="course cover"
          className="w-full h-64 object-cover"
        />
      </div>

      {/* COURSE TITLE */}
      <h1 className="text-2xl font-semibold mb-10">
        {courseName}
      </h1>

      {/* ACTIONS */}
      <div className="grid sm:grid-cols-2 gap-10 text-center">
        
        <div className="border rounded-xl p-8 hover:shadow cursor-pointer transition">
          <div className="text-5xl mb-4">➕</div>
          <h3 className="font-semibold">Add Topic</h3>
          <p className="text-sm text-gray-500">
            Create course content
          </p>
        </div>

        <div className="border rounded-xl p-8 hover:shadow cursor-pointer transition">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="font-semibold">Add Learners</h3>
          <p className="text-sm text-gray-500">
            Enroll learners
          </p>
        </div>

      </div>
    </div>
  );
};

export default CourseDashboard;
