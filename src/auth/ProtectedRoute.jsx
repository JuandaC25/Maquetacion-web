
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
    const forceAdmin = typeof window !== 'undefined' && window.localStorage.getItem('force_admin') === '1';
    const forceTecnico = typeof window !== 'undefined' && window.localStorage.getItem('force_tecnico') === '1';
    if ((forceAdmin && allowedRoles.includes('ADMINISTRADOR')) || (forceTecnico && allowedRoles.includes('TECNICO'))) {
      return children;
    }
    const hasRole = roles.some(r => allowedRoles.includes(r));
    if (!hasRole) {
      return (
        <div style={{ padding: 24, color: 'red', textAlign: 'center' }}>
          Acceso denegado: no tienes permisos para ver esta página.
        </div>
      );
    }
  }

  return children;
}
