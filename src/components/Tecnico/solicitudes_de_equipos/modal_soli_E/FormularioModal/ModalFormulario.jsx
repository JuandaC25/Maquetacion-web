import React, { useState } from 'react';
import './ModalTec1.css';
import ConfirmacionModal from '../ConfrirmacionModal/ConfirmacionModal';

function ModalFormulario({ show, onHide, prest, onActualizado }) {
  const [loading, setLoading] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  if (!show || !prest) return null;
  const formatDate = (fecha) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const finalizarSolicitud = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8081/api/solicitudes/${prest.id_soli}/finalizar`,
        {
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: 'finalizado' }),
        }
      );
      if (!response.ok) throw new Error('Error al finalizar la solicitud');
      const data = await response.json();
      console.log('Solicitud actualizada:', data);
      onActualizado && onActualizado(prest.id_soli);
      onHide(); 
    } catch (error) {
      console.error('❌ Error al finalizar la solicitud:', error);
      alert('No se pudo finalizar la solicitud');
    } finally {
      setLoading(false);
    }
  };
  const abrirConfirmacion = () => setMostrarConfirmacion(true);
  const cerrarConfirmacion = () => setMostrarConfirmacion(false);
  const confirmarFinalizacion = () => {
    cerrarConfirmacion();
    finalizarSolicitud();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onHide}></div>
      <div className="principe">
        <div className="cabeza">
          <h1 className="titulito">Detalle de solicitud</h1>
          <button className="close-btn" onClick={onHide}>×</button>
        </div>
        <div className="cuerpito">
          <div className="cont_mod_tec1">
            <div className="Cont_label_tec">
              <label className="origin">ID de solicitud:</label>
              <input type="text" className="tecito" disabled value={prest.id_soli ?? ''} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Nombre usuario:</label>
              <input type="text" className="tecito" disabled value={prest.nom_usu ?? ''} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Fecha de inicio:</label>
              <input type="date" className="tecito" disabled value={formatDate(prest.fecha_ini)} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Fecha de fin:</label>
              <input type="date" className="tecito" disabled value={formatDate(prest.fecha_fn)} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Ambiente:</label>
              <input type="text" className="tecito" disabled value={prest.ambient ?? ''} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Número de ficha:</label>
              <input type="text" className="tecito" disabled value={prest.num_fich ?? ''} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Nombre elemento:</label>
              <input type="text" className="tecito" disabled value={prest.nom_elem ?? ''} />
            </div>
            <div className="Cont_label_tec">
              <label className="origin">Nombre accesorio:</label>
              <input type="text" className="tecito" disabled value={prest.nom_acces ?? ''} />
            </div>
          </div>
        </div>

  
        <div className="piecito">
          <button
            id="buttonModalTec"
            onClick={abrirConfirmacion}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Finalizado'}
          </button>
        </div>
      </div>


      <ConfirmacionModal
        show={mostrarConfirmacion}
        onHide={cerrarConfirmacion}
        onConfirm={confirmarFinalizacion}
        mensaje="¿Deseas marcar esta solicitud como finalizada?"
      />
    </>
  );
}

export default ModalFormulario;
