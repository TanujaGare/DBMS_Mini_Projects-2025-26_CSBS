import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import StudentDashboard from './pages/student/Dashboard';
import StudentDrives from './pages/student/Drives';
import DriveDetails from './pages/student/DriveDetails';
import StudentApplications from './pages/student/Applications';
import StudentProfile from './pages/student/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import AdminCompanies from './pages/admin/Companies';
import AdminDrives from './pages/admin/Drives';
import DriveApplicants from './pages/admin/DriveApplicants';
import AdminStudents from './pages/admin/Students';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/drives" element={<ProtectedRoute role="student"><StudentDrives /></ProtectedRoute>} />
          <Route path="/student/drives/:id" element={<ProtectedRoute role="student"><DriveDetails /></ProtectedRoute>} />
          <Route path="/student/applications" element={<ProtectedRoute role="student"><StudentApplications /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/companies" element={<ProtectedRoute role="admin"><AdminCompanies /></ProtectedRoute>} />
          <Route path="/admin/drives" element={<ProtectedRoute role="admin"><AdminDrives /></ProtectedRoute>} />
          <Route path="/admin/drives/:id/applicants" element={<ProtectedRoute role="admin"><DriveApplicants /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute role="admin"><AdminStudents /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
