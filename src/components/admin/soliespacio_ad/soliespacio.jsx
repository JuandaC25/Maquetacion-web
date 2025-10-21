import React, { useState } from 'react';
import { Button, Alert, Dropdown, Modal, Form, Pagination } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./soliespacio.css";
import Footer from '../../Footer/Footer.jsx';
import HeaderAd from '../header_soliespacio/header_soliespacio.jsx'; 

const Ticketxd = ({ estado, onVerClick, detalles }) => {
  
  return (
    <div className="solicitud-card-container">
      <div className="solicitud-card">
        <div className="solicitud-card-border-top">
        </div>
        <div className="solicitud-card-content">
          <span className="solicitud-user-name">{detalles?.usuario || 'Usuario'}</span>
          <p className="solicitud-space-type">{detalles?.espacio || 'Espacio'}</p>
          <p className="solicitud-date-info">
            {detalles?.fecha1 ? new Date(detalles.fecha1).toLocaleDateString() : 'Fecha'}
          </p>
          <p className="solicitud-status-info">{detalles?.estado || 'Estado'}</p>
          <button className="solicitud-view-button" onClick={onVerClick}>Ver</button>
        </div>
      </div>
    </div>
  );
};

const Listaxd = ({ onVerClick }) => {
  const [espacioSeleccionado, setEspacioSeleccionado] = useState('Todos');
  const espacio = [
    { estado: 'pendiente', detalles: {fecha1: '2023-05-15 08:30', fecha2: '2023-05-15 10:45', espacio: 'auditorio', usuario: 'María Rodríguez', estado: 'pendiente' }},
    { estado: 'en uso', detalles: {fecha1: '2023-11-28 08:00', fecha2: '2023-11-28 12:00', espacio: 'auditorio', usuario: 'Carlos Mendoza', estado: 'en uso'}},
    { estado: 'pendiente', detalles: {fecha1: '2023-11-28 09:30', fecha2: '2023-11-28 11:30', espacio: 'canchas', usuario: 'Laura Vélez', estado: 'pendiente'}},
    { estado: 'en uso', detalles: {fecha1: '2023-11-28 14:00', fecha2: '2023-11-28 18:00', espacio: 'canchas', usuario: 'Javier Ríos', estado: 'en uso'}},
    { estado: 'en uso', detalles: {fecha1: '2023-11-30 07:00', fecha2: '2023-11-30 09:30', espacio: 'auditorio', usuario: 'Diego Morales', estado: 'en uso'}},
    { estado: 'pendiente', detalles: {fecha1: '2023-11-30 11:00', fecha2: '2023-11-30 13:00', espacio: 'canchas', usuario: 'Marta Gómez', estado: 'pendiente'}},
    { estado: 'en uso', detalles: {fecha1: '2023-11-30 16:00', fecha2: '2023-11-30 20:00', espacio: 'canchas', usuario: 'Ricardo Torres', estado: 'en uso'}}
  ];
  
  const espacioFiltrado = espacioSeleccionado === 'Todos' ? espacio : espacio.filter(t => t.detalles.espacio.toLowerCase() === espacioSeleccionado.toLowerCase());
  
  const handleSelectEspacio = (espacio) => {
    setEspacioSeleccionado(espacio);
  };
  
  return (
    <div className="solicitud-lista-tickets">
      <Alert variant="success" className="solicitud-alert">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <Dropdown>
              <Dropdown.Toggle 
                variant="success" 
                id="dropdown-basic-espacio"
                className="dropdown-toggle-xd146"
              >
                Espacio
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-xd147">
                <Dropdown.Item onClick={() => handleSelectEspacio('Todos')} className="dropdown-item-xd148">Todos</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelectEspacio('canchas')} className="dropdown-item-xd148">Canchas</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelectEspacio('auditorio')} className="dropdown-item-xd148">Auditorio</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </Alert>

      <div className="solicitud-tickets-grid">
        {espacioFiltrado.map((t, i) => (
          <Ticketxd key={i} estado={t.estado} detalles={t.detalles} onVerClick={() => onVerClick(t.detalles)} />
        ))}
      </div>
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
      <div className='solicitud-pagination'>
        <div className='solicitud-pagination-inner'>
          <label>
            <input value="1" name="value-radio" id="value-1" type="radio" defaultChecked />
            <span>1</span>
          </label>
          <label>
            <input value="2" name="value-radio" id="value-2" type="radio" />
            <span>2</span>
          </label>
          <label>
            <input value="3" name="value-radio" id="value-3" type="radio"/>
            <span>3</span>
          </label>
          <span className="solicitud-selection"></span>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal} className="solicitud-modal" centered>
        <Modal.Header closeButton className="solicitud-modal-header-verde">
          <Modal.Title>Detalles de la solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body className="solicitud-modal-body">
          <div className="solicitud-form-group-row">
            <label className="solicitud-form-label">Fecha y hora de inicio:</label>
            <div className="solicitud-form-control-wrapper">
              <Form.Control type="text" value={modalDetalles?.fecha1 || ''} readOnly />
            </div>
          </div>
          <div className="solicitud-form-group-row">
            <label className="solicitud-form-label">Fecha y hora de fin:</label>
            <div className="solicitud-form-control-wrapper">
              <Form.Control type="text" value={modalDetalles?.fecha2 || ''} readOnly />
            </div>
          </div>
          <div className="solicitud-form-group-row">
            <label className="solicitud-form-label">Espacio:</label>
            <div className="solicitud-form-control-wrapper">
              <Form.Control type="text" value={modalDetalles?.espacio || ''} readOnly />
            </div>
          </div>
          <div className="solicitud-form-group-row">
            <label className="solicitud-form-label">Nombre del Usuario:</label>
            <div className="solicitud-form-control-wrapper">
              <Form.Control type="text" value={modalDetalles?.usuario || ''} readOnly />
            </div>
          </div>
          <div className="solicitud-form-group-row">
            <label className="solicitud-form-label">Estado:</label>
            <div className="solicitud-form-control-wrapper">
              <Form.Control type="text" value={modalDetalles?.estado || ''} readOnly />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="solicitud-modal-footer">
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </div>
  );
};

export default Soliespacio;