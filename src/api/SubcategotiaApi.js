import { authorizedFetch } from './http';

export const obtenersolicitudes = async () => {
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
            throw new Error(errorData.message || errorData.error || `Error ${res.status} al crear la subcategoría`);
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

export const eliminarSubcategoria = async (id) =>{
    const res = await authorizedFetch(`/api/subcategoria/${id}`,{
        method: "DELETE",
    });
    if(res.status !== 204) {
        return res.json();
    }
    return null
}