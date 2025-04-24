import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './informacion_equipos.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';



function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
       <Modal.Header className='Header1'closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1 className='Titul1'>Seleccione los problemas que presenta su dispositivo</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='Cuerpovent'>


      <div className='Conteiner01'>
  <div className='Cuadrito1'>
    <h6 className='Text1'>Problemas con el office</h6>
    <Form.Group className="mb-3">
      <Form.Check type="checkbox" />
    </Form.Group>
  </div>
  <div className='Cuadrito1'>
    <h6 className='Text1'>Problemas con el office</h6>
    <Form.Group className="mb-3">
      <Form.Check type="checkbox" />
    </Form.Group>
  </div>
  <div className='Cuadrito1'>
    <h6 className='Text1'>Problemas con el office</h6>
    <Form.Group className="mb-3">
      <Form.Check type="checkbox" />
    </Form.Group>
  </div>
  </div>

  <div className='Conteiner02'>
  <div className='Cuadrito1'>
    <h6 className='Text1'>Problemas con el office</h6>
    <Form.Group className="mb-3">
      <Form.Check type="checkbox" />
    </Form.Group>
  </div>
  <div className='Cuadrito1'>
    <h6 className='Text1'>Problemas con el office</h6>
    <Form.Group className="mb-3">
      <Form.Check type="checkbox" />
    </Form.Group>
  </div>
  <div className='Cuadrito1'>
    <h6 className='Text1'>Problemas con el office</h6>
    <Form.Group className="mb-3">
      <Form.Check type="checkbox" />
    </Form.Group>
  </div>
  </div>


  <div className='Conteiner03'>
  <div className='Cuadrito1'>
    <h6 className='Text1'>Problemas con el office</h6>
    <Form.Group className="mb-3">
      <Form.Check type="checkbox" />
    </Form.Group>
  </div>
  <div className='Cuadrito1'>
    <h6 className='Text1'>Problemas con el office</h6>
    <Form.Group className="mb-3">
      <Form.Check type="checkbox" />
    </Form.Group>
  </div>
  <div className='Cuadrito1'>
    <h6 className='Text1'>Problemas con el office</h6>
    <Form.Group className="mb-3">
      <Form.Check type="checkbox" />
    </Form.Group>
  </div>
  </div>
  
  <InputGroup className='Text2'>
          <Form.Control className='Text3'
            placeholder="Observaciones(Opcional)"
          />
        </InputGroup>
        <Button className="botoon"><h6>Confirmar reporte</h6></Button>
</Modal.Body>
    </Modal>
  );
}

function Datos_equipos() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <> 
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
      <i className="bi bi-tools herramientas-icono"></i>
    <   Button className="Reportar" variant="outline-primary" size="sm" onClick={() => setModalShow(true)}>
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


