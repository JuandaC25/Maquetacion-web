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
    // Pre-check: verificar disponibilidad del elemento en backend
    try {
      const elResp = await authorizedFetch(`/api/elementos/${formData.idElemento}`);
      if (!elResp.ok) {
        const txt = await elResp.text().catch(() => 'Error al verificar elemento');
        return { success: false, error: txt || (`Elemento ${formData.idElemento} no encontrado`) };
      }
      const elementoJson = await elResp.json().catch(() => null);
      const estadoElem = elementoJson?.estadosoelement ?? elementoJson?.est ?? elementoJson?.estado ?? null;
      if (estadoElem != null && Number(estadoElem) !== 1) {
        const estadoTexto = Number(estadoElem) === 2 ? 'Mantenimiento' : Number(estadoElem) === 0 ? 'Inactivo' : String(estadoElem);
        return { success: false, error: `El elemento no está disponible: ${estadoTexto}` };
      }
    } catch (err) {
      return { success: false, error: 'No se pudo verificar disponibilidad del elemento: ' + (err.message || err) };
    }

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

      console.log('➡️ detallesProblemas:', detallesProblemas);
      console.log('➡️ problemasConDetalles:', problemasConDetalles);

      // Subir imágenes de cada problema y reemplazar base64 por URLs
      for (let prob of problemasConDetalles) {
        if (prob.imagenes && prob.imagenes.length > 0) {
          const res = await subirImagenesAlServidor(prob.imagenes);
          prob.imagenes = res.success ? res.urls : [];
        }
      }

      const payload = {
        id_elem: parseInt(formData.idElemento),
        ambiente: formData.ambiente,
        id_usu: idUsuario,
        fecha_in: new Date().toISOString(),
        id_est_tick: 2,
        problemas: problemasConDetalles
      };
      console.log('➡️ Payload enviado a /api/tickets:', payload);

      const response = await authorizedFetch('/api/tickets', {
        method: 'POST',
        body: JSON.stringify(payload),
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
            const base64Imgs = [];
            for (const file of files) {
                const base64 = await convertirImagenABase64(file);
                base64Imgs.push(base64);
            }
            
            setDetallesProblemas(prev => {
                const nuevasImagenes = [...(prev[problemaId]?.imagenes || []), ...base64Imgs];
                return {
                    ...prev,
                    [problemaId]: {
                        ...prev[problemaId] || {},
                        imagenes: nuevasImagenes
                    }
                };
            });
        } catch (err) {
            setError("No se pudo cargar la(s) imagen(es): " + err.message);
        } finally {
            setImagenCargando(false);
        }
    };

    // Eliminar una imagen específica
    const eliminarImagen = (problemaId, index) => {
        setDetallesProblemas(prev => {
            const currentImages = prev[problemaId]?.imagenes || [];
            const nuevasImagenes = currentImages.filter((_, i) => i !== index);
            return {
                ...prev,
                [problemaId]: {
                    ...prev[problemaId] || {},
                    imagenes: nuevasImagenes
                }
            };
        });
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
    idElemento: '',
    ambiente: '',
    problemasSeleccionados: []
  });

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
      // 1. Obtener ID de usuario
      const usuarioResult = obtenerIdUsuario();
      if (!usuarioResult.success) {
        throw new Error(usuarioResult.error);
      }


      const ticketsResult = await crearTicketsParaEquipo(
        formData,
        problemas,
        detallesProblemas, 
        usuarioResult.idUsuario
      );

      if (!ticketsResult.success) {
        throw new Error(ticketsResult.error);
      }

      setSuccess(ticketsResult.mensaje);
      handleLimpiar();

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLimpiar = () => {
    setFormData({
      idElemento: '',
      ambiente: '',
      problemasSeleccionados: []
    });
    setDetallesProblemas({}); 
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
    detallesProblemas,
    // Funciones
    handleProblemaChange,
    handleInputChange,
    handleSubmit,
    handleLimpiar,
    setError,
    setSuccess,
    toggleDetalles,
    actualizarDescripcion,
    agregarImagenes,
    eliminarImagen
  };
};