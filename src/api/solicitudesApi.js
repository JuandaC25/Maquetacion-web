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
    const res = await authorizedFetch('/api/solicitudes', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || 'Error al crear la solicitud');
    }
    const text = await res.text();
    try { return text ? JSON.parse(text) : {}; } catch { return text; }
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