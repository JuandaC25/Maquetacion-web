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
