import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ProtectedRoute from "./modules/userAuth/routes/ProtectedRoute";
import AuthRoute from "./modules/userAuth/routes/AuthRoute";
import Login from "./modules/userAuth/Login/Login";
import MyCourses from "./Pages/Dashboard/MyCourses/MyCourses";
import CoursePage from "./Pages/Dashboard/MyCourses/CoursePage/CoursePage";
import TopicPage from "./Pages/Dashboard/MyCourses/CoursePage/TopicPage/TopicPage";
import ProfilePage from "./Pages/Profile/ProfilePage";

import CompanySelector from "./Pages/CompanySelector/CompanySelector";
import RootLayout from "./RootLayout";
import NotFound from "./Pages/NotFound/NotFound";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path="/" element={<CompanySelector />} />

      <Route path="/:slug" element={<Layout />}>
        {/* Redirect root of slug to signin */}
        <Route index element={<Navigate to="signin" replace />} />

        {/* Auth Routes */}
        <Route path="signin" element={<AuthRoute><Login /></AuthRoute>} />

        {/* Dashboard Routes (Protected) */}
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="dashboard/courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
        <Route path="dashboard/courses/:courseId" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
        <Route path="dashboard/courses/:courseId/topics/:topicId" element={<ProtectedRoute><TopicPage /></ProtectedRoute>} />

        {/* Catch all invalid routes within a valid slug context */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Catch all for root level invalid routes */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;