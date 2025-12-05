import React, { useState, useEffect } from 'react';
import './ModalAsignarElemento.css';
import { authorizedFetch } from '../../../../../api/http';

function ModalAsignarElemento({ show, onHide, prest, onConfirm }) {
  const [elementosDisponibles, setElementosDisponibles] = useState([]);
  const [elementoSeleccionado, setElementoSeleccionado] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

      // Obtener elementos ya asignados en préstamos activos
      const resPrestamos = await authorizedFetch('/api/prestamos/activos');
      if (!resPrestamos.ok) throw new Error('Error al obtener préstamos');
      const prestamos = await resPrestamos.json();

      // Crear set de IDs de elementos asignados
      const idsAsignados = new Set();
      prestamos.forEach(p => {
        if (p.id_elem) {
          const ids = typeof p.id_elem === 'string' 
            ? p.id_elem.split(',').map(Number)
            : [p.id_elem];
          ids.forEach(id => idsAsignados.add(id));
        }
      });

      // Filtrar elementos disponibles (no asignados) Y que coincidan con la categoría y subcategoría de la solicitud
      let disponibles = elementos.filter(elem => !idsAsignados.has(elem.id_elemen));
      console.log('Después de filtrar asignados:', disponibles.length);

      // Si la solicitud tiene categoría, filtrar por eso
      if (prest.tip_catg) {
        console.log('Filtrando por categoría:', prest.tip_catg);
        disponibles = disponibles.filter(elem => elem.tip_catg === prest.tip_catg);
        console.log('Después de filtrar categoría:', disponibles.length);
      }

      // Si la solicitud tiene subcategoría, filtrar por eso también
      if (prest.tip_subcat) {
        console.log('Filtrando por subcategoría:', prest.tip_subcat);
        disponibles = disponibles.filter(elem => elem.tip_subcat === prest.tip_subcat);
        console.log('Después de filtrar subcategoría:', disponibles.length);
      }

      // Filtrar solo elementos con estado activo (estado = 1)
      console.log('Filtrando por estado = 1');
      // Temporalmente no filtramos por estado para ver qué aparece
      // disponibles = disponibles.filter(elem => elem.est_elemen === 1);
      
      // Verificar campos disponibles en elementos
      if (disponibles.length > 0) {
        console.log('Estructura completa del primer elemento:', disponibles[0]);
        console.log('Campos disponibles:', Object.keys(disponibles[0]));
      }
      
      console.log('Después de filtrar estado:', disponibles.length, disponibles);

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
    if (!elementoSeleccionado) {
      setError('Por favor selecciona un elemento');
      return;
    }
    onConfirm(elementoSeleccionado);
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
              <div className="form-group-asignar">
                <label htmlFor="elemento-select">Selecciona un elemento disponible:</label>
                <select
                  id="elemento-select"
                  value={elementoSeleccionado}
                  onChange={(e) => {
                    setElementoSeleccionado(e.target.value);
                    setError('');
                  }}
                  className="select-elemento"
                >
                  <option value="">-- Selecciona un elemento --</option>
                  {elementosDisponibles.map(elem => (
                    <option key={elem.id_elemen} value={elem.id_elemen}>
                      {elem.nom_eleme} {elem.mar_elem ? `(${elem.mar_elem})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {elementoSeleccionado && (
                <div className="elemento-info">
                  {elementosDisponibles.find(e => e.id_elemen === parseInt(elementoSeleccionado)) && (
                    <>
                      <p><strong>Elemento seleccionado:</strong></p>
                      <p>{elementosDisponibles.find(e => e.id_elemen === parseInt(elementoSeleccionado)).nom_eleme}</p>
                      {elementosDisponibles.find(e => e.id_elemen === parseInt(elementoSeleccionado)).mar_elem && (
                        <p><strong>Marca:</strong> {elementosDisponibles.find(e => e.id_elemen === parseInt(elementoSeleccionado)).mar_elem}</p>
                      )}
                    </>
                  )}
                </div>
              )}
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
          <button 
            className="btn-confirmar-asignar" 
            onClick={handleConfirm}
            disabled={loading || !elementoSeleccionado}
          >
            Confirmar
          </button>
        </div>
      </div>
    </>
  );
}

export default ModalAsignarElemento;
