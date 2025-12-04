import { getToken, clearToken } from './AuthApi';

const BASE_URL = 'http://localhost:8081';

// Función para decodificar el token JWT y obtener el usuario
export function getCurrentUser() {
    // Primero intenta obtener el usuario del localStorage (guardado por AuthContext)
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
        try {
            return JSON.parse(usuarioGuardado);
        } catch (e) {
            console.error('Error al parsear usuario guardado:', e);
        }
    }

    // Si no está el usuario guardado, intenta decodificar el token JWT
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
        // Remover "Bearer " si existe en el token
        const jwtToken = token.replace(/^Bearer\s+/i, '');
        // Decodifica el payload del JWT
        const payload = JSON.parse(atob(jwtToken.split('.')[1]));
        // Retorna el usuario del payload
        return {
            id: payload.id || payload.userId || payload.sub,
            username: payload.username || payload.sub,
            roles: payload.roles || []
        };
    } catch (e) {
        console.error('Error al decodificar token JWT:', e);
        return null;
    }
}

export async function authorizedFetch(path, options = {}) {
  const token = getToken();
  console.log("[AUTH] Token presente:", !!token);
  if (token) {
    console.log("[AUTH] Token value:", token.substring(0, 30) + "...");
  }
  
  const headers = new Headers(options.headers || {});
  if (token) {
    const authValue = /^Bearer\s+/i.test(token) ? token : `Bearer ${token}`;
    headers.set('Authorization', authValue);
  } else {
    console.warn("[AUTH] No hay token - la peticion fallara si requiere autenticacion");
  }
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  console.log("[FETCH] Request a:", `${BASE_URL}${path}`);
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  console.log("[FETCH] Response status:", res.status);

  if (res.status === 401 || res.status === 403) {
    console.error("[AUTH] Error de autenticacion/autorizacion - Status:", res.status);
    console.error("[AUTH] Path:", path);
    
    // Clonar la respuesta antes de leer el body
    const resClone = res.clone();
    const errorText = await resClone.text();
    console.error("[AUTH] Error response:", errorText);
    
    // Solo redirigir si es 401 (no autenticado), no en 403 (no autorizado)
    if (res.status === 401) {
      console.error("[AUTH] Token invalido o expirado - redirigiendo a login");
      clearToken();
      window.location.href = '/login';
    }
  }

  return res;
}

export async function getJson(path) {
  const res = await authorizedFetch(path, { method: 'GET' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${res.status}`);
  }
  return res.json();
}
