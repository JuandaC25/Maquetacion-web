import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, roles: allowedRoles }) {
  const { token, roles, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 24 }}>Cargando…</div>;
  }

  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = roles.some(r => allowedRoles.includes(r));
    if (!hasRole) {
      return <Navigate to="/Inicio" replace />;
    }
  }

  return children;
}
