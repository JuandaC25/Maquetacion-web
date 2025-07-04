import { useState } from 'react';
import './Soli_port.css';
import Footer from '../../Footer/Footer.jsx';
import Header_port from './Header soli/Header.jsx';
import { Modal, Button, Pagination, Form } from 'react-bootstrap';

const ConsultaItem = ({ onVerClick }) => {
  return (
    <div className="ticket-item2">
      <div className="izquierda2">
        <div className="icono" role="img" aria-label="computadora">🖥️</div>
        <div className="estado1">
          <span>Detalles del equipo</span>
        </div>
      </div>
      <div className="derecha1">
        <Button onClick={onVerClick} className="btn btn-primary Buton_Fomr">
          Ver
        </Button>
      </div>
    </div>
  );
};

// LISTA DE CONSULTAS
const ListaConsultas = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
 //Este array es para que muestre la cantidad de veces que uno decida en el cuadro de solicitar portatiles
  const elementos = new Array(4).fill(null);

  return (
    <div name="lista-inventario1">
      {elementos.map((_, i) => (
        <ConsultaItem key={i} onVerClick={handleShow} />
      ))}

      <div id="piepor">
        <Pagination>
          <Pagination.Prev />
          <Pagination.Item id="font">{1}</Pagination.Item>
          <Pagination.Item id="font">{2}</Pagination.Item>
          <Pagination.Item id="font">{3}</Pagination.Item>
          <Pagination.Ellipsis />
          <Pagination.Item id="font">{10}</Pagination.Item>
          <Pagination.Next />
        </Pagination>
      </div>


      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton className='Titmodal'>
          <Modal.Title ><h1>  Información del equipo  </h1></Modal.Title>
        </Modal.Header>
  <Modal.Body >
    <div className='cuer-mo'>
    <Form className="form-vertical">
      <Form.Group >
      <Form.Label>Id del elemento</Form.Label>
      <Form.Control className='tx1' placeholder="XXXXXXXX" disabled />
    </Form.Group>

    <Form.Group >
      <Form.Label>Nombre del elemento</Form.Label>
      <Form.Control className='tx1' placeholder="XXXXXXXX" disabled />
    </Form.Group>

    <Form.Group >
      <Form.Label>Categoría</Form.Label>
      <Form.Control className='tx1' placeholder="Portátiles, escritorio..." disabled />
    </Form.Group>

    <Form.Group >
      <Form.Label>Accesorios</Form.Label>
      <Form.Control className='tx1' placeholder="Mouse, Cargador, Funda..." disabled />
    </Form.Group>

    <Form.Group >
      <Form.Label>Número de serie</Form.Label>
      <Form.Control className='tx1' placeholder="XXXXXXXX" disabled />
    </Form.Group>
    
    <Form.Group >
      <Form.Label>Observaciones</Form.Label>
      <Form.Control className='tx1' as="textarea" rows={3} disabled />
    </Form.Group>

    <div>
      <Button className='Btn_Conf' type="submit">Aceptar</Button>
    </div>
  </Form>
  </div>
</Modal.Body>
      </Modal>
    </div>
  );
};

// COMPONENTE PRINCIPAL
function Soli_Port() {
  return (
    <div className="Usu-container1">
      <Header_port />
      <ListaConsultas />
      <Footer />
    </div>
  );
}

export default Soli_Port;


