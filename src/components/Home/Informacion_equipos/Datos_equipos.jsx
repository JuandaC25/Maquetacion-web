import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './informacion_equipos.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}

function Datos_equipos() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <> 
      <div className="inventario-header">
        <h1 className="Nom_inventario">Inventario</h1>
        <DropdownButton id="dropdown-basic-button" title="Portátiles" className="selector-inventario">
          <Dropdown.Item>Equipos de escritorio</Dropdown.Item>
          <Dropdown.Item>Televisores</Dropdown.Item>
        </DropdownButton>
      </div>

      <Navbar className="Cuerpo_nav">
        <Container>
          <Navbar.Brand className="brand-container"> 
            <div className="left-elements">
              <i className="bi bi-display"></i>
            </div>
            <span className="brand-text">
              Detalles del equipo (Accesorios, números de serie)
            </span>
            <div className="right-elements">
              <Button className="Reportar" variant="outline-primary" size="sm" onClick={() => setModalShow(true)}>
                Reportar como dañado
              </Button>
            </div>
          </Navbar.Brand>
        </Container>
      </Navbar>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}

export default Datos_equipos;
