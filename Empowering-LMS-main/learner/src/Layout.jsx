// src/Layout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ScrollToHash from "./components/ScrollToHash";
import { useAuthContext } from "./modules/userAuth/AuthContext";

const Layout = () => {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { isLogin, isAuthChecked } = useAuthContext();

  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      {!isLogin ? (
        <div className="w-full h-full min-h-screen">
          <Outlet />
        </div>
      ) : (
        <div className="flex h-screen overflow-hidden">
          {/* MOBILE OVERLAY */}
          {sidebarOpen && isMobile && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300"
            />
          )}

          {/* SIDEBAR */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* HEADER */}
            <Header onMenuClick={() => setSidebarOpen(true)} />

            {/* PAGE CONTENT */}
            <div id="main-scroll-container" className="flex-1 overflow-auto">
              <ScrollToHash />
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
