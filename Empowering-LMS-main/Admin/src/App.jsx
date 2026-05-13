import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Pages/Home";
import Certificates from "./Pages/Certificates";
import Learners from "./Pages/Learners/Learners";
import CreateCourse from "./Pages/Courses/CreateCourse";
import CourseDashboard from "./Pages/Courses/CourseDashboard.jsx";
import CoursePage from "./Pages/Courses/CoursePage/CoursePage.jsx";
import CourseTopics from "./Pages/Courses/CourseTopics.jsx";
import CourseLearners from "./Pages/Courses/CourseDetails.jsx";
import CourseDetails from "./Pages/Courses/CourseDetails.jsx";
import MediaFiles from "./modules/media-files/MediaFiles/MediaFiles.jsx";
import CoursesPage from "./Pages/Courses/CoursesPage/CoursesPage.jsx";
import EditCourse from "./Pages/Courses/EditCourse.jsx";
import CoursesLayout from "./Pages/Courses/CoursesLayout.jsx";
import CoursePageOutlet from "./Pages/Courses/CoursePage/CoursePageOutlet.jsx";
import TopicPage from "./Pages/Courses/CoursePage/TopicPage/TopicPage.jsx";

import PrivateRoute from "./modules/auth/routes/PrivateRoute";
import PublicRoute from "./modules/auth/routes/PublicRoute";
import AdminLogin from "./modules/auth/AdminLogin/AdminLogin.jsx";
import LearnerPage from "./Pages/Learners/LearnerPage/LearnerPage.jsx";
import SendEmail from "./Pages/Learners/SendEmail.jsx";
import ProfilePage from "./modules/profile/ProfilePage.jsx";
import AddLearner from "./Pages/Learners/AddLearner/AddLearner.jsx";

export default function App() {
  return (
    <div>
      <Routes>
        {/* PUBLIC */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<AdminLogin />} />
        </Route>

        {/* PRIVATE */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/home" />} />
            <Route path="*" element={<Navigate to="/home" />} />

            <Route path="home" element={<Home />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="learners" element={<Learners />} />
            <Route path="learners/add" element={<AddLearner />} />
            <Route path="learners/email/:learnerId" element={<SendEmail />} />
            <Route path="learners/:learnerId" element={<LearnerPage />} />
            <Route path="learners/email/:learnerId" element={<SendEmail />} />
            <Route path="learners/:learnerId" element={<LearnerPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="media-files" element={<MediaFiles />} />

            <Route path="courses" element={<CoursesLayout />}>
              <Route index element={<CoursesPage />} />
              <Route path="create-course" element={<CreateCourse />} />
              <Route path="edit/:id" element={<EditCourse />} />
              <Route path="course-dashboard" element={<CourseDashboard />} />

              <Route path=":courseId" element={<CoursePageOutlet />}>
                <Route index element={<CoursePage />} />
                <Route path="learners" element={<CourseLearners />} />
                <Route path="topic/:topicId" element={<TopicPage />} />
              </Route>

              <Route path="course-topics" element={<CourseTopics />} />
              <Route path="course-details" element={<CourseDetails />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
