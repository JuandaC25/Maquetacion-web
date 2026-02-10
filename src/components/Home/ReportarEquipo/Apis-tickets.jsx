  // ...existing code...
// Helpers para la gestión de Tickets - Consumo directo de APIs
import { useState, useEffect } from 'react';
import { getJson, authorizedFetch } from '../../../api/http';

/**
 * Carga la lista de problemas desde la API
 */
export const cargarProblemasDesdeAPI = async () => {
  try {
    const data = await getJson('/api/problemas');
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
export const crearTicketsParaEquipo = async (formData, problemas, detallesProblemas, idUsuario) => {
  try {
    const problemasSeleccionados = problemas.filter(p => formData.problemasSeleccionados.includes(p.id));

    // Agrupar problemas por tipo_problema
    const gruposPorTipo = problemasSeleccionados.reduce((grupos, problema) => {
      const tipo = problema.tipo_problema || 'Sin tipo';
      if (!grupos[tipo]) {
        grupos[tipo] = [];
      }
      grupos[tipo].push(problema);
      return grupos;
    }, {});

    // Crear un ticket por cada tipo de problema
    const promesasTickets = Object.entries(gruposPorTipo).map(async ([tipo, problemasDelTipo]) => {
      // Construir array de problemas con detalles
      const problemasConDetalles = problemasDelTipo.map(p => ({
        id: p.id,
        descripcion: detallesProblemas[p.id]?.descripcion || '',
        imagenes: detallesProblemas[p.id]?.imagenes || []
      }));

      // Subir imágenes de cada problema y reemplazar base64 por URLs
      for (let prob of problemasConDetalles) {
        if (prob.imagenes && prob.imagenes.length > 0) {
          const res = await subirImagenesAlServidor(prob.imagenes);
          prob.imagenes = res.success ? res.urls : [];
        }
      }

      const response = await authorizedFetch('/api/tickets', {
        method: 'POST',
        body: JSON.stringify({
          id_elem: parseInt(formData.idElemento),
          ambiente: formData.ambiente,
          id_usu: idUsuario,
          fecha_in: new Date().toISOString(),
          id_est_tick: 2,
          problemas: problemasConDetalles
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      return {
        tipo,
        problemas: problemasConDetalles.map(p => p.descripcion ? `${p.id}: ${p.descripcion}` : `${p.id}`),
        response: await response.json()
      };
    });

    const resultados = await Promise.all(promesasTickets);

    // Generar mensaje de éxito
    const totalTickets = resultados.length;
    let mensaje = `✓ Reporte exitoso! Se crearon ${totalTickets} ticket(s) agrupados por tipo para el equipo ID ${formData.idElemento}:\n\n`;

    resultados.forEach((resultado, index) => {
      mensaje += `📋 Ticket ${index + 1} - Tipo: ${resultado.tipo}\n`;
      resultado.problemas.forEach(problema => {
        mensaje += `  • ${problema}\n`;
      });
      mensaje += '\n';
    });

    return {
      success: true,
      mensaje
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

    // Estado para detalles individuales de cada problema
    const [detallesProblemas, setDetallesProblemas] = useState({});

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Mostrar/ocultar detalles para un problema
    const toggleDetalles = (problemaId) => {
      setDetallesProblemas(prev => ({
        ...prev,
        [problemaId]: {
          ...prev[problemaId],
          mostrar: !prev[problemaId]?.mostrar,
          descripcion: prev[problemaId]?.descripcion || "",
          imagenes: prev[problemaId]?.imagenes || []
        }
      }));
    };

    // Actualizar descripción de un problema
    const actualizarDescripcion = (problemaId, descripcion) => {
      setDetallesProblemas(prev => ({
        ...prev,
        [problemaId]: {
          ...prev[problemaId],
          descripcion
        }
      }));
    };

    // Agregar imágenes a un problema
    const agregarImagenes = async (problemaId, files) => {
      if (!files || files.length === 0) return;
      setImagenCargando(true);
      setError(null);
      try {
        // Convertir todas las imágenes a base64
        const base64Imgs = await Promise.all(Array.from(files).map(convertirImagenABase64));
        setDetallesProblemas(prev => {
          const nuevasImagenes = [...(prev[problemaId]?.imagenes || []), ...base64Imgs];
          return {
            ...prev,
            [problemaId]: {
              ...prev[problemaId],
              imagenes: nuevasImagenes,
              // Si hay imágenes, ocultar el texto de 'Ningún archivo seleccionado' en el renderizado
            }
          };
        });
        setSuccess('✓ Imagen(es) agregada(s) correctamente');
        setTimeout(() => setSuccess(null), 2000);
      } catch (err) {
        setError("No se pudo cargar la(s) imagen(es).");
      } finally {
        setImagenCargando(false);
      }
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

    const handleProblemaChange = (problemaId) => {
      setFormData(prev => {
        const problemas = prev.problemasSeleccionados.includes(problemaId)
          ? prev.problemasSeleccionados.filter(id => id !== problemaId)
          : [...prev.problemasSeleccionados, problemaId];
        return { ...prev, problemasSeleccionados: problemas };
      });
    };
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
    try {
      const resultado = await cargarProblemasDesdeAPI();
      if (resultado.success) {
        setProblemas(resultado.data);
      } else {
        setError(resultado.error);
      }
    } catch (err) {
      setError('Error al cargar los problemas: ' + err.message);
    }
    setLoading(false);
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
    detallesProblemas,
    // Funciones
    handleProblemaChange,
    handleInputChange,
    handleAgregarImagen,
    handleEliminarImagen,
    handleSubmit,
    handleLimpiar,
    setError,
    setSuccess,
    toggleDetalles,
    actualizarDescripcion,
    agregarImagenes
  };
};