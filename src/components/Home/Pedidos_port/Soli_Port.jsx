/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-irregular-whitespace */
import { useState } from 'react';
import './Soli_port.css';
import Footer from '../../Footer/Footer.jsx';
import Header_port from './Header soli/Header.jsx';
import { Modal, Button, Pagination, Form } from 'react-bootstrap';


const ConsultaItem = ({ onVerClick }) =>{
  return (
<div className="card_port">
<div className='Cua_port'>
<div><span className='img_port'><img src="https://www.alkosto.com/medias/197498728797-001-750Wx750H?context=bWFzdGVyfGltYWdlc3wxOTkxOHxpbWFnZS93ZWJwfGFHVTJMMmhsWVM4eE5EazROekF5TXpneE1EVTVNQzh4T1RjME9UZzNNamczT1RkZk1EQXhYemMxTUZkNE56VXdTQXwyYjY1ZmUwNDQ5ZTJlNmVjNTAyYzkzZjZjMDcwZDI1NGNiZjc2MTI4MjE1YjJkZTdiNzQ5Y2UzMzU2MzY4Zjk4"
alt="portatil img ej" /></span></div>
<div className='espa_text_port'>
<span className="title">Portátil HP 15.6" Pulgadas</span>
<Button onClick={onVerClick} className="btn_detalles">
    Ver detalles
</Button>
</div>
</div>
</div>
  );
}

const ListaConsultas = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
 
  const elementos = new Array(5).fill(null);

  return (
    <div className='cuer-inve'>
    <div name="lista-inventario1">
      {elementos.map((_, i) => (
        <ConsultaItem key={i} onVerClick={handleShow} />
      ))}
</div>
 <div className='Foo_port'>
      <div id="piepor">
        <Pagination>
          <Pagination.Prev />
          <Pagination.Item active id="font">{1}</Pagination.Item>
          <Pagination.Item id="font">{2}</Pagination.Item>
          <Pagination.Item id="font">{3}</Pagination.Item>
          <Pagination.Ellipsis />
          <Pagination.Item id="font">{10}</Pagination.Item>
          <Pagination.Next />
        </Pagination>
      </div>
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


<div className='Botones_port'>
    <div>
      <Button className='Btn1_Conf' type="submit">Aceptar</Button>
    </div>
<button className="btn_conf_port">
   Añadir 
</button>
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
      <div className='fotaj'>
    <div className='contenido_fotaj'></div>
      <Footer />
      </div>
    </div>
  );
}

export default Soli_Port;