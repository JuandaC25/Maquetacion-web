import React, { useState, useEffect } from 'react';
import './ModalAsignarElemento.css';
import { authorizedFetch } from '../../../../../api/http';

function ModalAsignarElemento({ show, onHide, prest, onConfirm }) {
  const [elementosDisponibles, setElementosDisponibles] = useState([]);
  const [elementosSeleccionados, setElementosSeleccionados] = useState([]); // Array de {id, cantidad}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const cantidadSolicitada = prest?.cantid || 0;
  const cantidadAsignada = elementosSeleccionados.reduce((sum, item) => sum + item.cantidad, 0);

  useEffect(() => {
    console.log('ModalAsignarElemento - show:', show);
    if (show) {
      cargarElementosDisponibles();
    }
  }, [show]);

  const cargarElementosDisponibles = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Solicitud recibida:', prest);
      
      // Obtener todos los elementos
      const resElementos = await authorizedFetch('/api/elementos');
      if (!resElementos.ok) throw new Error('Error al obtener elementos');
      const elementos = await resElementos.json();
      console.log('Todos los elementos:', elementos);
      console.log('Primer elemento estructura:', elementos[0]);

      // Obtener todos los préstamos
      const resPrestamos = await authorizedFetch('/api/prestamos');
      if (!resPrestamos.ok) {
        console.warn('No se pudo obtener préstamos, continuando sin filtro de asignados');
        // Si falla, continuamos sin filtrar elementos asignados
      }
      
      const prestamos = resPrestamos.ok ? await resPrestamos.json() : [];

      // Crear set de IDs de elementos asignados (solo en préstamos activos - estado 1)
      const idsAsignados = new Set();
      prestamos.forEach(p => {
        // Solo contar como asignados los préstamos activos
        if (p.est_prest === 1 && p.id_elem) {
          const ids = typeof p.id_elem === 'string' 
            ? p.id_elem.split(',').map(Number)
            : [p.id_elem];
          ids.forEach(id => idsAsignados.add(id));
        }
      });

      // Filtrar elementos disponibles (no asignados) Y que coincidan con la categoría y subcategoría de la solicitud
      let disponibles = elementos.filter(elem => !idsAsignados.has(elem.id_elemen));

      // Si la solicitud tiene categoría, filtrar por eso
      if (prest.nom_cat) {
        disponibles = disponibles.filter(elem => elem.tip_catg === prest.nom_cat);
      }

      // Si la solicitud tiene subcategoría, filtrar por eso también
      if (prest.nom_subcat) {
        disponibles = disponibles.filter(elem => elem.sub_catg === prest.nom_subcat);
      }

      // Filtrar solo elementos con estado activo (est = 1)
      disponibles = disponibles.filter(elem => elem.est === 1);

      setElementosDisponibles(disponibles);

      if (disponibles.length === 0) {
        const mensaje = prest.tip_catg 
          ? `No hay elementos disponibles para la categoría "${prest.tip_catg}" ${prest.tip_subcat ? `y subcategoría "${prest.tip_subcat}"` : ''}`
          : 'No hay elementos disponibles para asignar';
        setError(mensaje);
      }
    } catch (err) {
      console.error('Error al cargar elementos:', err);
      setError('Error al cargar los elementos disponibles');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (elementosSeleccionados.length === 0) {
      setError('Por favor selecciona al menos un elemento');
      return;
    }
    if (cantidadAsignada === 0) {
      setError('Debes asignar al menos 1 elemento');
      return;
    }
    // Pasar los elementos seleccionados al padre
    onConfirm(elementosSeleccionados);
  };

  const agregarElemento = (elementoId) => {
    // Verificar si ya está seleccionado
    const yaExiste = elementosSeleccionados.find(e => e.id === elementoId);
    if (yaExiste) {
      // Si ya existe, eliminarlo (toggle)
      eliminarElemento(elementoId);
      return;
    }

    // Verificar si aún hay cupo
    if (cantidadAsignada >= cantidadSolicitada) {
      setError(`Ya has asignado la cantidad solicitada (${cantidadSolicitada})`);
      return;
    }

    // Agregar con cantidad 1
    setElementosSeleccionados([...elementosSeleccionados, { id: elementoId, cantidad: 1 }]);
    setError('');
  };

  const eliminarElemento = (elementoId) => {
    setElementosSeleccionados(elementosSeleccionados.filter(e => e.id !== elementoId));
  };

  const actualizarCantidad = (elementoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    // Calcular nueva cantidad total sin este elemento
    const otrasCantidades = elementosSeleccionados
      .filter(e => e.id !== elementoId)
      .reduce((sum, item) => sum + item.cantidad, 0);

    // Verificar que no exceda el solicitado
    if (otrasCantidades + nuevaCantidad > cantidadSolicitada) {
      setError(`No puedes exceder ${cantidadSolicitada} elementos en total`);
      return;
    }

    setElementosSeleccionados(
      elementosSeleccionados.map(e => 
        e.id === elementoId ? { ...e, cantidad: nuevaCantidad } : e
      )
    );
    setError('');
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-overlay-asignar" onClick={onHide}></div>
      <div className="modal-asignar-elemento">
        <div className="modal-header-asignar">
          <h2>Asignar Elemento</h2>
          <button className="close-btn-asignar" onClick={onHide}>×</button>
        </div>

        <div className="modal-body-asignar">
          {loading ? (
            <p>Cargando elementos disponibles...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              <div className="info-solicitud">
                <p><strong>Cantidad solicitada:</strong> {cantidadSolicitada}</p>
                <p><strong>Cantidad asignada:</strong> <span style={{ color: cantidadAsignada >= cantidadSolicitada ? '#09b41a' : '#ff9800' }}>{cantidadAsignada} / {cantidadSolicitada}</span></p>
              </div>

              <div className="form-group-asignar">
                <label><strong>Elementos disponibles ({elementosDisponibles.length}):</strong></label>
                <div className="elementos-grid">
                  {elementosDisponibles.length === 0 ? (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999' }}>No hay elementos disponibles</p>
                  ) : (
                    elementosDisponibles.map(elem => {
                      const estaSeleccionado = elementosSeleccionados.find(e => e.id === elem.id_elemen);
                      const cantidadSeleccionada = estaSeleccionado ? estaSeleccionado.cantidad : 0;
                      return (
                        <div 
                          key={elem.id_elemen} 
                          className={`elemento-card ${estaSeleccionado ? 'seleccionado' : ''}`}
                          onClick={() => agregarElemento(elem.id_elemen)}
                          title={`${elem.nom_eleme} ${elem.mar_elem ? `- ${elem.mar_elem}` : ''}`}
                        >
                          <p className="elem-nombre">{elem.nom_eleme}</p>
                          {elem.mar_elem && <p className="elem-marca">{elem.mar_elem}</p>}
                          {estaSeleccionado && (
                            <div className="badge-cantidad">{cantidadSeleccionada}x</div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer-asignar">
          <button 
            className="btn-cancelar-asignar" 
            onClick={onHide}
            disabled={loading}
          >
            Cancelar
          </button>
          {elementosSeleccionados.length > 0 && (
            <button 
              className="btn-limpiar-asignar" 
              onClick={() => {
                setElementosSeleccionados([]);
                setError('');
              }}
              disabled={loading}
            >
              Limpiar selección
            </button>
          )}
          <button 
            className="btn-confirmar-asignar" 
            onClick={handleConfirm}
            disabled={loading || elementosSeleccionados.length === 0}
          >
            Confirmar
          </button>
        </div>
      </div>
    </>
  );
}

export default ModalAsignarElemento;
