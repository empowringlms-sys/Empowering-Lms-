import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiPlay,
  FiMail,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiCalendar,
  FiPhone,
} from "react-icons/fi";

import { useAuthContext } from "../../modules/userAuth/AuthContext";

import MyCourses from "./MyCourses/MyCourses";

const Dashboard = () => {
  const { userData } = useAuthContext();
  console.log(userData)

  const navigate = useNavigate();
  const { slug } = useParams();

  if (!userData) return null;

  const { name, email, isVerified, createdAt, lastLogin, other, contactNo } = userData;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="bg-gradient-to-b from-emerald-50/40 to-white p-2 md:p-4 lg:p-6">
      {/* Welcome Section */}
      <div className="max-w-[1550px] mx-auto">
        <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-emerald-900">
                Welcome back, {name} 👋
              </h1>
              <p className="text-emerald-600 mt-1">
                Ready to continue your learning journey?
              </p>
            </div>

            {/* Main CTA */}
            <button
              onClick={() => navigate(`/${slug}/dashboard/courses`)}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer"
            >
              <FiPlay className="w-5 h-5" />
              Start Learning
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Email */}
          <InfoCard icon={FiMail} title="Email" value={email} />

          {/* Contact No */}
          <InfoCard
            icon={FiPhone}
            title="Contact No"
            value={contactNo || "N/A"}
          />

          {/* Joined */}
          <InfoCard
            icon={FiCalendar}
            title="Joined On"
            value={formatDate(createdAt)}
          />

          {/* Last Login */}
          {/* <InfoCard
            icon={FiClock}
            title="Last Login"
            value={formatDate(lastLogin)}
          /> */}
        </div>
      </div>
      <div className="mt-12">
        <MyCourses />
      </div>
    </div>
  );
};

/* ---------------------------------- */
/* Reusable Info Card */
/* ---------------------------------- */

const InfoCard = ({ icon: Icon, title, value, valueClass = "" }) => {
  return (
    <div className="bg-white rounded-xl border border-emerald-100 p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-emerald-50">
          <Icon className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm text-emerald-600">{title}</p>
          <p
            className={`font-semibold text-emerald-900 truncate ${valueClass}`}
            title={value}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
