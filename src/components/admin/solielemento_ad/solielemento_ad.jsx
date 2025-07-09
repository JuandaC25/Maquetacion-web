import React, { useState } from 'react';
import { Button, Alert, Dropdown, Modal, Form , Pagination} from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./solielemento.css";
import Footer from '../../Footer/Footer.jsx';
import HeaderAd from '../header_solielemento/header_solielemento.jsx'; 

const Ticketxd = ({ estado, onVerClick }) => {
  return (
    <div className="margen200">
    <div className="ticket-item202">
      <div className="izquierda203">
        <div className="icono207">
          <span role="img" aria-label="computadora">🖥️🖱️</span>
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
{ estado: 'pendiente',detalles:{fecha1: '2023-05-15 08:30',fecha2:'2023-05-15 10:45',elemento:'Portátil HP EliteBook', elementoserie: 'SNHPELB83472', accesorios: 'Mouse inalámbrico', accesoriosserie: 'SNMSWL89234', usuario: 'María Rodríguez', tecnico: 'Carlos Méndez', ambiente: '203',estado: 'pendiente' }},
{ estado: 'pendiente',detalles: {fecha1: '2023-11-10 09:15',fecha2: '2023-11-10 11:30',elemento: 'Portátil Dell Latitude',elementoserie: 'SNDLLT542189',accesorios: 'Cargador y mousepad',accesoriosserie: 'SNCHGDL887/SNMPDL442',usuario: 'Andrés Gutiérrez',tecnico: 'Luisa Fernández',ambiente: '205',estado: 'pendiente'}},
{ estado: 'en proceso',detalles: {fecha1: '2023-11-12 14:00',fecha2: '2023-11-12 16:20',elemento: 'Computador todo en uno Lenovo',elementoserie: 'SNLNVAI789032',accesorios: 'Teclado inalámbrico',accesoriosserie: 'SNTKLN55621',usuario: 'Carolina Méndez',tecnico: 'Roberto Jiménez',ambiente: '102',estado: 'en proceso'}},
{ estado: 'pendiente',detalles: {fecha1: '2023-11-15 08:45',fecha2: '2023-11-15 10:15',elemento: 'Portátil MacBook Pro',elementoserie: 'SNMBP2023567',accesorios: 'Adaptador USB-C a HDMI',accesoriosserie: 'SNUSBHD789',usuario: 'Sofía Ramírez',tecnico: 'Diego Castro',ambiente: '302',estado: 'pendiente'}},
{ estado: 'en proceso',detalles: {fecha1: '2023-11-18 10:30',fecha2: '2023-11-18 12:45',elemento: 'Computador todo en uno HP',elementoserie: 'SNHPAIO334567',accesorios: 'Mouse óptico y cable de red',accesoriosserie: 'SNMSHP445/SNETHP778',usuario: 'Jorge Navarro',tecnico: 'María López',ambiente: '201',estado: 'en proceso'}},
{ estado: 'pendiente',detalles: {fecha1: '2023-11-20 13:20',fecha2: '2023-11-20 15:40',elemento: 'Portátil Asus VivoBook',elementoserie: 'SNASVB159753',accesorios: 'Cargador original',accesoriosserie: 'SNCHAS88234',usuario: 'Fernanda Soto',tecnico: 'Ricardo Mora',ambiente: '103',estado: 'pendiente'}},
{ estado: 'pendiente',detalles: {fecha1: '2023-11-23 11:00',fecha2: '2023-11-23 13:15',elemento: 'Computador todo en uno Acer',elementoserie: 'SNACAI789654',accesorios: 'Teclado mecánico',accesoriosserie: 'SNTKMEC1234',usuario: 'Raúl Villanueva',tecnico: 'Patricia Salazar',ambiente: '107',estado: 'pendiente'}}
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
          <Dropdown.Item href="#/action-4">Portátiles</Dropdown.Item>
          <Dropdown.Item href="#/action-">Equipos de escritorio</Dropdown.Item>
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
            <label className="form-label211">tipo de elemento:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="text" value={modalDetalles?.elemento || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row210">
            <label className="form-label211">Número de serie del elemento:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="text" value={modalDetalles?.elementoserie || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row210">
            <label className="form-label211">accesorios:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="text" value={modalDetalles?.accesorios || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row210">
            <label className="form-label211">Número de serie de accesorio:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="text" value={modalDetalles?.accesoriosserie || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row210">
            <label className="form-label211">Nombre del Usuario:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="text" value={modalDetalles?.usuario || ''} readOnly />
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
          <div className="form-group-row210">
            <label className="form-label211">Estado:</label>
            <div className="form-control-wrapper212">
              <Form.Control type="text" value={modalDetalles?.estado || ''} readOnly />
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

export default Solielemento ;