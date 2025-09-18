import { useState } from 'react';
import { List } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Modal_com_port() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button className='Btn_espe_port' onClick={handleShow}>
    Ver componentes
</Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton closeVariant='white' className='Hea_com_port'>
          <Modal.Title 
          className='Text_comp_port'>Componentes del PC</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ul>
                <li> Procesador: Intel Core i5 i5-12500H.</li>
                <li> Edición del sistema operativo: Windows de prueba. </li>
                <li> Nombre del sistema operativo: Windows. </li>
                <li> Capacidad de disco SSD: 512 GB. </li>
                <li> Capacidad total del módulo de memoria RAM: 24 GB. </li>
                <li> Resolución de la pantalla: 1920 px x 1080 px. </li>
            </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button  onClick={handleClose}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Modal_com_port;