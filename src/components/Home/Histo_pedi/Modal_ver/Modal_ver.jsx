import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Modal_ver.css';
import Stack from 'react-bootstrap/Stack';

function Modal_ver({ equiposSolicitados = [] }) { 
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const renderEquipos = () => {
    const equiposAMostrar = equiposSolicitados.slice(0, 6); 
    const equiposArriba = equiposAMostrar.slice(0, 3);
    const equiposAbajo = equiposAMostrar.slice(3, 6);

return (
<Stack gap={1}>
  <div className='Arriba_ver'>
    {equiposArriba.map((equipo) => (
      <div key={equipo.id} className="Cua_1">
        {equipo.nombre || "Equipo sin nombre"}
      </div>
    ))}
    {[...Array(3 - equiposArriba.length)].map((_, index) => (
        <div key={`empty-top-${index}`} className="Cua_1 empty-placeholder"></div>
    ))}
  </div>
  <div className='Abajo_ver'>
    {equiposAbajo.map((equipo) => (
      <div key={equipo.id} className="Cua_2">
        {equipo.nombre || "Equipo sin nombre"}
      </div>
    ))}
    {[...Array(3 - equiposAbajo.length)].map((_, index) => (
        <div key={`empty-bottom-${index}`} className="Cua_2 empty-placeholder"></div>
    ))}
  </div>
  {equiposSolicitados.length > 6 && (
      <p className="text-muted mt-2">... y {equiposSolicitados.length - 6} equipos más.</p>
  )}
  {equiposSolicitados.length === 0 && (
        <p className="text-muted text-center">No hay equipos en esta solicitud.</p>
  )}
</Stack>
);
};

  return (
    <>
      <Button className='Mdl_ver' variant="secondary" onClick={handleShow}>
        Ver ({equiposSolicitados.length})
      </Button>

      <Modal className='modal_ver' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Equipos solicitados en el préstamo ({equiposSolicitados.length})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderEquipos()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
             Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Modal_ver;