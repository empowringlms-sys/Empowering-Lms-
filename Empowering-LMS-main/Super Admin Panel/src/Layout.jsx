import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/Topbar";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <div className="flex h-screen overflow-hidden">
        {/* MOBILE OVERLAY */}
        {sidebarOpen && isMobile && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300"
          />
        )}

        {/* SIDEBAR - Fixed position on desktop, overlay on mobile */}
        <div
          className={`
          fixed md:relative
          top-0 left-0
          h-screen
          z-40 md:z-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          md:w-64
          flex-shrink-0
        `}
        >
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* TOP BAR - Fixed on desktop */}
          <div className="sticky top-0 z-30 flex-shrink-0">
            <TopBar onMenuClick={() => setSidebarOpen(true)} />
          </div>

          {/* PAGE CONTENT - Scrollable */}
          <div id="main-scroll-container" className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
      {/* Other components */}
      <ScrollToTop /> {/*  scroll top on change page */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            border: "1px solid #d1fae5",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          },
        }}
      />
    </div>
  );
}
