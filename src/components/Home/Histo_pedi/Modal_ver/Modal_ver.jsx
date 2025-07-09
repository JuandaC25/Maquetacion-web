import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Modal_ver.css';
import Stack from 'react-bootstrap/Stack';

function Modal_ver() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button className='Mdl_ver' variant="secondary" onClick={handleShow}>
        Ver
      </Button>

      <Modal className='modal_ver' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Equipos solicitados en el prestamo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={1}>
            <div className='Arriba_ver'>
      <div className="Cua_1">HP 14-em0021la...</div>
      <div className="Cua_1">HP 14-em0021la...</div>
      <div className="Cua_1">HP 14-em0021la...</div>
      </div>
      <div className='Abajo_ver'>
      <div className="Cua_2">HP 14-em0021la...</div>
      <div className="Cua_2">HP 14-em0021la...</div>
      <div className="Cua_2">HP 14-em0021la...</div>
      </div>
    </Stack>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Modal_ver;