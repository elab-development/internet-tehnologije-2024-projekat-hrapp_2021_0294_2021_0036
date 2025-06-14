import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
