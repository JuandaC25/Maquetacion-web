import { getJson, authorizedFetch } from './http';

export const obtenerticketsActivos = async () => {
  try{
    return await getJson(`/api/tickets/activos`);
  }catch(error){
    if(error.message?.toLowerCase().includes("failed to fetch") || error.message?.includes("NetworkError")){
      throw new Error("No se pudo conectar con el servidor");
    }
    throw error;
  }
};
export const obtenertickets = async () => {
  try{
    return await getJson(`/api/tickets`);
  }catch(error){
    if(error.message?.toLowerCase().includes("failed to fetch") || error.message?.includes("NetworkError")){
      throw new Error("No se pudo conectar con el servidor");
    }
    throw error;
  }
};
export const crearTicket = async (data) => {
  try {
    const res = await authorizedFetch(`/api/tickets`, {
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
  const res = await authorizedFetch(`/api/tickets/${id}`,{
    method:"GET",
  });
  if(!res.ok) throw new Error("Ticket no encontrado");
  return res.json();
}


export const eliminarTickets = async (id) =>{
  const res = await authorizedFetch(`/api/tickets/${id}`,{
    method: "DELETE",
  });
  if(res.status !== 204) {
    return res.json();
  }

  return null
}