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
    const res = await fetch(`http://localhost:8081/api/solicitudes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        let errorMessage = `Error ${res.status}: Fallo al crear la solicitud.`;
        
        // 🔑 CORRECCIÓN CRÍTICA: Intenta leer el cuerpo JSON del error
        try {
            // Clona la respuesta antes de intentar leer el JSON, por si el fetch es estricto
            const errorResponse = await res.clone().json(); 
            
            // Busca el mensaje de error en campos comunes de Spring Boot (message, error, errors)
            errorMessage = errorResponse.message
                            || errorResponse.error
                            || JSON.stringify(errorResponse); // Si no encuentra campo, muestra todo el JSON

        } catch (e) {
            console.error("Error al leer el cuerpo de la respuesta:", e);
            // Si falla al leer el JSON, simplemente usamos el estado y texto de la respuesta
            errorMessage = `${res.statusText}: No se pudo leer el mensaje detallado del servidor.`;
        }
        
        // Lanza el error capturado
        throw new Error(errorMessage);
    }
    
    // Si la respuesta es exitosa (res.ok es true), devuelve el JSON
    return res.json();
    try {
        const res = await authorizedFetch('/api/solicitudes', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const text = await res.text().catch(() => null);
            throw new Error(text || `Error al crear la solicitud (status ${res.status})`);
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