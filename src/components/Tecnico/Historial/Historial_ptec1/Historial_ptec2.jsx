import React, { useState } from 'react';
import { Button, Alert, Dropdown, Modal, Form , Pagination} from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./Historial_ptec2.css";
import Footer from '../../../Footer/Footer.jsx';
import Header_HistorialTec from '../../header_historialTec/Header_HistorialTec.jsx';

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
       
        <button className="ver-boton209" onClick={onVerClick}>Ver</button>
      </div>
    </div>
  </div>
  );
};

const Listaxd = ({ onVerClick }) => {
  const tickets = [
    { estado: 'Terminado', detalles: { fecha1: '',fecha2: '', modelo: '', serie: '', tecnico: '', ambiente: '',ticket:'',descripcion: '' } },
    { estado: 'Terminado', detalles: { fecha1: '',fecha2: '', modelo: '', serie: '', tecnico: '', ambiente: '',ticket:'', descripcion: '' } },
    { estado: 'Terminado', detalles: { fecha1: '',fecha2: '', modelo: '', serie: '', tecnico: '', ambiente: '',ticket:'', descripcion: '' } },
    { estado: 'Terminado', detalles: { fecha1: '',fecha2: '', modelo: '', serie: '', tecnico: '', ambiente: '',ticket:'', descripcion: '' } },
    { estado: 'Terminado', detalles: { fecha1: '',fecha2: '', modelo: '', serie: '', tecnico: '', ambiente: '',ticket:'', descripcion: '' } },
   
  
    
  ];

  return (
    <div className="lista-tickets201">

  <div className="d-flex justify-content-between align-items-center">
  
  </div>



      {tickets.map((t, i) => (
        <Ticketxd key={i} estado={t.estado} ticket={t.ticket} onVerClick={() => onVerClick(t.detalles)} />
      ))}
    </div>
  );
};

const Historial_ptec2 = () => {
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
      <Header_HistorialTec /> 
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
          <Modal.Title>Historial prestamos</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body217">
          <div className="form-group-row210">
            <label className="form-label211">Fecha de inicio:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="date" value={modalDetalles?.fecha1 || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row210">
            <label className="form-label211">Fecha de fin:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="date" value={modalDetalles?.fecha2 || ''} readOnly />
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
            <label className="form-label211">Ambiente:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="text" value={modalDetalles?.ambiente || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row210">
            <label className="form-label211">Cantidad:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="number"  />
            </div>
          </div>
          <div className="form-group-row210 mt-3">
            <label className="form-label211">Observaciones:</label>
            <div className="form-control-wrapper212">
              <Form.Control as="textarea" rows={3} value={modalDetalles?.descripcion || ''} readOnly />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer21800">
          <Button className='espichar' variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </div>
  );
};

export default Historial_ptec2;
