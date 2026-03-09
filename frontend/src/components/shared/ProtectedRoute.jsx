import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role if they try to access a forbidden page
    const fallback = user.role === 'admin' ? '/admin/dashboard' : 
                     user.role === 'faculty' ? '/faculty/dashboard' : '/student/feed';
    return <Navigate to={fallback} replace />;
  }

  return children;
};
