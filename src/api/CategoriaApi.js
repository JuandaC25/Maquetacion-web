const BASE_URL = 'http://localhost:8081/api/categoria'

export const obtenerCategoria = async ()=> {
    try{
        const res = await fetch(BASE_URL);
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
        const res = await fetch(`${BASE_URL}/${id}`, {
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
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            if (res.status === 409) {
                throw new Error(errorData.errores1 || "Conflicto al crear el categoria");
            } else if (res.status === 500) {
                throw new Error(errorData.error || "Error interno del servidor");
            } else {
                throw new Error("Error al crear el categoria");
            }
        }
        return await res.json();
    } catch (error) {
        if (error.message && (error.message.includes("failed to fetch") || error.message.includes("NetworkError"))) {
            throw new Error("No se pudo conectar con el servidor");
        }
        throw error;
    }
};

export const eliminarCategoria = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
        });

        if (res.status !== 204 && !res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al eliminar el categoria");
        }

        return { success: true, message: "categoria eliminado correctamente" };
    } catch (error) {
        if (error.message && (error.message.includes("failed to fetch") || error.message.includes("NetworkError"))) {
            throw new Error("No se pudo conectar con el servidor");
        }
        throw error;
    }
};
