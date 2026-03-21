import React, { useState } from 'react';
import './ModalPrestamo.css';
import ConfirmacionPrestamo from '../Confirmacion_Prestamo/ConfirmacionPrestamo';
import { authorizedFetch } from '../../../../api/http';

function ModalPrestamo({ show, onHide, prestamo, onActualizado }) {
  const [loading, setLoading] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  if (!show || !prestamo) return null;

  const abrirConfirmacion = () => setMostrarConfirmacion(true);
  const cerrarConfirmacion = () => setMostrarConfirmacion(false);

  const confirmarFinalizacion = async () => {
    cerrarConfirmacion();
    setLoading(true);

    try {
      console.log("🔹 Finalizando préstamo:", prestamo.id_prest);
      console.log("🔹 Elementos asignados:", prestamo.idsElem || prestamo.id_elem);

      const updateResponse = await authorizedFetch(`/api/prestamos`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_prest: prestamo.id_prest, estado: 0 }),
      });

      if (!updateResponse.ok) throw new Error('Error al finalizar el préstamo');
      console.log("✅ Préstamo finalizado correctamente");
      console.log("✅ Los elementos deberían cambiar a estado ACTIVO (1) nuevamente");

      alert("Préstamo finalizado correctamente");

      onActualizado && onActualizado(prestamo.id_prest);
      onHide();
    } catch (error) {
      console.error("❌ Error al finalizar:", error);
      alert("Ocurrió un error al finalizar el préstamo.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (fecha) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const formatDateTime = (fecha) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <>
      <div className="modal-overlay" onClick={onHide}>
        <div className="modal-prestamo" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-prestamo">
          <h2>Detalles del Préstamo</h2>
          <button className="close-btn" onClick={onHide}>×</button>
        </div>

        <div className="modal-body-prestamo">
          <div className="form-group-prestamo">
            <div className="campo-prestamo">
              <label>ID Préstamo:</label>
              <input type="text" disabled value={prestamo.id_soli || prestamo.id_prest || ''} />
            </div>
            <div className="campo-prestamo">
              <label>Usuario:</label>
              <input type="text" disabled value={prestamo.nom_usu || ''} />
            </div>
            <div className="campo-prestamo">
              <label>Elemento:</label>
              <input type="text" disabled value={prestamo.nom_elem || ''} />
            </div>
            <div className="campo-prestamo">
              <label>Fecha Entrega:</label>
              <input type="text" disabled value={formatDateTime(prestamo.fecha_entreg)} />
            </div>
            <div className="campo-prestamo">
              <label>Fecha Recepción:</label>
              <input type="text" disabled value={formatDateTime(prestamo.fecha_repc || prestamo.fecha_recp)} />
            </div>
            <div className="campo-prestamo">
              <label>Estado:</label>
              <input type="text" disabled value={prestamo.estado === 1 ? 'Activo' : 'No activo'} />
            </div>
          </div>
        </div>

        <div className="modal-footer-prestamo">
          <button onClick={abrirConfirmacion} disabled={loading} className="btn-finalizar">
            {loading ? 'Finalizando...' : 'Finalizar'}
          </button>
          <button onClick={onHide} disabled={loading} className="btn-cancelar">
            Cerrar
          </button>
        </div>
      </div>
      </div>

      <ConfirmacionPrestamo
        show={mostrarConfirmacion}
        onHide={cerrarConfirmacion}
        onConfirm={confirmarFinalizacion}
        mensaje="¿Quieres finalizar este préstamo?"
      />
    </>
  );
}

export default ModalPrestamo;
