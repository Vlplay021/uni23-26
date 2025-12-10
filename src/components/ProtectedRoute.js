// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children, requiredRole = 'any' }) {
  const { isLoggedIn, hasPermission } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;