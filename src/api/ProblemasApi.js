import { getJson } from './http';

/**
 * Obtiene todos los problemas disponibles para reportar
 * @returns {Promise<Array>} Lista de problemas con id y descripción
 */
export const obtenerProblemas = async () => {
  try {
    return await getJson(`/api/problemas/descripcion`);
  } catch (error) {
    if (error.message?.toLowerCase().includes("failed to fetch") || error.message?.includes("NetworkError")) {
      throw new Error("No se pudo conectar con el servidor");
    }
    throw error;
  }
};
