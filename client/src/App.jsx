import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import StudentDashboard from "./pages/StudentDashboard";
import GuideDashboard from "./pages/guide/GuideDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import CoordinatorDashboard from "./pages/coordinator/CoordinatorDashboard.jsx";
import Guide from "./pages/student/Guide.jsx";

import ProtectedRoute from "./components/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateProject from "./pages/student/CreateProject.jsx";
import ManageRequest from "./pages/guide/ManageRequest.jsx";
import AssignedStudents from "./pages/guide/AssignedStudents.jsx";
import AssignedProjects from "./pages/guide/AssignedProjects.jsx";
import UploadFiles from "./pages/student/UploadFiles.jsx";
import Feedback from "./pages/student/Feedback.jsx";
import GuideManagement from "./pages/coordinator/GuideManagement.jsx";
import StudentManagement from "./pages/coordinator/StudentManagement.jsx";
import ProjectApproval from "./pages/coordinator/ProjectApproval.jsx";
import UploadedFiles from "./pages/coordinator/UploadedFiles.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/student/guide" element={
          <ProtectedRoute role="student">
            <Guide />
          </ProtectedRoute>  
        } />
        <Route path="/student/create-project" element={
          <ProtectedRoute role="student">
            <CreateProject />
          </ProtectedRoute>  
        } />
        <Route path="/student/submission" element={
          <ProtectedRoute role="student">
            <UploadFiles />
          </ProtectedRoute>  
        } />
        <Route path="/student/feedback" element={
          <ProtectedRoute role="student">
            <Feedback />
          </ProtectedRoute>  
        } />


        <Route
          path="/guide-dashboard"
          element={
            <ProtectedRoute role="guide">
              <GuideDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/guide/request" element={
          <ProtectedRoute role="guide">
            <ManageRequest />
          </ProtectedRoute>  
        } />
        <Route path="/guide/assigned-students" element={
          <ProtectedRoute role="guide">
            <AssignedStudents />
          </ProtectedRoute>  
        } />
        <Route path="/guide/projects" element={
          <ProtectedRoute role="guide">
            <AssignedProjects />
          </ProtectedRoute>  
        } />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coordinator-dashboard"
          element={
            <ProtectedRoute role="coordinator">
              <CoordinatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coordinator/manage-guides"
          element={
            <ProtectedRoute role="coordinator">
              <GuideManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coordinator/manage-students"
          element={
            <ProtectedRoute role="coordinator">
              <StudentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coordinator/pending-request"
          element={
            <ProtectedRoute role="coordinator">
              <ProjectApproval />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coordinator/documents"
          element={
            <ProtectedRoute role="coordinator">
              <UploadedFiles />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </BrowserRouter>
  );
}

export default App;
