import React from 'react';
import './ConfirmacionPrestamo.css';

function ConfirmacionPrestamo({ show, onHide, onConfirm, mensaje }) {
  if (!show) return null;

  return (
    <>
      <div className="confirmacion-overlay-prest" onClick={onHide}></div>
      <div className="confirmacion-principal-prest">
        <div className="confirmacion-cabeza-prest">
          <h2>{mensaje}</h2>
          <button className="confirmacion-close-btn-prest" onClick={onHide}>×</button>
        </div>

        <div className="confirmacion-cuerpo-prest">
          <p></p>
        </div>

        <div className="confirmacion-footer-prest">
          <button className="btn-verde-si-prest" onClick={onConfirm}>
            Sí
          </button>
          <button className="btn-verde-no-prest" onClick={onHide}>
            No
          </button>
        </div>
      </div>
    </>
  );
}

export default ConfirmacionPrestamo;
