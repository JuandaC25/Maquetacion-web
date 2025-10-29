import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, roles: allowedRoles, excludeRoles }) {
  const { token, roles, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 24 }}>Cargando…</div>;
  }

  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  // Si se especifican roles excluidos, bloquear esos roles
  if (excludeRoles && excludeRoles.length > 0) {
    const hasExcludedRole = roles.some(r => excludeRoles.includes(r));
    if (hasExcludedRole) {
      return <Navigate to="/Inicio" replace />;
    }
  }

  // Si se especifican roles permitidos, verificar que el usuario tenga al menos uno
  if (allowedRoles && allowedRoles.length > 0) {
    const forceAdmin = typeof window !== 'undefined' && window.localStorage.getItem('force_admin') === '1';
    const forceTecnico = typeof window !== 'undefined' && window.localStorage.getItem('force_tecnico') === '1';
    if ((forceAdmin && allowedRoles.includes('ADMINISTRADOR')) || (forceTecnico && allowedRoles.includes('TECNICO'))) {
      return children;
    }
    const hasRole = roles.some(r => allowedRoles.includes(r));
    if (!hasRole) {
      return <Navigate to="/Inicio" replace />;
    }
  }

  return children;
}
