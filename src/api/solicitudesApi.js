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
        // 🚨 Importante: asegurar Content-Type para la petición PUT 🚨
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorText = await res.text().catch(() => 'No hay mensaje de error en el cuerpo.');
        console.error(`Fallo de la API: Estado HTTP ${res.status}. Mensaje de error completo:`, errorText);
        throw new Error(`Error ${res.status} al actualizar solicitud: ${errorText}`);
    }
    const text = await res.text();
    try { return text ? JSON.parse(text) : {}; } catch { return text; }
};

export const actualizarEstadoSolicitud = async (id, estado) => {
    // ✅ CORRECCIÓN APLICADA: Usamos 'est_soli' para coincidir con el modelo de datos que lees en el frontend.
    return await actualizarSolicitud(id, { est_soli: estado }); 
};

export const verificarDisponibilidadEspacio = async (id_esp, fecha_ini, fecha_fn) => {
    try {
        const solicitudes = await obtenersolicitudes();
        
        console.log('[DEBUG] Todas las solicitudes:', solicitudes);
        console.log('[DEBUG] Primera solicitud completa:', solicitudes[0]);
        console.log('[DEBUG] Buscando conflictos para espacio ID:', id_esp);
        
        // Filtrar solicitudes del mismo espacio que estén activas
        // Verificar diferentes nombres de campos posibles
        const solicitudesDelEspacio = solicitudes.filter(sol => {
            const idEspacio = sol.id_esp || sol.id_espa || sol.idEsp || sol.espacio?.id;
            const estado = sol.estadosoli || sol.estado_soli || sol.est_soli || sol.estadoSoli;
            
            console.log(`[DEBUG] Solicitud ${sol.id_soli || sol.id}:`, {
                todosLosCampos: Object.keys(sol),
                idEspacio,
                estado,
                solCompleta: sol
            });
            
            const mismoEspacio = idEspacio == id_esp; // Usar == para comparar number/string
            const estadoActivo = estado !== 3 && estado !== 5 && estado !== 'Rechazado' && estado !== 'Finalizado';
            
            console.log(`[DEBUG] mismoEspacio=${mismoEspacio}, activo=${estadoActivo}`);
            
            return mismoEspacio && estadoActivo;
        });

        console.log('[DEBUG] Solicitudes del mismo espacio activas:', solicitudesDelEspacio);

        const nuevaInicio = new Date(fecha_ini);
        const nuevaFin = new Date(fecha_fn);

        console.log('[DEBUG] Nueva reserva:', { inicio: nuevaInicio, fin: nuevaFin });

        // Verificar si hay conflicto de horarios
        for (const sol of solicitudesDelEspacio) {
            const solicitudInicio = new Date(sol.fecha_ini);
            const solicitudFin = new Date(sol.fecha_fn);

            console.log(`[DEBUG] Comparando con solicitud ${sol.id_soli || sol.id}:`, { 
                inicio: solicitudInicio, 
                fin: solicitudFin 
            });

            // Verificar si hay solapamiento de horarios
            const hayConflicto = !(nuevaFin <= solicitudInicio || nuevaInicio >= solicitudFin);

            console.log(`[DEBUG] ¿Hay conflicto? ${hayConflicto}`);

            if (hayConflicto) {
                return {
                    disponible: false,
                    mensaje: `El espacio ya está reservado desde ${solicitudInicio.toLocaleString('es-ES')} hasta ${solicitudFin.toLocaleString('es-ES')}`
                };
            }
        }

        console.log('[DEBUG] No se encontraron conflictos. Espacio disponible.');
        return { disponible: true };
    } catch (error) {
        console.error('Error al verificar disponibilidad:', error);
        throw error;
    }
};

// Nueva función para cancelar solicitud como instructor
export async function cancelarSolicitudComoInstructor(id, data, token) {
    const res = await authorizedFetch(`/api/solicitudes/cancelar/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorText = await res.text().catch(() => 'No hay mensaje de error en el cuerpo.');
        throw new Error(`Error ${res.status} al cancelar solicitud: ${errorText}`);
    }
    const text = await res.text();
    try { return text ? JSON.parse(text) : {}; } catch { return text; }
}