import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../../modules/userAuth/AuthContext";
import axiosInstance from "../../../utils/axiosInstance/axiosInstance";

export default function MyCourses() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { userData } = useAuthContext();
  const [coursesData, setCoursesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!userData?._id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get(
          `/courses/summary/${userData._id}`,
        );

        if (response && response.success) {
          setCoursesData(response);
        } else {
          setError("Failed to fetch courses data");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to load courses.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userData?._id]);

  /* ================= LOADING ================= */
  if (loading && !coursesData) {
    return (
      <div className="bg-gradient-to-b from-emerald-50/40 to-white pt-10 pb-10">
        <div className="max-w-[1550px] mx-auto px-4">
          <div className="h-8 bg-emerald-100 rounded w-56 mb-6 animate-pulse"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden"
              >
                <div className="h-40 bg-emerald-100 animate-pulse"></div>
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-emerald-100 rounded animate-pulse"></div>
                  <div className="h-4 bg-emerald-100 rounded w-3/4 animate-pulse"></div>
                  <div className="h-9 bg-emerald-100 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="bg-gradient-to-b from-emerald-50/40 to-white pt-32 pb-10 text-center">
        <h3 className="text-xl font-bold text-emerald-900 mb-2">
          Error Loading Courses
        </h3>
        <p className="text-emerald-700 mb-6">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  /* ================= MAIN ================= */
  return (
    <div className="bg-gradient-to-b from-emerald-50/40 to-white pt-10font-extrabold text-emerald-900 text-lg leading-tight line-clamp-2 mb-3 h-auto pb-10">
      <div className="max-w-[1550px] mx-auto px-2">
        {/* Header */}
        {coursesData?.courses?.length > 0 && (
          <div className="my-5">
            <div className="bg-white border border-emerald-100 rounded-2xl px-5 py-4 sm:px-6 sm:py-5 shadow-sm">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-900 text-center">
                My Enrolled Courses
              </h1>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!coursesData?.courses?.length ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-emerald-100 shadow-sm">
            <div className="text-6xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-emerald-900 mb-2">
              No Courses Enrolled
            </h3>
            <p className="text-emerald-700 mb-8">
              You haven't enrolled in any courses yet.
            </p>
            {/* <button
              onClick={() => navigate("/courses")}
              className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              Browse Courses
            </button> */}
          </div>
        ) : (
          /* Courses Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {coursesData.courses.map((course) => (
              <div
                key={course._id}
                onClick={() => navigate(`/${slug}/dashboard/courses/${course._id}`)}
                className="
                  bg-white rounded-3xl border border-emerald-100
                  shadow-sm hover:shadow-xl hover:-translate-y-1
                  transition-all duration-500 cursor-pointer
                  group flex flex-col h-full
                "
              >
                {/* Image */}
                <div className="h-52 bg-emerald-50 overflow-hidden relative">
                  <img
                    src={
                      course.coverArt ||
                      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=500&h=300&fit=crop"
                    }
                    alt={course.courseName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest text-emerald-600 uppercase border border-emerald-100 shadow-sm">
                    Enrolled
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="font-bold text-emerald-900 text-lg leading-tight line-clamp-2 mb-3 min-h-[3rem]">
                    {course.courseName || "Untitled Course"}
                  </h4>

                  <p className="text-sm font-medium text-emerald-700 line-clamp-2 mb-6 flex-1">
                    {course.description ||
                      "Pick up where you left off and finish your learning goals."}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-emerald-50 mt-auto">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white"
                        />
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // If you have a specific "continue" point (like last accessible topic), use that.
                        // For now, going to course page is safer than guessing topic IDs not loaded here.
                        // Or if you want to go to topics list:
                        navigate(`/${slug}/dashboard/courses/${course._id}`);
                      }}
                      className="
                        px-6 py-2.5
                        bg-gradient-to-r from-emerald-500 to-emerald-600
                        text-white rounded-xl font-bold text-sm
                        shadow-lg shadow-emerald-100
                        hover:scale-[1.03]
                        transition-all active:scale-95
                      "
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
