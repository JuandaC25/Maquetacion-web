const API_URL = 'http://localhost:8080/api/elementos';

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
      console.log('📤 Enviando elemento al backend:', elemento);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(elemento),
      });

      console.log('📨 Respuesta del servidor - Status:', response.status);
      
      const responseData = await response.json();
      console.log('📨 Respuesta del servidor - Data:', responseData);
      
      if (!response.ok) {
        // Manejar errores específicos del backend
        if (response.status === 409) {
          throw new Error(`Conflicto: ${responseData.errores1 || responseData.mensaje || 'El elemento ya existe'}`);
        } else if (response.status === 400) {
          throw new Error(`Error de validación: ${responseData.message || 'Datos inválidos'}`);
        } else if (response.status === 500) {
          throw new Error(`Error interno del servidor: ${responseData.detalle || responseData.error || 'Error 500'}`);
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }
      
      // Ajusta según la estructura de respuesta de tu backend
      // Si tu backend devuelve { "data": {...} } o directamente el objeto
      return responseData.data || responseData;
      
    } catch (error) {
      console.error('💥 Error en crearElemento:', error);
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