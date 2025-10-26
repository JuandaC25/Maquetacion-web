import React, { useState, useEffect } from 'react';
import { Button, Alert, Dropdown, Modal, Form, Pagination } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./soliespacio.css";
import Footer from '../../Footer/Footer.jsx';
import HeaderAd from '../header_soliespacio/header_soliespacio.jsx';
import { obtenersolicitudes } from '../../../api/solicitudesApi'; 

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
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    obtenersolicitudes()
      .then(data => {
        if (!mounted) return;
        const arr = Array.isArray(data) ? data : [];
        const espacios = arr.filter(s => Boolean((s.espacio && s.espacio !== '') || (s.detalles && s.detalles.espacio)));
        setTickets(espacios);
      })
      .catch(err => {
        console.error('Error al obtener solicitudes:', err);
        setError(err.message || 'Error al cargar solicitudes');
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const espacioFiltrado = espacioSeleccionado === 'Todos'
    ? tickets
    : tickets.filter(t => ((t.espacio || t.detalles?.espacio) || '').toString().toLowerCase() === espacioSeleccionado.toLowerCase());

  const handleSelectEspacio = (espacio) => { setEspacioSeleccionado(espacio); };

  if (loading) return (<div className="solicitud-lista-tickets">Cargando solicitudes...</div>);
  if (error) return (<div className="solicitud-lista-tickets">Error: {error}</div>);
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

      {espacioFiltrado.length === 0 ? (
        <div className="solicitud-empty-placeholder-1713">
          <div className="solicitud-empty-inner-1714">
            <p className="solicitud-empty-title">No hay espacios para visualizar</p>
            <p className="solicitud-empty-text">No se encontraron solicitudes para el filtro seleccionado.</p>
          </div>
        </div>
      ) : (
        <div className="solicitud-tickets-grid">
          {espacioFiltrado.map((t, i) => {
          const detalles = t.detalles ? t.detalles : {
            fecha1: t.fecha1,
            fecha2: t.fecha2,
            espacio: t.espacio,
            usuario: t.usuario,
            estado: t.estado
          };
          const estado = t.estado || detalles.estado || '';
          return (<Ticketxd key={i} estado={estado} detalles={detalles} onVerClick={() => onVerClick(detalles)} />);
          })}
        </div>
      )}
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
  <div className="page-with-footer-1712">
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
      <Modal show={showModal} onHide={handleCloseModal} centered dialogClassName="modern-modal-dialog-1700">
        <Modal.Header closeButton className="modern-modal-header-1701">
          <Modal.Title className="modern-modal-title-1702">Detalles de la solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modern-modal-body-1703">
          <div className="detail-item-1704">
            <label className="detail-label-1705">Fecha y hora de inicio:</label>
            <div className="detail-value-display-1706">
              <Form.Control type="text" value={modalDetalles?.fecha1 || ''} readOnly />
            </div>
          </div>
          <div className="detail-item-1704">
            <label className="detail-label-1705">Fecha y hora de fin:</label>
            <div className="detail-value-display-1706">
              <Form.Control type="text" value={modalDetalles?.fecha2 || ''} readOnly />
            </div>
          </div>
          <div className="detail-item-1704">
            <label className="detail-label-1705">Espacio:</label>
            <div className="detail-value-display-1706">
              <Form.Control type="text" value={modalDetalles?.espacio || ''} readOnly />
            </div>
          </div>
          <div className="detail-item-1704">
            <label className="detail-label-1705">Nombre del Usuario:</label>
            <div className="detail-value-display-1706">
              <Form.Control type="text" value={modalDetalles?.usuario || ''} readOnly />
            </div>
          </div>
          <div className="detail-item-1704">
            <label className="detail-label-1705">Estado:</label>
            <div className="detail-value-display-1706">
              <Form.Control type="text" value={modalDetalles?.estado || ''} readOnly />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="modern-modal-footer-1707">
          <Button variant="secondary" onClick={handleCloseModal} className="modal-action-button-1708 cancel-action-1709">
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </div>
  );
};

export default Soliespacio;