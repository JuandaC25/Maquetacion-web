import { getJson, authorizedFetch } from './http';

export const obtenerUsuarios = async () => {
    try {
        return await getJson('/api/Usuarios');
    } catch (error) {
        if (error.message?.toLowerCase().includes('failed to fetch') || error.message?.includes('NetworkError')) {
            throw new Error('No se pudo conectar con el servidor');
        }
        throw error;
    }
};

export const obtenerUsuarioPorId = async (id) => {
    try {
        return await getJson(`/api/Usuarios/${id}`);
    } catch (error) {
        if (error.message?.toLowerCase().includes('failed to fetch') || error.message?.includes('NetworkError')) {
            throw new Error('No se pudo conectar con el servidor');
        }
        throw error;
    }
};

export const crearUsuario = async (data) => {
    try {
        const res = await authorizedFetch('/api/Usuarios', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
            let msg = 'Error al crear usuario';
            try { const e = await res.json(); msg = e.error || e.message || msg; } catch {}
            throw new Error(msg);
        }
        return await res.json();
    } catch (error) {
        if (error.message?.toLowerCase().includes('failed to fetch') || error.message?.includes('NetworkError')) {
            throw new Error('No se pudo conectar con el servidor');
        }
        throw error;
    }
};

export const eliminarUsuario = async (id) => {
    try {
        const res = await authorizedFetch(`/api/Usuarios/${id}`, { method: 'DELETE' });
        if (res.status === 204) return null;
        if (!res.ok) {
            let msg = 'Error al eliminar usuario';
            try { const e = await res.json(); msg = e.error || e.message || msg; } catch {}
            throw new Error(msg);
        }
        return await res.json();
    } catch (error) {
        if (error.message?.toLowerCase().includes('failed to fetch') || error.message?.includes('NetworkError')) {
            throw new Error('No se pudo conectar con el servidor');
        }
        throw error;
    }
};

export const actualizarUsuario = async (id, data) => {
    try {
        const res = await authorizedFetch(`/api/Usuarios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            let msg = 'Error al actualizar usuario';
            try { const e = await res.json(); msg = e.error || e.message || msg; } catch {}
            throw new Error(msg);
        }
        return await res.json();
    } catch (error) {
        if (error.message?.toLowerCase().includes('failed to fetch') || error.message?.includes('NetworkError')) {
            throw new Error('No se pudo conectar con el servidor');
        }
        throw error;
    }
};

export const uploadUsuariosMasivos = async (file) => {
    try {
        const form = new FormData();
        form.append('file', file);
        const res = await authorizedFetch('/api/Usuarios/upload', {
            method: 'POST',
            body: form,
        });
        if (!res.ok) {
            let msg = 'Error al subir archivo';
            try { const e = await res.json(); msg = e.error || e.message || msg; } catch {}
            throw new Error(msg);
        }
        return await res.json();
    } catch (error) {
        if (error.message?.toLowerCase().includes('failed to fetch') || error.message?.includes('NetworkError')) {
            throw new Error('No se pudo conectar con el servidor');
        }
        throw error;
    }
};