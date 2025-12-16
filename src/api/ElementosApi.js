import { authorizedFetch } from './http';

const API_URL = '/api/elementos';

class ElementosService {
  async obtenerElementos() {
    try {
      const response = await authorizedFetch(API_URL);
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
      const response = await authorizedFetch(`${API_URL}/${id}`);
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
      
      const response = await authorizedFetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(elemento),
      });

      console.log('📨 Respuesta del servidor - Status:', response.status);
      
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          console.error('❌ No se pudo parsear la respuesta de error como JSON:', e);
        }
        
        console.error('❌ Error del servidor:', errorData);
        console.error('❌ Status:', response.status);
        console.error('❌ Status Text:', response.statusText);
        
        if (response.status === 403) {
          throw new Error('Acceso denegado. Por favor, cierra sesión y vuelve a iniciar sesión.');
        } else if (response.status === 401) {
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        } else if (response.status === 409) {
          throw new Error(errorData.error || errorData.errores1 || errorData.mensaje || 'El elemento ya existe');
        } else if (response.status === 400) {
          throw new Error(errorData.message || errorData.error || 'Datos inválidos');
        } else if (response.status === 500) {
          throw new Error(errorData.detalle || errorData.error || 'Error interno del servidor');
        } else {
          throw new Error(errorData.message || errorData.error || `Error ${response.status}`);
        }
      }
      
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        responseData = text ? JSON.parse(text) : { success: true };
      } else {
        responseData = { success: true };
      }
      
      console.log('✅ Elemento creado:', responseData);
      return responseData.data || responseData;
      
    } catch (error) {
      console.error('Error en crearElemento:', error);
      throw error;
    }
  }

  async eliminarElemento(id) {
    try {
      const response = await authorizedFetch(`${API_URL}/${id}`, {
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

  async actualizarElemento(id, data) {
    try {
      const response = await authorizedFetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      console.log('Respuesta actualización - Status:', response.status);

      if (!response.ok) {
        let errorData = {};
        try { errorData = await response.json(); } catch (e) { console.error('No JSON in error response', e); }

        if (response.status === 403) {
          throw new Error('Acceso denegado. Solo un administrador puede realizar esta acción.');
        } else if (response.status === 401) {
          throw new Error('No autorizado. Por favor inicia sesión.');
        } else if (response.status === 400) {
          throw new Error(errorData.message || errorData.error || 'Solicitud inválida');
        } else if (response.status === 500) {
          throw new Error(errorData.detalle || errorData.error || 'Error interno del servidor');
        }

        throw new Error(errorData.error || errorData.message || `Error ${response.status}`);
      }

      const json = await response.json();
      return json.data || json;
    } catch (error) {
      console.error('Error al actualizar elemento:', error);
      throw error;
    }
  }

  async uploadExcel(formData) {
    try {
      const response = await authorizedFetch(`${API_URL}/bulk-upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorData = {};
        try { errorData = await response.json(); } 
        catch(e) {
          console.error('No se pudo parsear la respuesta de error como JSON:', e);
        }
        throw new Error(errorData.error || errorData.message || `Error ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al subir Excel:', error);
      throw error;
    }
  }

  async downloadTemplate() {
    try {
      const response = await authorizedFetch(`${API_URL}/template`, {
        method: 'GET',
      });

      if (!response.ok) {
        let errorData = {};
        try { errorData = await response.json(); }
         catch(e) {
          console.error('No se pudo parsear la respuesta de error como JSON:', e);
         }
        throw new Error(errorData.error || errorData.message || `Error ${response.status}`);
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error al descargar plantilla:', error);
      throw error;
    }
  }
}

export default new ElementosService();