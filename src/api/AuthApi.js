const BASE_URL = 'http://localhost:8081';

export async function login({ username, password }) {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Respuesta inválida del servidor: ${text}`);
    }

    if (!res.ok) {
      const msg = data?.error || data?.message || 'Credenciales incorrectas';
      throw new Error(msg);
    }

    const token = data?.token || data?.accessToken || data?.bearer || '';
    if (!token) {
      throw new Error('No se recibió el token de autenticación');
    }

    const estado = data.est_usu ?? data.estadousuario ?? data.estado ?? data.nom_est ?? 1;
    const estadoNum = Number(estado);
    
    if (estadoNum === 2) {
      throw new Error('❌ Usuario desactivado. No tiene permiso para acceder a la plataforma. Contacte con administrador.');
    }

    return { token };
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8081');
    }
    throw error;
  }
}

export function saveToken(token) {
  localStorage.setItem('auth_token', token);
}

export function getToken() {
  return localStorage.getItem('auth_token');
}

export function clearToken() {
  localStorage.removeItem('auth_token');
}
