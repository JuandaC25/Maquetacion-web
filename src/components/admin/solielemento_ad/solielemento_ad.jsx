import React, { useState, useEffect } from 'react';
import { Button, Alert, Dropdown, Modal, Form, Pagination } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./solielemento.css";
import Footer from '../../Footer/Footer.jsx';
import HeaderAd from '../header_solielemento/header_solielemento.jsx';
import { obtenersolicitudes } from '../../../api/solicitudesApi';

const Ticketxd = ({ estado, onVerClick, detalles }) => {
  return (
    <div className="margen-1601">
      <div className="card-1602">
        <div className="infos-1603">
          <div className="image-1604"></div>
          <div className="info-1605">
            <div>
              <p className="name-1606">
                {detalles?.usuario || 'Usuario no disponible'}
              </p>
              <p className="function-1607">
                {detalles?.elemento || 'Elemento no disponible'}
              </p>
            </div>
            <div className="stats-1608">
              <p className="flex-1609 flex-col-1610">
                Ambiente
                <span className="state-value-1611">
                  {detalles?.ambiente || 'N/A'}
                </span>
              </p>
              <p className="flex-1609">
                Estado
                <span className="state-value-1611" style={{ 
                  color: estado === 'pendiente' ? '#ff6b6b' : 
                         estado === 'en proceso' ? '#4ecdc4' : '#45b7d1'
                }}>
                  {estado}
                </span>
              </p>
            </div>
          </div>
        </div>
        <button className="request-1612" type="button" onClick={onVerClick}>
          Ver
        </button>
      </div>
    </div>
  );
};

const Listaxd = ({ onVerClick }) => {
  const [elementoSeleccionado, setElementoSeleccionado] = useState('Todos');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    obtenersolicitudes()
      .then((data) => {
        if (!mounted) return;
        const arr = Array.isArray(data) ? data : [];
        const elementos = arr.filter(s => Boolean((s.elemento && s.elemento !== '') || (s.detalles && s.detalles.elemento)));
        setTickets(elementos);
      })
      .catch(err => {
        console.error('Error al obtener solicitudes:', err);
        setError(err.message || 'Error al cargar solicitudes');
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const ticketsFiltrados = elementoSeleccionado === 'Todos'
    ? tickets
    : tickets.filter(ticket => {
        const nombre = (ticket.elemento || ticket.detalles?.elemento || '').toString();
        return nombre.toLowerCase() === elementoSeleccionado.toLowerCase();
      });

  const handleSelectElemento = (elemento) => { setElementoSeleccionado(elemento); };

  if (loading) return (<div className="lista-tickets-1613">Cargando solicitudes...</div>);
  if (error) return (<div className="lista-tickets-1613">Error: {error}</div>);

  return (
    <div className="lista-tickets-1613">
      <Alert variant="success" className="alert-1614">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <Dropdown>
              <Dropdown.Toggle 
                variant="success" 
                id="dropdown-basic-1615"
                className="dropdown-toggle-xd146"
              >
                Elemento
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-xd147">
                <Dropdown.Item onClick={() => handleSelectElemento('Todos')} className="dropdown-item-xd148">Todos</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelectElemento('Portatil')} className="dropdown-item-xd148">Portátiles</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelectElemento('Equipo de escritorio')} className="dropdown-item-xd148">Equipos de escritorio</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelectElemento('Televisor')} className="dropdown-item-xd148">Televisores</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </Alert>

      <div className="cards-container-1616">
        {ticketsFiltrados.map((t, i) => {
          const detalles = t.detalles ? t.detalles : {
            fecha1: t.fecha1,
            fecha2: t.fecha2,
            elemento: t.elemento,
            elementoserie: t.elementoserie,
            accesorios: t.accesorios,
            accesoriosserie: t.accesoriosserie,
            usuario: t.usuario,
            tecnico: t.tecnico,
            ambiente: t.ambiente,
            estado: t.estado
          };
          const estado = t.estado || detalles.estado || '';
          return (
            <Ticketxd key={i} estado={estado} detalles={detalles} onVerClick={() => onVerClick(detalles)} />
          );
        })}
      </div>
    </div>
  );
};

const Solielemento = () => {
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
      <div className="pagination-1617">
        <div className="pagination-inner-1618">
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
          <span className="selection-1619"></span>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal} centered dialogClassName="modern-modal-dialog-1627">
        <Modal.Header closeButton className="modern-modal-header-1628">
          <Modal.Title className="modern-modal-title-1629">Detalles de la solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modern-modal-body-1630">
          <div className="detail-item-1631">
            <label className="detail-label-1632">Fecha y hora de inicio:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={modalDetalles?.fecha1 || ''} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Fecha y hora de fin:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={modalDetalles?.fecha2 || ''} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Tipo de elemento:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={modalDetalles?.elemento || ''} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Número de serie del elemento:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={modalDetalles?.elementoserie || ''} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Accesorios:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={modalDetalles?.accesorios || ''} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Número de serie de accesorio:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={modalDetalles?.accesoriosserie || ''} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Nombre del Usuario:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={modalDetalles?.usuario || ''} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Nombre del técnico:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={modalDetalles?.tecnico || ''} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Ambiente:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={modalDetalles?.ambiente || ''} readOnly />
            </div>
          </div>

          <div className="detail-item-1631">
            <label className="detail-label-1632">Estado:</label>
            <div className="detail-value-display-1633">
              <Form.Control type="text" value={modalDetalles?.estado || ''} readOnly />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="modern-modal-footer-1634">
          <Button variant="secondary" onClick={handleCloseModal} className="modal-action-button-1635 cancel-action-1636">
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </div>
  );
};

export default Solielemento;