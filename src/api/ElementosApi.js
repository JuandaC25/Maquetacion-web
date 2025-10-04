const API_URL = 'http://localhost:8081/api/elementos';

class ElementosService {
  async obtenerElementos() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener elementos:', error);
      throw error;
    }
  }
  async obtenerPorId(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener elemento por ID:', error);
        throw error;
    }
}
 async crearElemento(elemento) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(elemento),
        });

        const responseData = await response.json();
        if (!response.ok) {
            if (response.status === 400) {
                throw new Error(`el elemento ya existe ${responseData.message}`);
            }
            throw new Error(`Error al crear elemento ${response.status}: ${response.statusText}`);
        }
        return responseData.data || responseData;
    } catch (error) {
        console.error('Error al crear elemento:', error);
        throw error;
    }
    }
async eliminarElemento(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar elemento ${response.status}: ${response.statusText}`);
        }
        return true;
    } catch (error) {
        console.error('Error al eliminar elemento:', error);
        throw error;
    }
}
}
export default new ElementosService();
