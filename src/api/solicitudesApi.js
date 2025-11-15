import { getJson, authorizedFetch } from './http';

export const obtenersolicitudes = async () => {
    try {
        return await getJson('/api/solicitudes');
    } catch (error) {
        if ((error.message || '').toLowerCase().includes('failed to fetch') || error.message.includes('No se pudo conectar')) {
            throw new Error('No se pudo conectar con el servidor');
        }
        throw error;
    }
};

export const obtenerSolicitudesPorid = async (id) => {
    try {
        return await getJson(`/api/solicitudes/${id}`);
    } catch (error) {
        throw new Error('Solicitud no encontrada: ' + (error?.message || ''));
    }
}

export const crearSolicitud = async (data) => {
    try {
        const res = await authorizedFetch('/api/solicitudes', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            let errorMessage = `Error ${res.status}: Fallo al crear la solicitud.`;
            try {
                const errorResponse = await res.clone().json();
                errorMessage = errorResponse.message
                    || errorResponse.error
                    || JSON.stringify(errorResponse);
            } catch (e) {
                errorMessage = `${res.statusText}: No se pudo leer el mensaje detallado del servidor.`;
            }
            throw new Error(errorMessage);
        }

        const text = await res.text();
        try { return text ? JSON.parse(text) : {}; } catch { return text; }
    } catch (error) {
        if ((error.message || '').toLowerCase().includes('failed to fetch') || error.message.includes('No se pudo conectar')) {
            throw new Error('No se pudo conectar con el servidor');
        }
        throw error;
    }
}

export const eliminarSolicitud = async (id) => {
    const res = await authorizedFetch(`/api/solicitudes/${id}`, {
        method: 'DELETE',
    });
    if (res.status === 204) return null;
    const text = await res.text();
    try { return text ? JSON.parse(text) : {}; } catch { return text; }
}

export const actualizarSolicitud = async (id, data) => {
    const res = await authorizedFetch(`/api/solicitudes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || 'Error al actualizar la solicitud');
    }
    const text = await res.text();
    try { return text ? JSON.parse(text) : {}; } catch { return text; }
};

export const actualizarEstadoSolicitud = async (id, estado) => {
    return await actualizarSolicitud(id, { estado: estado });
};