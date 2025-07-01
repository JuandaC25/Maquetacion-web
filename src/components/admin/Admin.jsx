import React, { useState } from 'react';
import { Button, Alert, Dropdown, Modal, Form } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./estilos_admin.css";
import Footer from '../Footer/Footer';
import HeaderAd from './header_admin/header_ad.jsx';

const Ticketxd = ({ estado, ticket, onVerClick }) => {
  return (
    <div className="ticket-item">
      <div className="izquierda">
        <div className="icono">
          <span role="img" aria-label="computadora">🖥️</span>
        </div>
        <div className="estado">
          <span>{estado}</span>
        </div>
      </div>
      <div className="derecha">
        <div className="ticket">
          <span>{ticket}</span>
        </div>
        <div className="folder">
          <span role="img" aria-label="folder">📁</span>
        </div>
        <button className="ver-boton" onClick={onVerClick}>Ver</button>
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
    <div className="lista-tickets">
      <Alert variant="success">
        <strong>TICKET</strong>
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
      <Modal show={showModal} onHide={handleCloseModal} className="custom-modal" centered>
        <Modal.Header closeButton className="modal-header-verde">
          <Modal.Title>Detalles del Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group-row">
            <label className="form-label">Fecha de informe:</label>
            <div className="form-control-wrapper">
              <Form.Control type="text" value={modalDetalles?.fecha || ''} readOnly />
            </div>
          </div>

          <div className="form-group-row">
            <label className="form-label">Modelo de PC:</label>
            <div className="form-control-wrapper">
              <Form.Control type="text" value={modalDetalles?.modelo || ''} readOnly />
            </div>
          </div>

          <div className="form-group-row">
            <label className="form-label">Número de serie:</label>
            <div className="form-control-wrapper">
              <Form.Control type="text" value={modalDetalles?.serie || ''} readOnly />
            </div>
          </div>

          <div className="form-group-row">
            <label className="form-label">Nombre del técnico:</label>
            <div className="form-control-wrapper">
              <Form.Control type="text" value={modalDetalles?.tecnico || ''} readOnly />
            </div>
          </div>

          <div className="form-group-row">
            <label className="form-label">Ambiente:</label>
            <div className="form-control-wrapper">
              <Form.Control type="text" value={modalDetalles?.ambiente || ''} readOnly />
            </div>
          </div>

          {/* Cambiado a componentes Button de Bootstrap con clases y tamaño */}
          {/* Añadido un div para que se muestren en línea y tengan un poco de espacio */}
          <div className="d-flex gap-2 mb-3"> {/* Agregamos un pequeño margen inferior (mb-3) */}
            <Button variant="success" size="sm" className="estado-ticket-btn">Ticket</Button>
            <Button variant="warning" size="sm" className="estado-ticket-btn">Pendiente</Button>
          </div>

          <div className="form-group-row mt-3">
            <label className="form-label">Descripción:</label>
            <div className="form-control-wrapper">
              <Form.Control as="textarea" rows={3} value={modalDetalles?.descripcion || ''} readOnly />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
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