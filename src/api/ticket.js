export const obtenertickets = async () => {
    try{
        const res = await fetch(`http://localhost:8081/api/tickets`);
        if(!res.ok){
            throw new Error ("Error al obtener los tickets");
        }
        return await res.json();
    }catch(error){
        if(error.message.includes("failed to fetch") || error.message.includes("NetworkError")){
            throw new Error("No se pudo conectar con el servidor");
        }
    }
};
export const crearTicket = async (data) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error al crear el ticket: ${text}`);
    }
    return await res.json();
  } catch (error) {
    console.error("❌ Error en crearTicket:", error);
    throw error;
  }
};

export const obtenerTicketsPorid = async (id) =>{
    const res = await fetch (`http://localhost:8080/api/tickets/${id}`,{
        method:"GET",
    });
    if(!res.ok) throw new Error("Ticket no encontrado");
    return res.json();
}


export const eliminarTickets = async (id) =>{
    const res = await fetch(`http://localhost:8080/api/tickets/${id}`,{
        method: "DELETE",
    });
    if(res.status !== 204) {
        return res.json();
    }

    return null
}