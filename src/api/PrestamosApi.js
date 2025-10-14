const API_URL = 'http://localhost:8081/api/prestamos';

class PrestamosServices{

//Obtener prestamos
    async obtenerPrestamos() {
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

//Eliminar prestamo
  async eliminarPrestamo(id) {
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
