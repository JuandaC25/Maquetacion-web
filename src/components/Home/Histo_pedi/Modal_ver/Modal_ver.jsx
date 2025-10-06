import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Modal_ver.css'; // Asegúrate de que este archivo CSS existe y tiene los estilos necesarios.
import Stack from 'react-bootstrap/Stack';

// Acepta la prop equiposSolicitados, que debe ser un array de objetos de equipo.
function Modal_ver({ equiposSolicitados = [] }) { 
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Función para renderizar los equipos en la estructura deseada
  const renderEquipos = () => {
    // Tomamos hasta 6 equipos. Si hay más, se pueden mostrar solo los 6 o adaptar el diseño.
    const equiposAMostrar = equiposSolicitados.slice(0, 6); 
    const equiposArriba = equiposAMostrar.slice(0, 3);
    const equiposAbajo = equiposAMostrar.slice(3, 6);

    return (
      <Stack gap={1}>
        {/* Fila superior (hasta 3 equipos) */}
        <div className='Arriba_ver'>
          {equiposArriba.map((equipo) => (
            // Usamos el id del equipo como key y mostramos el nombre
            <div key={equipo.id} className="Cua_1">
              {equipo.nombre || "Equipo sin nombre"}
            </div>
          ))}
          {/* Rellenar con cuadros vacíos si hay menos de 3 */}
          {[...Array(3 - equiposArriba.length)].map((_, index) => (
             <div key={`empty-top-${index}`} className="Cua_1 empty-placeholder"></div>
          ))}
        </div>

        {/* Fila inferior (equipos 4 a 6) */}
        <div className='Abajo_ver'>
          {equiposAbajo.map((equipo) => (
            // Usamos el id del equipo como key y mostramos el nombre
            <div key={equipo.id} className="Cua_2">
              {equipo.nombre || "Equipo sin nombre"}
            </div>
          ))}
          {/* Rellenar con cuadros vacíos si hay menos de 3 */}
          {[...Array(3 - equiposAbajo.length)].map((_, index) => (
             <div key={`empty-bottom-${index}`} className="Cua_2 empty-placeholder"></div>
          ))}
        </div>
        
        {/* Mensaje si hay más de 6 equipos (opcional) */}
        {equiposSolicitados.length > 6 && (
            <p className="text-muted mt-2">... y {equiposSolicitados.length - 6} equipos más.</p>
        )}

        {/* Mensaje si no hay equipos (opcional) */}
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