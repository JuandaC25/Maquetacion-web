import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getToken } from '../api/AuthApi';
import { authorizedFetch } from '../api/http';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMe = async () => {
    const t = getToken();
    if (!t) {
      setUser(null);
      setRoles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await authorizedFetch('/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setRoles(data?.roles || []);
      } else {
        setUser(null);
        setRoles([]);
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
      setUser(null);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, [token]);

  const value = useMemo(() => ({
    token: getToken(),
    user,
    roles,
    loading,
    refreshMe: loadMe,
  }), [user, roles, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
