import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import StudentFeed from './pages/student/StudentFeed';
import NoticeDetail from './pages/student/NoticeDetail';
import ProfilePage from './pages/student/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateNotice from './pages/admin/CreateNotice';
import ManageNotices from './pages/admin/ManageNotices';
import UserManagement from './pages/admin/UserManagement';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import CalendarPage from './pages/CalendarPage';
import OfflinePage from './pages/OfflinePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Student Routes */}
          <Route path="/student/feed" element={
            <ProtectedRoute allowedRoles={['student', 'admin', 'faculty']}>
              <StudentFeed />
            </ProtectedRoute>
          } />

          <Route path="/student/notice/:id" element={
            <ProtectedRoute allowedRoles={['student', 'admin', 'faculty']}>
              <NoticeDetail />
            </ProtectedRoute>
          } />

          <Route path="/student/profile" element={
            <ProtectedRoute allowedRoles={['student', 'admin', 'faculty']}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/notice/new" element={
            <ProtectedRoute allowedRoles={['admin', 'faculty']}>
              <CreateNotice />
            </ProtectedRoute>
          } />
          <Route path="/admin/notices" element={
            <ProtectedRoute allowedRoles={['admin', 'faculty']}>
              <ManageNotices />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } />

          {/* Faculty Routes */}
          <Route path="/faculty/dashboard" element={
            <ProtectedRoute allowedRoles={['faculty', 'admin']}>
              <FacultyDashboard />
            </ProtectedRoute>
          } />

          {/* Shared Routes */}
          <Route path="/calendar" element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          } />
          <Route path="/offline" element={<OfflinePage />} />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Placeholder title="404 Not Found" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

const Placeholder = ({ title }) => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
    <h1 className="text-4xl font-black italic tracking-tighter text-white mb-4 uppercase">{title}</h1>
    <p className="text-gray-500 text-center max-w-xs mb-10 text-sm leading-relaxed">
      This zone is currently under development or the logic was not found.
    </p>
    <Navigate to="/login" replace />
  </div>
);

export default App;
