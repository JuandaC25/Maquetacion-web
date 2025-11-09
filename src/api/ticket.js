import { authorizedFetch } from './http';

const API_URL = '/api/tickets';

/**
 * Crea un nuevo ticket de reporte de equipo
 * @param {Object} ticketData - Datos del ticket
 * @param {number} ticketData.id_elem - ID del elemento
 * @param {number} ticketData.id_problem - ID del problema
 * @param {string} ticketData.ambient - Ambiente/ubicación
 * @param {string} ticketData.obser - Observaciones
 * @param {number} ticketData.id_usu - ID del usuario
 * @param {string} ticketData.fecha_in - Fecha de inicio en formato ISO
 * @returns {Promise<Object>} Ticket creado
 */
export const crearTicket = async (ticketData) => {
  try {
    console.log("[TICKET] Creando ticket:", ticketData);
    const res = await authorizedFetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[TICKET] Error response:", errorText);
      throw new Error(`Error al crear ticket: ${res.status}`);
    }

    const data = await res.json();
    console.log("[TICKET] Ticket creado exitosamente:", data);
    return data;
  } catch (error) {
    console.error("[TICKET] Error al crear ticket:", error);
    throw error;
  }
};

/**
 * Obtiene todos los tickets
 * @returns {Promise<Array>} Lista de tickets
 */
export const obtenerTickets = async () => {
  try {
    const res = await authorizedFetch(API_URL, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error(`Error al obtener tickets: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("[TICKET] Error al obtener tickets:", error);
    throw error;
  }
};

/**
 * Obtiene un ticket por ID
 * @param {number} id - ID del ticket
 * @returns {Promise<Object>} Ticket encontrado
 */
export const obtenerTicketPorId = async (id) => {
  try {
    const res = await authorizedFetch(`${API_URL}/${id}`, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error(`Error al obtener ticket: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("[TICKET] Error al obtener ticket por ID:", error);
    throw error;
  }
};

/**
 * Actualiza un ticket
 * @param {number} id - ID del ticket
 * @param {Object} ticketData - Datos actualizados del ticket
 * @returns {Promise<Object>} Ticket actualizado
 */
export const actualizarTicket = async (id, ticketData) => {
  try {
    console.log("[TICKET] Actualizando ticket ID:", id);
    console.log("[TICKET] Datos a enviar:", JSON.stringify(ticketData, null, 2));
    
    const res = await authorizedFetch(`${API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData),
    });

    console.log("[TICKET] Respuesta del servidor - Status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[TICKET] Error response:", errorText);
      throw new Error(`Error al actualizar ticket: ${res.status} - ${errorText}`);
    }

    const resultado = await res.json();
    console.log("[TICKET] Ticket actualizado exitosamente:", resultado);
    return resultado;
  } catch (error) {
    console.error("[TICKET] Error al actualizar ticket:", error);
    throw error;
  }
};

/**
 * Elimina un ticket
 * @param {number} id - ID del ticket
 * @returns {Promise<void>}
 */
export const eliminarTicket = async (id) => {
  try {
    const res = await authorizedFetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (res.status !== 204 && !res.ok) {
      throw new Error(`Error al eliminar ticket: ${res.status}`);
    }

    return null;
  } catch (error) {
    console.error("[TICKET] Error al eliminar ticket:", error);
    throw error;
  }
};
