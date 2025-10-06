import React from 'react';
import './ModalConfirmacion.css';

function ConfirmacionModal({ show, onHide, onConfirm, mensaje }) {
  if (!show) return null;

  return (
    <>
      <div className="confirmacion-overlay" onClick={onHide}></div>
      <div className="confirmacion-principal">
        <div className="confirmacion-cabeza">
          <h2>Confirmación</h2>
          <button className="confirmacion-close-btn" onClick={onHide}>×</button>
        </div>

        <div className="confirmacion-cuerpo">
          <p>{mensaje || '¿Deseas realizar esta acción?'}</p>
        </div>

        <div className="confirmacion-footer">
          <button className="btn-verde-no" onClick={onHide}>
            No
          </button>
          <button className="btn-verde-si" onClick={onConfirm}>
            Sí
          </button>
        </div>
      </div>
    </>
  );
}

export default ConfirmacionModal;
