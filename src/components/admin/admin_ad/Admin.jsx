import React, { useState, useEffect } from 'react';
import { Button, Alert, Dropdown, Modal, Form, Spinner } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./admin.css";
import Footer from '../../Footer/Footer.jsx';
import HeaderAd from '../header_admin/header_ad.jsx'; 
import { Ticket } from 'react-bootstrap-icons';
import { obtenertickets } from '../../../api/ticket.js';

const Listaxd = ({ onVerClick }) => {
  const [elementoSeleccionado, setElementoSeleccionado] = useState('Todos');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const datosTickets = await obtenertickets();
      setTickets(Array.isArray(datosTickets) ? datosTickets : []);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar tickets:', err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTickets();
  }, []);

  const ticketsArray = Array.isArray(tickets) ? tickets : [];
  
  const ticketsFiltrados = elementoSeleccionado === 'Todos' 
    ? ticketsArray 
    : ticketsArray.filter(ticket => 
        ticket && 
        ticket.elemento && 
        ticket.elemento.toLowerCase() === elementoSeleccionado.toLowerCase()
      );
  
  const handleselectElemento = (elemento) => {
    setElementoSeleccionado(elemento);
  };

  if (loading) {
    return (
      <div className="container-1201 d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando tickets...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-1201">
        <Alert variant="danger">
          <strong>Error:</strong> {error}
          <div className="mt-2">
            <Button variant="primary" onClick={cargarTickets}>
              Reintentar
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container-1201">
      <Alert variant="success" className="alert-1202">
        <div className="flex-1203">
          <div className="flex-inner-1204">
            <strong className="strong-1205">TICKET</strong>
            <Dropdown>
              <Dropdown.Toggle 
                variant="success" 
                id="dropdown-basic-1206"
                className="custom-dropdown-toggle"
              >
                {elementoSeleccionado}
              </Dropdown.Toggle>
              <Dropdown.Menu className="custom-dropdown-menu">
                <Dropdown.Item 
                  onClick={() => handleselectElemento('Todos')}
                  className="custom-dropdown-item"
                >
                  Todos
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={() => handleselectElemento('portatil')}
                  className="custom-dropdown-item"
                >
                  Portátiles
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={() => handleselectElemento('Equipo de escritorio')}
                  className="custom-dropdown-item"
                >
                  Equipos de escritorio
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={() => handleselectElemento('Televisor')}
                  className="custom-dropdown-item"
                >
                  Televisores
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className='contador-ticket-1207'>
            mostrando {ticketsFiltrados.length} tickets
            de {ticketsArray.length} tickets
          </div>
        </div>
      </Alert>
      {ticketsFiltrados.length === 0 && !loading && (
        <div className="text-center py-5">
          <div className="mb-3">
            <Ticket size={48} className="text-muted" />
          </div>
          <h5 className="text-muted">Libre de tickets</h5>
          <p className="text-muted">No hay tickets para mostrar en este momento</p>
        </div>
      )}
      {ticketsFiltrados.length > 0 && (
        <div className="grid-1208">
          {ticketsFiltrados.map((t, i) => (
            <div className="card-ticket-1209" key={t?.id || i}>
              <div className="header-card-1210"></div>
              <div className="info-card-1211">
                <p className="title-card-1212">{t?.ticket || `Ticket ${i + 1}`}</p>
                <p className="elemento-card-1213">{t?.elemento || 'Sin elemento'}</p>
                <span className={`status-card-1214 ${(t?.estado?.toLowerCase().replace(' ', '-') || 'pendiente')}`}>
                  {t?.estado || 'Pendiente'}
                </span>
              </div>
              <div className="footer-card-1215">
                <button 
                  type="button" 
                  className="action-card-1216"
                  onClick={() => onVerClick(t?.detalles || t)}
                >
                  Ver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="pagination-1217">
        <div className="pagination-inner-1218">
          <label>
            <input value="1" name="value-radio" id="value-1" type="radio" defaultChecked />
            <span>1</span>
          </label>
          <label>
            <input value="2" name="value-radio" id="value-2" type="radio" />
            <span>2</span>
          </label>
          <label>
            <input value="3" name="value-radio" id="value-3" type="radio" />
            <span>3</span>
          </label>
          <span className="selection-1219"></span>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalDetalles, setModalDetalles] = useState(null);

  const handleVerClick = (detalles) => {
    setModalDetalles(detalles || {});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalDetalles(null);
  };

  return (
    <div className="page-with-footer-1227">
      <HeaderAd />
      <Listaxd onVerClick={handleVerClick} />
      <Modal show={showModal} onHide={handleCloseModal} className="modal-1220" centered>
        <Modal.Header closeButton className="modal-header-1221">
          <Modal.Title>Detalles del Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-1222">
          <div className="form-row-1223">
            <label className="form-label-1224">Fecha de inicio:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={modalDetalles?.fecha1 || modalDetalles?.fechaInicio || 'No disponible'} 
                readOnly 
              />
            </div>
          </div>
          <div className="form-row-1223">
            <label className="form-label-1224">Fecha de fin:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={modalDetalles?.fecha2 || modalDetalles?.fechaFin || 'No disponible'} 
                readOnly 
              />
            </div>
          </div>
          <div className="form-row-1223">
            <label className="form-label-1224">Modelo de PC:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={modalDetalles?.modelo || 'No disponible'} 
                readOnly 
              />
            </div>
          </div>

          <div className="form-row-1223">
            <label className="form-label-1224">Número de serie:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={modalDetalles?.serie || modalDetalles?.numeroSerie || 'No disponible'} 
                readOnly 
              />
            </div>
          </div>

          <div className="form-row-1223">
            <label className="form-label-1224">Nombre del técnico:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={modalDetalles?.tecnico || modalDetalles?.tecnicoNombre || 'No disponible'} 
                readOnly 
              />
            </div>
          </div>

          <div className="form-row-1223">
            <label className="form-label-1224">Ambiente:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={modalDetalles?.ambiente || 'No disponible'} 
                readOnly 
              />
            </div>
          </div>
          <div className="form-row-1223">
            <label className="form-label-1224">Ticket:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                type="text" 
                value={modalDetalles?.ticket || modalDetalles?.id || 'No disponible'} 
                readOnly 
              />
            </div>
          </div>
          <div className="form-row-1223 mt-3">
            <label className="form-label-1224">Descripción:</label>
            <div className="form-control-wrap-1225">
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={modalDetalles?.descripcion || modalDetalles?.problema || 'No disponible'} 
                readOnly 
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer-1226">
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