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
    const res = await fetch (`http://localhost:8080/api/solicitudes/${id}`,{
        method:"GET",
    });
    if(!res.ok) throw new Error("Solicitud no encontrada");
    return res.json();
}

export const crearSolicitud = async (data) =>{
    const res = await fetch (`http://localhost:8080/api/solicitudes`, {
        method: "POST",
        headers:{ "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear la solicitud");
    return res.json();
}

export const eliminarSolicitud = async (id) =>{
    const res = await fetch(`http://localhost:8080/api/solicitudes/${id}`,{
        method: "DELETE",
    });
    if(res.status !== 204) {
        return res.json();
    }

    return null
}