export const obtenersolicitudes = async () => {
    try{
        const res = await fetch(`http://localhost:8081/api/solicitudes`);
        if(!res.ok){
            throw new Error ("Error al obtener las solicitudes");
        }
        return await res.json();
    }catch(error){
        if(error.message.includes("failed to fetch") || error.message.includes("NetworkError")){
            throw new Error("No se pudo conectar con el servidor");
        }
    }
};
export const obtenerSolicitudesPorid = async (id) =>{
    const res = await fetch (`http://localhost:8081/api/solicitudes/${id}`,{
        method:"GET",
    });
    if(!res.ok) throw new Error("Solicitud no encontrada");
    return res.json();
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
}

export const eliminarSolicitud = async (id) =>{
    const res = await fetch(`http://localhost:8081/api/solicitudes/${id}`,{
        method: "DELETE",
    });
    if(res.status !== 204) {
        return res.json();
    }

    return null
}