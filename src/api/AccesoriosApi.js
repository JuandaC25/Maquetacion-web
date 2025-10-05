
export const obtenerAccesorios = async () => {
    try{
        const res = await fetch(`http://localhost:8081/api/accesorios`);
        if(!res.ok){
            throw new Error ("Error al obtener los accesorios");
        }
        return await res.json();
    } catch (error) {
        if(error.message.includes("failed to fetch") || error.message.includes("NetworkError")){
            throw new Error("No se pudo conectar con el servidor");
        }
    }
};

export const obtenerAccesorioPorId = async (id) =>{
    const res = await fetch (`http://localhost:8081/api/accesorios/${id}`,{
        method:"GET",
    });
    if(!res.ok) throw new Error("Accesorio no encontrado");
    return res.json();
}

const BASE_URL = 'http://localhost:8080/api/accesorios';


export const crearAccesorio = async (data) => {
    try {
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json();
            if (res.status === 409) {
                throw new Error(errorData.errores1 || "Conflicto al crear el accesorio");
            } else if (res.status === 500) {
                throw new Error(errorData.error || "Error interno del servidor");
            } else {
                throw new Error("Error al crear el accesorio");
            }
        }
        
        return res.json();
    } catch (error) {
        if (error.message.includes("failed to fetch") || error.message.includes("NetworkError")) {
            throw new Error("No se pudo conectar con el servidor");
        }
        throw error;
    }
};

export const eliminarAccesorio = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
        });
        
        if (res.status !== 204) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al eliminar el accesorio");
        }

        return { success: true, message: "Accesorio eliminado correctamente" };
    } catch (error) {
        if (error.message.includes("failed to fetch") || error.message.includes("NetworkError")) {
            throw new Error("No se pudo conectar con el servidor");
        }
        throw error;
    }
};
