const BASE_URL = 'http://localhost:8081';

/**
 * Solicita la recuperación de contraseña
 * @param {string} email - Correo del usuario
 * @returns {Promise} Respuesta del servidor
 */
export const requestPasswordReset = async (email) => {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || data?.message || 'Error al solicitar recuperación');
    }

    return data;
};

/**
 * Restablece la contraseña usando el token
 * @param {string} token - Token de recuperación
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise} Respuesta del servidor
 */
export const resetPassword = async (token, newPassword) => {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || data?.message || 'Error al restablecer contraseña');
    }

    return data;
};
