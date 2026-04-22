import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateExam from "./pages/CreateExam";
import AddQuestion from "./pages/AddQuestion";
import AttemptExam from "./pages/AttemptExam";
import Result from "./pages/Result";
import ViewExams from "./pages/ViewExams";
import ManageUsers from "./pages/ManageUsers";
import PublishExam from "./pages/PublishExam";
import PublishResults from "./pages/PublishResults";
import EvaluateAnswers from "./pages/EvaluateAnswers";
import Landing from "./pages/Landing";
import { ROLE, getAuthFromStorage } from "./config/roleAccess";

function HomePage() {
  const auth = getAuthFromStorage();
  if (!auth) {
    return <Landing />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="layout">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          <Route
            path="/manage-users"
            element={<ProtectedRoute allowedRoles={[ROLE.ADMIN]}><ManageUsers /></ProtectedRoute>}
          />
          <Route
            path="/create-exam"
            element={<ProtectedRoute allowedRoles={[ROLE.ADMIN, ROLE.FACULTY]}><CreateExam /></ProtectedRoute>}
          />
          <Route
            path="/publish-exam"
            element={<ProtectedRoute allowedRoles={[ROLE.ADMIN, ROLE.FACULTY]}><PublishExam /></ProtectedRoute>}
          />
          <Route
            path="/publish-results"
            element={<ProtectedRoute allowedRoles={[ROLE.ADMIN]}><PublishResults /></ProtectedRoute>}
          />

          <Route
            path="/add-question"
            element={<ProtectedRoute allowedRoles={[ROLE.FACULTY]}><AddQuestion /></ProtectedRoute>}
          />
          <Route
            path="/evaluate-answers"
            element={<ProtectedRoute allowedRoles={[ROLE.FACULTY]}><EvaluateAnswers /></ProtectedRoute>}
          />

          <Route
            path="/view-exams"
            element={<ProtectedRoute allowedRoles={[ROLE.STUDENT]}><ViewExams /></ProtectedRoute>}
          />
          <Route
            path="/attempt-exam"
            element={<ProtectedRoute allowedRoles={[ROLE.STUDENT]}><AttemptExam /></ProtectedRoute>}
          />
          <Route
            path="/result"
            element={<ProtectedRoute allowedRoles={[ROLE.STUDENT]}><Result /></ProtectedRoute>}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
