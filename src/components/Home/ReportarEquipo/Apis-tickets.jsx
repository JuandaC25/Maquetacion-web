// Helpers para la gestión de Tickets - Consumo directo de APIs
import { useState, useEffect } from 'react';
import { getJson, authorizedFetch } from '../../../api/http';

/**
 * Carga la lista de problemas desde la API
 */
export const cargarProblemasDesdeAPI = async () => {
  try {
    const data = await getJson('/api/problemas/descripcion');
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (err) {
    return { success: false, error: 'No se pudieron cargar los problemas: ' + err.message };
  }
};

/**
 * Convierte un archivo de imagen a Base64
 */
export const convertirImagenABase64 = (archivo) => {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.readAsDataURL(archivo);
    lector.onload = () => resolve(lector.result);
    lector.onerror = (error) => reject(error);
  });
};

/**
 * Sube imágenes al servidor y obtiene las URLs
 */
export const subirImagenesAlServidor = async (imagenes) => {
  try {
    if (imagenes.length === 0) {
      return { success: true, urls: [] };
    }
    
    console.log('Subiendo imágenes al servidor...');
    
    const response = await authorizedFetch('/api/tickets/upload-images', {
      method: 'POST',
      body: JSON.stringify({ images: imagenes }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }
    
    const result = await response.json();
    console.log('URLs de imágenes recibidas:', result.urls);
    
    return { success: true, urls: result.urls };
  } catch (err) {
    console.error('Error al subir imágenes:', err);
    return { success: false, error: 'Error al subir las imágenes: ' + err.message };
  }
};

/**
 * Crea múltiples tickets para diferentes problemas del mismo equipo
 */
export const crearTicketsParaEquipo = async (formData, problemas, imageUrls, idUsuario) => {
  try {
    const problemasNombres = problemas
      .filter(p => formData.problemasSeleccionados.includes(p.id))
      .map(p => p.descr_problem);

    const promesas = formData.problemasSeleccionados.map(async idProblema => {
      const response = await authorizedFetch('/api/tickets', {
        method: 'POST',
        body: JSON.stringify({
          id_elem: parseInt(formData.idElemento),
          id_problem: idProblema,
          ambient: formData.ambiente,
          obser: formData.observaciones || '',
          imageness: imageUrls.length > 0 ? JSON.stringify(imageUrls) : null,
          id_usu: idUsuario,
          fecha_in: new Date().toISOString(),
          id_est_tick: 2
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    });

    await Promise.all(promesas);

    return {
      success: true,
      mensaje: `✓ Reporte exitoso! Se crearon ${formData.problemasSeleccionados.length} ticket(s) para el equipo ID ${formData.idElemento}:\n• ${problemasNombres.join('\n• ')}`
    };
  } catch (err) {
    console.error('Error al crear tickets:', err);
    return {
      success: false,
      error: 'Error al reportar el equipo: ' + (err.message || 'Error desconocido')
    };
  }
};

/**
 * Validaciones del formulario
 */
export const validarFormularioTicket = (formData) => {
  if (!formData.idElemento.trim()) {
    return { valid: false, error: 'El ID del equipo es obligatorio' };
  }
  if (!formData.ambiente.trim()) {
    return { valid: false, error: 'El ambiente es obligatorio' };
  }
  if (formData.problemasSeleccionados.length === 0) {
    return { valid: false, error: 'Debe seleccionar al menos un problema' };
  }
  return { valid: true };
};

/**
 * Obtiene el ID del usuario desde localStorage
 */
export const obtenerIdUsuario = () => {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const idUsuario = usuario.id;
    
    if (!idUsuario) {
      throw new Error('No se pudo obtener el ID del usuario. Por favor, inicie sesión nuevamente.');
    }
    
    return { success: true, idUsuario };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Custom Hook: Maneja toda la lógica del formulario de reportar equipos
 */
export const useReportarEquipo = () => {
  const [problemas, setProblemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagenCargando, setImagenCargando] = useState(false);

  const [formData, setFormData] = useState({
    numeroSerie: '',
    idElemento: '',
    ambiente: '',
    observaciones: '',
    problemasSeleccionados: []
  });

  const [imagenes, setImagenes] = useState([]);

  // Cargar problemas al montar el componente
  useEffect(() => {
    cargarProblemas();
  }, []);

  const cargarProblemas = async () => {
    setLoading(true);
    setError(null);
    
    const resultado = await cargarProblemasDesdeAPI();
    
    if (resultado.success) {
      setProblemas(resultado.data);
    } else {
      setError(resultado.error);
    }
    
    setLoading(false);
  };

  const handleProblemaChange = (problemaId) => {
    setFormData(prev => {
      const problemas = prev.problemasSeleccionados.includes(problemaId)
        ? prev.problemasSeleccionados.filter(id => id !== problemaId)
        : [...prev.problemasSeleccionados, problemaId];
      return { ...prev, problemasSeleccionados: problemas };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAgregarImagen = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setImagenCargando(true);
    setError(null);

    try {
      const base64 = await convertirImagenABase64(archivo);
      setImagenes(prev => [...prev, base64]);
      setSuccess('✓ Imagen agregada correctamente');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error("Error al procesar la imagen", err);
      setError("No se pudo cargar la imagen.");
    } finally {
      setImagenCargando(false);
    }
  };

  const handleEliminarImagen = (index) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validacion = validarFormularioTicket(formData);
    if (!validacion.valid) {
      setError(validacion.error);
      return;
    }

    setSubmitting(true);

    try {
      const usuarioResult = obtenerIdUsuario();
      if (!usuarioResult.success) {
        throw new Error(usuarioResult.error);
      }

      const imagenesResult = await subirImagenesAlServidor(imagenes);
      if (!imagenesResult.success) {
        throw new Error(imagenesResult.error);
      }

      const ticketsResult = await crearTicketsParaEquipo(
        formData,
        problemas,
        imagenesResult.urls,
        usuarioResult.idUsuario
      );

      if (!ticketsResult.success) {
        throw new Error(ticketsResult.error);
      }

      setSuccess(ticketsResult.mensaje);
      
      // Limpiar formulario
      setFormData({
        numeroSerie: '',
        idElemento: '',
        ambiente: '',
        observaciones: '',
        problemasSeleccionados: []
      });
      setImagenes([]);

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLimpiar = () => {
    setFormData({
      numeroSerie: '',
      idElemento: '',
      ambiente: '',
      observaciones: '',
      problemasSeleccionados: []
    });
    setImagenes([]);
    setError(null);
    setSuccess(null);
  };

  return {
    // Estado
    problemas,
    loading,
    error,
    success,
    submitting,
    imagenCargando,
    formData,
    imagenes,
    // Funciones
    handleProblemaChange,
    handleInputChange,
    handleAgregarImagen,
    handleEliminarImagen,
    handleSubmit,
    handleLimpiar,
    setError,
    setSuccess
  };
};




