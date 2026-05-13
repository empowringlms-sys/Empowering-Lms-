// src/components/ProtectedRoute.jsx
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAuthContext } from "../AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLogin, isLoading, isAuthChecked, userData } = useAuthContext();
  const location = useLocation();
  const { slug } = useParams();

  if (isLoading || !isAuthChecked) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          </div>
          <div className="text-center">
            <p className="text-md font-medium text-slate-700">
              Checking authentication
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Please wait a moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLogin || !userData?.isVerified) {
    if (!userData?.isVerified && localStorage.getItem("authToken")) {
      return <Navigate to={`/${slug}/otp-verify`} state={{ from: location }} replace />;
    }
    return <Navigate to={`/${slug}/signin`} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
