import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Modalconf() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button className='Btn_confir' variant="primary" onClick={handleShow}>
        Confirmar solicitud
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body className='Msj_modal'> Solicitud exitosa </Modal.Body>
      </Modal>
    </>
  );
}

export default Modalconf;