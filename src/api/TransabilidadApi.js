import { authorizedFetch } from './http';

const API_URL = '/api/trasabilidad';


export const obtenerHistorialPorTicket = async (ticketId) => {
  try {
    const res = await authorizedFetch(`${API_URL}/ticket/${ticketId}`, {
      method: 'GET',
    });
    if (!res.ok) {
      throw new Error(`Error al obtener historial: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('[TRANSABILIDAD] Error al obtener historial:', error);
    throw error;
  }
};

export const editarHistorial = async (historialId, data) => {
  try {
    const res = await authorizedFetch(`${API_URL}/${historialId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`Error al editar historial: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('[TRANSABILIDAD] Error al editar historial:', error);
    throw error;
  }
};
