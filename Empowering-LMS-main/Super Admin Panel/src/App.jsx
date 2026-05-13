import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import CompanyDetails from "./pages/CompanyDetails.jsx";
import CompanyDetailsPage from "./pages/Companies/CompanyDetailsPage.jsx";
import PrivateRoute from "./modules/auth/routes/PrivateRoute.jsx";
import PublicRoute from "./modules/auth/routes/PublicRoute.jsx";
import "./App.css";
import AdminLogin from "./modules/auth/AdminLogin/AdminLogin.jsx";
import { AuthProvider } from "./modules/auth/context/AuthContext.jsx";
import Layout from "./Layout.jsx";
import OnboardingForm from "./pages/OnboardingForm.jsx";
import CoursesPage from "./pages/Courses/CoursesPage.jsx";
import CreateCourse from "./pages/Courses/CreateCourse.jsx";
import EditCourse from "./pages/Courses/EditCourse.jsx";
import CoursePage from "./pages/Courses/CoursePage/CoursePage.jsx";
import MediaLibraryPage from "./pages/Media/MediaLibraryPage.jsx";
import { MediaProvider } from "./context/MediaContext.jsx";
import TopicPage from "./pages/Courses/CoursePage/TopicPage/TopicPage.jsx";

function App() {
  return (
    <AuthProvider>
      <MediaProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<AdminLogin />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/company/:id" element={<CompanyDetails />} />
              <Route path="/companies/:companyId" element={<CompanyDetailsPage />} />
              <Route path="/add/company" element={<OnboardingForm />} />

              {/* Course Management Routes */}
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/create" element={<CreateCourse />} />
              <Route path="/courses/:courseId" element={<CoursePage />} />
              <Route path="/courses/:courseId/edit" element={<EditCourse />} />
              <Route path="/courses/:courseId/topic/:topicId" element={<TopicPage />} />

              {/* Media Library Route */}
              <Route path="/media-library" element={<MediaLibraryPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </MediaProvider>
    </AuthProvider>
  );
}

export default App;
