/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-irregular-whitespace */
import { useState } from 'react';
import './Soli_port.css';
import Footer from '../../Footer/Footer.jsx';
import Header_port from './Header soli/Header.jsx';
import Modal_com_port from './Modal_comp_port.jsx';
import { Modal, Button, Pagination, Form } from 'react-bootstrap';


const ConsultaItem = ({ onVerClick }) =>{
  return (
<div className="card_port">
<div className='Cua_port'>
<div><span className='img_port'><img src='imagenes/imagenes_port/portatil1.png'
alt="portatil img ej" /></span></div>
<div className='espa_text_port'>
<span className="title">Portátil HP 15.6" Pulgadas</span>
<Button onClick={onVerClick} className="btn_detalles">
    Ver detalles
</Button>
<Modal_com_port />
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
<div className='Grupo-buscador_port'>
<div className="Grupo_buscador">
    <input type="text" className="Cuadro_busc_port" placeholder="Buscar..."></input>
        <svg className="btn_buscar" aria-hidden="true" viewBox="0 0 24 24">
            <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
        </svg>
</div>
</div>
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
        <Modal.Header closeButton closeVariant='white' className='Titmodal'>
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