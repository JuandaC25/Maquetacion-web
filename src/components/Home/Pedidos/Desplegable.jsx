import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

function Desplegable() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const svgIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
    </svg>
  );

  return (
    <div id='Menu_usu'>
      <Button variant="primary" onClick={handleShow}>
        {svgIcon}
      </Button>
      <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Title id='Menu_icon'>Menú</Offcanvas.Title>
        <Offcanvas.Body>
          Algunos elementos del menú aquí...
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Desplegable;