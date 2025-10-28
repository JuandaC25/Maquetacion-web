import { getToken, clearToken } from './AuthApi';

const BASE_URL = 'http://localhost:8081';

export async function authorizedFetch(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', token); // token incluye 'Bearer '
  }
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 || res.status === 403) {
    // Token inválido o no autorizado: limpiar y opcionalmente redirigir
    clearToken();
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
