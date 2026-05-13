// src/components/AuthRoute.jsx
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAuthContext } from "../AuthContext";

const AuthRoute = ({ children }) => {
  const { isLogin, userData, hasAuthToken } = useAuthContext();
  const location = useLocation();
  const { slug } = useParams();

  if (location.pathname === "/otp-verify") {
    if (hasAuthToken() && !userData?.isVerified) {
      return children;
    }

    if (isLogin && userData?.isVerified) {
      return <Navigate to={`/${slug}/dashboard`} replace />;
    }

    if (!hasAuthToken() || !isLogin) {
      return <Navigate to={`/${slug}/signin`} replace />;
    }
  }

  if (isLogin && userData?.isVerified) {
    return <Navigate to={`/${slug}/dashboard`} replace />;
  }

  return children;
};

export default AuthRoute;
