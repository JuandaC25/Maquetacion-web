import { authorizedFetch } from './http';

export const obtenerSubcategorias = async () => {
    try{
        const res = await authorizedFetch('/api/subcategoria');
        if(!res.ok){
            throw new Error ("Error al obtener las subcategorias");
        }
        return await res.json();
    }catch(error){
        if(error.message.includes("failed to fetch") || error.message.includes("NetworkError")){
            throw new Error("No se pudo conectar con el servidor");
        }
    }
};
export const obtenerSubcategoriaPorid = async (id) =>{
    const res = await authorizedFetch(`/api/subcategoria/${id}`,{
        method:"GET",
    });
    if(!res.ok) throw new Error("Solicitud no encontrada");
    return res.json();
}

export const crearSubcategoria = async (data) =>{
    try {
        console.log('📤 Enviando subcategoría:', data);
        
        const res = await authorizedFetch('/api/subcategoria', {
            method: "POST",
            headers:{ "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        console.log('📨 Respuesta del servidor - Status:', res.status);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('❌ Error del servidor:', errorData);
        
        if (res.status === 409) {
                throw new Error(errorData.errores1 || errorData.message || "Ya existe una subcategoría con ese nombre");
        }else if (res.status === 500) {
                throw new Error(errorData.error || errorData.message || "Error interno del servidor");
        }else if (res.status === 400) {
                throw new Error(errorData.error || errorData.message || "Datos inválidos");
        } else {
        throw new Error(errorData.message || errorData.error || `Error ${res.status} al crear la subcategoría`);
        }
    }
        
        const result = await res.json();
        console.log('✅ Subcategoría creada:', result);
        return result;
    } catch (error) {
        console.error('❌ Error en crearSubcategoria:', error);
        if (error.message && (error.message.includes("failed to fetch") || error.message.includes("NetworkError"))) {
            throw new Error("No se pudo conectar con el servidor");
        }
        throw error;
    }
}

export const actualizarSubcategoria = async (id, data) => {
    try {
        console.log('📤 Actualizando subcategoría:', id, data);
        
        const res = await authorizedFetch(`/api/subcategoria/${id}`, {
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
                throw new Error(errorData.error || errorData.message || "Error al actualizar la subcategoría");
            } else if (res.status === 404) {
                throw new Error("Subcategoría no encontrada");
            } else if (res.status === 500) {
                throw new Error(errorData.error || errorData.message || "Error interno del servidor");
            } else {
                throw new Error(errorData.error || errorData.message || `Error ${res.status} al actualizar la subcategoría`);
            }
        }
        
        const result = await res.json();
        console.log('✅ Subcategoría actualizada:', result);
        return result;
    } catch (error) {
        console.error('❌ Error en actualizarSubcategoria:', error);
        if (error.message && (error.message.includes("failed to fetch") || error.message.includes("NetworkError"))) {
            throw new Error("No se pudo conectar con el servidor");
        }
        throw error;
    }
};

export const eliminarSubcategoria = async (id) =>{
    try { const res = await authorizedFetch(`/api/subcategoria/${id}`, {
        method: "DELETE",
    });

    if (res.status !==204 && !res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al eliminar la subcategoria");
    }
    return {success: true , message: "subcategoria eliminado correctamente"};
    }catch (error) {
        if (error.message && (error.message.includes("failed to fetch") || error.message.includes("NetworkError"))) {
            throw new Error("No se pudo conectar con el servidor");
        }
        throw error;
    }
};

export const actualizarEstadoSubcategoria = async (id, estado) => {
    try {
        const res = await authorizedFetch(`/api/subcategoria/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `Error ${res.status} al actualizar estado de la subcategoría`);
        }

        return await res.json();
    } catch (error) {
        if (error.message && (error.message.includes("failed to fetch") || error.message.includes("NetworkError"))) {
            throw new Error("No se pudo conectar con el servidor");
        }
        throw error;
    }
}