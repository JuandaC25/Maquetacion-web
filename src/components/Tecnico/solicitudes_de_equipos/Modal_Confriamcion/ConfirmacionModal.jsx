import React from 'react';
import './ModalConfirmacion.css';

function ConfirmacionModal({ show, onHide, onConfirm, mensaje }) {
  if (!show) return null;

  return (
    <>
      <div className="confirmacion-overlay" onClick={onHide}></div>
      <div className="confirmacion-principal">
        <div className="confirmacion-cabeza">
          <h2>{mensaje}</h2>
          <button className="confirmacion-close-btn" onClick={onHide}>×</button>
        </div>

        <div className="confirmacion-cuerpo">
          <p></p>
        </div>

        <div className="confirmacion-footer">
          <button className="btn-verde-si" onClick={onConfirm}>
            Sí
          </button>
          <button className="btn-verde-no" onClick={onHide}>
            No
          </button>
        </div>
      </div>
    </>
  );
}

export default ConfirmacionModal;
