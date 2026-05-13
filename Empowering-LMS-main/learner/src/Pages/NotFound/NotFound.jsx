import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FiHome, FiAlertTriangle } from "react-icons/fi";

const NotFound = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const handleGoHome = () => {
        if (slug) {
            navigate(`/${slug}/dashboard`);
        } else {
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center space-y-6 max-w-lg">
                <div className="flex justify-center">
                    <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center">
                        <FiAlertTriangle className="text-5xl text-red-500" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-gray-900">Page Not Found</h1>
                <p className="text-gray-500 text-lg">
                    The page you are looking for doesn't exist or has been moved.
                </p>

                <button
                    onClick={handleGoHome}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                    <FiHome className="text-xl" />
                    <span>Go to Home</span>
                </button>
            </div>
        </div>
    );
};

export default NotFound;
