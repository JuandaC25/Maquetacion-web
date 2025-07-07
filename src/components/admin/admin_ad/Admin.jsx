import React, { useState } from 'react';
import { Button, Alert, Dropdown, Modal, Form , Pagination} from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./admin.css";
import Footer from '../../Footer/Footer.jsx';
import HeaderAd from '../header_admin/header_ad.jsx'; 

const Ticketxd = ({ estado, ticket, onVerClick }) => {
  return (
    <div className="margen200">
    <div className="ticket-item202">
      <div className="izquierda203">
        <div className="icono207">
          <span role="img" aria-label="computadora">🖥️</span>
        </div>
        <div className="estado208">
          <span>{estado}</span>
        </div>
      </div>
      <div className="derecha204">
        <div className="ticket205">
          <span className="estado208 ticket-nombre-derecha">{ticket}</span> 
        </div>
        <div className="folder206">
          <span role="img" aria-label="folder">📁</span>
        </div>
        <button className="ver-boton209" onClick={onVerClick}>Ver</button>
      </div>
    </div>
  </div>
  );
};

const Listaxd = ({ onVerClick }) => {
  const tickets = [
    { estado: 'En proceso', ticket: 'Primer ticket', detalles: { fecha: '2025-04-23', modelo: 'HP ProBook', serie: 'ABC123', tecnico: 'Juan Pérez', ambiente: 'Oficina 101', descripcion: 'El equipo presenta lentitud al iniciar.' } },
    { estado: 'En proceso', ticket: 'Segundo ticket', detalles: { fecha: '2025-04-22', modelo: 'Dell Latitude', serie: 'DEF456', tecnico: 'María Gómez', ambiente: 'Laboratorio A', descripcion: 'La pantalla parpadea intermitentemente.' } },
    { estado: 'Pendiente', ticket: 'Tercer ticket', detalles: { fecha: '2025-04-21', modelo: 'Lenovo ThinkPad', serie: 'GHI789', tecnico: 'Carlos López', ambiente: 'Recepción', descripcion: 'No se puede conectar a la red Wi-Fi.' } },
    { estado: 'Pendiente', ticket: 'Primer ticket', detalles: { fecha: '2025-04-20', modelo: 'HP ProDesk', serie: 'JKL012', tecnico: 'Ana Rodríguez', ambiente: 'Sala de juntas', descripcion: 'El teclado no responde.' } },
    { estado: 'En proceso', ticket: 'Primer ticket', detalles: { fecha: '2025-04-19', modelo: 'Dell OptiPlex', serie: 'MNO345', tecnico: 'Pedro Martínez', ambiente: 'Almacén', descripcion: 'Fallo en el disco duro.' } },
    { estado: 'Pendiente', ticket: 'Segundo ticket', detalles: { fecha: '2025-04-18', modelo: 'Lenovo IdeaCentre', serie: 'PQR678', tecnico: 'Laura Sánchez', ambiente: 'Biblioteca', descripcion: 'El mouse no funciona correctamente.' } },
    { estado: 'Pendiente', ticket: 'Primer ticket', detalles: { fecha: '2025-04-17', modelo: 'HP All-in-One', serie: 'STU901', tecnico: 'Sofía Ramírez', ambiente: 'Cafetería', descripcion: 'Problemas con el audio.' } },
    { estado: 'En proceso', ticket: 'Segundo ticket', detalles: { fecha: '2025-04-16', modelo: 'Dell Inspiron', serie: 'VWX234', tecnico: 'Miguel Torres', ambiente: 'Aula Magna', descripcion: 'La impresora no imprime.' } },
  ];

  return (
    <div className="lista-tickets201">
<Alert variant="success" className="alert201">
  <div className="d-flex justify-content-between align-items-center">
    <div className="d-flex align-items-center gap-3">
      <strong className="mb-0">TICKET</strong>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Elemento
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Portátiles</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Equipos de escritorio</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Televisores</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </div>
</Alert>


      {tickets.map((t, i) => (
        <Ticketxd key={i} estado={t.estado} ticket={t.ticket} onVerClick={() => onVerClick(t.detalles)} />
      ))}
    </div>
  );
};

const Admin = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalDetalles, setModalDetalles] = useState(null);

  const handleVerClick = (detalles) => {
    setModalDetalles(detalles);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalDetalles(null);
  };

  return (
    <div>
      <HeaderAd /> 
      <Listaxd onVerClick={handleVerClick} />
      <Pagination className='pag201'>
              <Pagination.First />
              <Pagination.Prev />
              <Pagination.Item>{1}</Pagination.Item>
              <Pagination.Ellipsis />
      
              <Pagination.Item>{10}</Pagination.Item>
              <Pagination.Item>{11}</Pagination.Item>
              <Pagination.Item active>{12}</Pagination.Item>
              <Pagination.Item>{13}</Pagination.Item>
              <Pagination.Item disabled>{14}</Pagination.Item>
      
              <Pagination.Ellipsis />
              <Pagination.Item>{20}</Pagination.Item>
              <Pagination.Next />
              <Pagination.Last />
            </Pagination>
      <Modal show={showModal} onHide={handleCloseModal} className="custom-modal215" centered>
        <Modal.Header closeButton className="modal-header-verde216">
          <Modal.Title>Detalles del Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body217">
          <div className="form-group-row210">
            <label className="form-label211">Fecha de informe:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="text" value={modalDetalles?.fecha || ''} readOnly />
            </div>
          </div>

          <div className="form-group-row210">
            <label className="form-label211">Modelo de PC:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="text" value={modalDetalles?.modelo || ''} readOnly />
            </div>
          </div>

          <div className="form-group-row210">
            <label className="form-label211">Número de serie:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="text" value={modalDetalles?.serie || ''} readOnly />
            </div>
          </div>

          <div className="form-group-row210">
            <label className="form-label211">Nombre del técnico:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="text" value={modalDetalles?.tecnico || ''} readOnly />
            </div>
          </div>

          <div className="form-group-row210">
            <label className="form-label211">Ambiente:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="text" value={modalDetalles?.ambiente || ''} readOnly />
            </div>
          </div>

          <div className="d-flex gap-2 mb-3">
            <span className="estado208">Ticket</span> 
            <span className="estado208">Pendiente</span> 
          </div>

          <div className="form-group-row210 mt-3">
            <label className="form-label211">Descripción:</label>
            <div className="form-control-wrapper212">
              <Form.Control as="textarea" rows={3} value={modalDetalles?.descripcion || ''} readOnly />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer218">
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </div>
  );
};

export default Admin;
