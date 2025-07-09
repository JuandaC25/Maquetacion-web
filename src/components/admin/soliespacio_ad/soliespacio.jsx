import React, { useState } from 'react';
import { Button, Alert, Dropdown, Modal, Form , Pagination} from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./soliespacio.css";
import Footer from '../../Footer/Footer.jsx';
import HeaderAd from '../header_soliespacio/header_soliespacio.jsx'; 

const Ticketxd = ({ estado, onVerClick }) => {
  return (
    <div className="margen200">
    <div className="ticket-item202">
      <div className="izquierda203">
        <div className="icono207">
          <span role="img" aria-label="espacio">📋</span>
        </div>
        <div className="estado208">
          <span>{estado}</span>
        </div>
      </div>
      <div className="derecha204">
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
{ estado: 'pendiente',detalles:{fecha1: '2023-05-15 08:30',fecha2:'2023-05-15 10:45',espacio:'', usuario: 'María Rodríguez',estado: 'en uso ', descripcion: 'urgente para clases' }},
{ estado: 'en uso',detalles: {fecha1: '2023-11-28 08:00',fecha2: '2023-11-28 12:00',espacio: 'auditorio',usuario: 'Carlos Mendoza',estado: 'en uso',descripcion: 'Evento de inauguración - URGENTE'}},
{ estado: 'pendiente',detalles: {fecha1: '2023-11-28 09:30',fecha2: '2023-11-28 11:30',espacio: 'canchas',usuario: 'Laura Vélez',estado: 'pendiente',descripcion: 'Reunión de aprendices nuevos'}},
{ estado: 'en uso',detalles: {fecha1: '2023-11-28 14:00',fecha2: '2023-11-28 18:00',espacio: 'canchas',usuario: 'Javier Ríos',estado: 'en uso',descripcion: 'Torneo  de voleibol'}},
{ estado: 'pendiente',detalles: {fecha1: '2023-11-29 10:00',fecha2: '2023-11-29 12:00',espacio: 'laboratorio de ciencias',usuario: 'Dra. Sofía Castro',estado: 'pendiente',descripcion: 'Prácticas de química orgánica'}},
{ estado: 'pendiente',detalles: {fecha1: '2023-11-29 15:00',fecha2: '2023-11-29 17:00',espacio: 'biblioteca',usuario: 'Ana Karen Ramírez',estado: 'pendiente',descripcion: 'Club de lectura juvenil'}},
{ estado: 'en uso',detalles: {fecha1: '2023-11-30 07:00',fecha2: '2023-11-30 09:30',espacio: 'auditorio',usuario: 'Diego Morales',estado: 'en uso',descripcion: 'Conferencia'}},
{ estado: 'pendiente',detalles: {fecha1: '2023-11-30 11:00',fecha2: '2023-11-30 13:00',espacio: 'canchas',usuario: 'Marta Gómez',estado: 'pendiente',descripcion: 'Seminario de emprendimiento'}},
{ estado: 'en uso',detalles: {fecha1: '2023-11-30 16:00',fecha2: '2023-11-30 20:00',espacio: 'canchas',usuario: ' Ricardo Torres',estado: 'en uso',descripcion: 'educación física'}}
];
  return (
    <div className="lista-tickets201">
<Alert variant="success" className="alert201">
  <div className="d-flex justify-content-between align-items-center">
    <div className="d-flex align-items-center gap-3">
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          espacio
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#/action-4">canchas</Dropdown.Item>
          <Dropdown.Item href="#/action-">auditorio</Dropdown.Item>
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

const Soliespacio = () => {
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
          <Modal.Title>Detalles de la solicitud </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body217">
          <div className="form-group-row210">
            <label className="form-label211">Fecha y hora de inicio:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="text" value={modalDetalles?.fecha1 || ''} readOnly />
            </div>
          </div>

          <div className="form-group-row210">
            <label className="form-label211">fecha y hora de fin:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="text" value={modalDetalles?.fecha2 || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row210">
            <label className="form-label211">espacio:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="text" value={modalDetalles?.espacio || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row210">
            <label className="form-label211">Nombre del Usuario:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="text" value={modalDetalles?.usuario || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row210">
            <label className="form-label211">Estado:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="text" value={modalDetalles?.estado || ''} readOnly />
            </div>
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

export default Soliespacio ;