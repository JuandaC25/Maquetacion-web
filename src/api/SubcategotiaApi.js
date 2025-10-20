export const obtenersolicitudes = async () => {
    try{
        const res = await fetch(`http://localhost:8081/api/subcategoria`);
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
    const res = await fetch (`http://localhost:8081/api/subcategoria/${id}`,{
        method:"GET",
    });
    if(!res.ok) throw new Error("Solicitud no encontrada");
    return res.json();
}

export const crearSubcategoria = async (data) =>{
    const res = await fetch (`http://localhost:8081/api/subcategoria`, {
        method: "POST",
        headers:{ "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear la solicitud");
    return res.json();
}

export const eliminarSubcategoria = async (id) =>{
    const res = await fetch(`http://localhost:8081/api/subcategoria/${id}`,{
        method: "DELETE",
    });
    if(res.status !== 204) {
        return res.json();
    }
    return null
}