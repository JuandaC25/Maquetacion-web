import { authorizedFetch } from './http';

const BASE_URL = '/api/categoria'

export const obtenerCategoria = async ()=> {
    try{
        const res = await authorizedFetch(BASE_URL);
        if (!res.ok) {
            throw new Error("Error al obtener los categorias");
        }
        return await res.json();
    }catch (error) {
        if (error.message && (error.message.includes ("failes to fetch") || error.message.includes("NetworkError"))) {
            throw new Error("No se pudo conectar con el servidor");
        }
        throw error;
    }
};


export const obtenerCategoriaPorId = async (id) => {
    try{
        const res = await authorizedFetch(`${BASE_URL}/${id}`, {
            method: "GET",
        });
        if (!res.ok) throw new Error("Categoria no encontrada");
        return await res.json();
    } catch (error) {
        if (error.message && (error.message.includes("failed to fetch") || error.message.includes("NetwrokError"))) {
            throw new Error("No se pudo conectar con el servidor"); 
        }
        throw error;
    }
};

export const crearCategoria = async (data) => {
    try {
        console.log('📤 Enviando categoría:', data);
        
        const res = await authorizedFetch(BASE_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(data),
        });

        console.log('📨 Respuesta del servidor - Status:', res.status);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('❌ Error del servidor:', errorData);
            
            if (res.status === 409) {
                throw new Error(errorData.errores1 || errorData.message || "Ya existe una categoría con ese nombre");
            } else if (res.status === 500) {
                throw new Error(errorData.error || errorData.message || "Error interno del servidor");
            } else if (res.status === 400) {
                throw new Error(errorData.error || errorData.message || "Datos inválidos");
            } else {
                throw new Error(errorData.message || errorData.error || `Error ${res.status} al crear la categoría`);
            }
        }
        
        const result = await res.json();
        console.log('✅ Categoría creada:', result);
        return result;
    } catch (error) {
        console.error('❌ Error en crearCategoria:', error);
        if (error.message && (error.message.includes("failed to fetch") || error.message.includes("NetworkError"))) {
            throw new Error("No se pudo conectar con el servidor");
        }
        throw error;
    }
};

export const actualizarCategoria = async (id, data) => {
    try {
        console.log('📤 Actualizando categoría:', id, data);
        
        const res = await authorizedFetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(data),
        });

        console.log('📨 Respuesta del servidor - Status:', res.status);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('❌ Error del servidor:', errorData);
            
            if (res.status === 409 || res.status === 400) {
                throw new Error(errorData.error || errorData.message || "Error al actualizar la categoría");
            } else if (res.status === 404) {
                throw new Error("Categoría no encontrada");
            } else if (res.status === 500) {
                throw new Error(errorData.error || errorData.message || "Error interno del servidor");
            } else {
                throw new Error(errorData.error || errorData.message || `Error ${res.status} al actualizar la categoría`);
            }
        }
        
        const result = await res.json();
        console.log('✅ Categoría actualizada:', result);
        return result;
    } catch (error) {
        console.error('❌ Error en actualizarCategoria:', error);
        if (error.message && (error.message.includes("failed to fetch") || error.message.includes("NetworkError"))) {
            throw new Error("No se pudo conectar con el servidor");
        }
        throw error;
    }
};

export const eliminarCategoria = async (id) => {
    try {
        const res = await authorizedFetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
        });

        if (res.status === 204) {
            return { success: true, message: "Categoría eliminada correctamente" };
        }
        let body = null;
        try {
            body = await res.json();
        } catch (e) {
            try {
                body = await res.text();
            } catch (e2) {
                body = null;
            }
        }

        if (res.status === 403) {
            const msg = (body && (body.message || body.error)) || (typeof body === 'string' && body) || 'No tienes permisos para eliminar categorías (403)';
            throw new Error(msg);
        }

        const fallback = (body && (body.message || body.error)) || (typeof body === 'string' && body) || `Error ${res.status} al eliminar la categoría`;
        throw new Error(fallback);
    } catch (error) {
        if (error.message && (error.message.includes("failed to fetch") || error.message.includes("NetworkError"))) {
            throw new Error("No se pudo conectar con el servidor");
        }
        throw error;
    }
};

export const actualizarEstadoCategoria = async (id, estado) => {
    try {
        const res = await authorizedFetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `Error ${res.status} al actualizar estado de la categoría`);
        }

        return await res.json();
    } catch (error) {
        if (error.message && (error.message.includes("failed to fetch") || error.message.includes("NetworkError"))) {
            throw new Error("No se pudo conectar con el servidor");
        }
        throw error;
    }
};
