import { getJson, authorizedFetch } from './http';

export const obtenerProblemas = async () => {
  try {
    return await getJson(`/api/problemas/descripcion`);
  } catch (error) {
    if (error.message?.toLowerCase().includes('failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error('No se pudo conectar con el servidor');
    }
    throw error;
  }
};

export const crearProblema = async (problema) => {
  try {
    const payload = {
      tipo_problema: problema.tipo ?? problema.tipo_problema ?? '',
      descr_problem: problema.descripcion ?? problema.descr_problem ?? problema.descripcion_problem ?? ''
    };

    const res = await authorizedFetch(`/api/problemas`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      try {
        const jsonErr = JSON.parse(text);
        throw new Error(jsonErr.message || jsonErr.error || JSON.stringify(jsonErr));
      } catch (e) {
        throw new Error(text || `Error ${res.status}`);
      }
    }

    return await res.json();
  } catch (error) {
    if (error.message?.toLowerCase().includes('failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error('No se pudo conectar con el servidor');
    }
    throw error;
  }
};

