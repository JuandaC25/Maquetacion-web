import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './informacion_equipos.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';



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
          <h1 className='Titul1'>Seleccione los componentes que presenta su dispositivo</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='Cuerpovent'>


      <div className='Conteiner01'>
  <div className='Cuadrito1'>
    <h5 className='Text1'>Problemas con el office</h5>
    <Form.Group className="mb-3">
      <Form.Check type="checkbox" />
    </Form.Group>
  </div>
  <div className='Cuadrito1'>
    <h5 className='Text1'>Problemas con el office</h5>
    <Form.Group className="mb-3">
      <Form.Check type="checkbox" />
    </Form.Group>
  </div>
  <div className='Cuadrito1'>
    <h5 className='Text1'>Problemas con el office</h5>
    <Form.Group className="mb-3">
      <Form.Check type="checkbox" />
    </Form.Group>
  </div>
  </div>

  <div className='Conteiner02'>
  <div className='Cuadrito1'>
    <h5 className='Text1'>Problemas con el office</h5>
    <Form.Group className="mb-3">
      <Form.Check type="checkbox" />
    </Form.Group>
  </div>
  <div className='Cuadrito1'>
    <h5 className='Text1'>Problemas con el office</h5>
    <Form.Group className="mb-3">
      <Form.Check type="checkbox" />
    </Form.Group>
  </div>
  <div className='Cuadrito1'>
    <h5 className='Text1'>Problemas con el office</h5>
    <Form.Group className="mb-3">
      <Form.Check type="checkbox" />
    </Form.Group>
  </div>
  </div>


  <div className='Conteiner03'>
  <div className='Cuadrito1'>
    <h5 className='Text1'>Problemas con el office</h5>
    <Form.Group className="mb-3">
      <Form.Check type="checkbox" />
    </Form.Group>
  </div>
  <div className='Cuadrito1'>
    <h5 className='Text1'>Problemas con el office</h5>
    <Form.Group className="mb-3">
      <Form.Check type="checkbox" />
    </Form.Group>
  </div>
  <div className='Cuadrito1'>
    <h5 className='Text1'>Problemas con el office</h5>
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
              <i class="bi bi-tools"></i>
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


