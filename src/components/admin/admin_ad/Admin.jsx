import React, { useState } from 'react';
import { Button, Alert, Dropdown, Modal, Form } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./admin.css";
import Footer from '../../Footer/Footer.jsx';
import HeaderAd from '../header_admin/header_ad.jsx'; 
import { Ticket } from 'react-bootstrap-icons';

const Listaxd = ({ onVerClick }) => {
  const [elementoSeleccionado,setElementoSeleccionado]=useState('Todos');
  const tickets = [
    { estado: 'En proceso', elemento:'Televisor', ticket: 'Primer ticket', detalles: { fecha1: '2025-04-23',fecha2: '2025-04-23', modelo: 'HP ProBook', serie: 'ABC123', tecnico: 'Juan Pérez', ambiente: 'Oficina 101',ticket:'primer ticket',descripcion: 'El equipo presenta lentitud al iniciar.' } },
    { estado: 'En proceso', elemento:'Portatil', ticket: 'Segundo ticket', detalles: { fecha1: '2025-04-22',fecha2: '2025-04-23', modelo: 'Dell Latitude', serie: 'DEF456', tecnico: 'María Gómez', ambiente: 'Laboratorio A',ticket:'segundo ticket ', descripcion: 'La pantalla parpadea intermitentemente.' } },
    { estado: 'Pendiente', elemento:'Televisor', ticket: 'Tercer ticket', detalles: { fecha1: '2025-04-21',fecha2: '2025-04-23', modelo: 'Lenovo ThinkPad', serie: 'GHI789', tecnico: 'Carlos López', ambiente: 'Recepción',ticket:'tercer ticket', descripcion: 'No se puede conectar a la red Wi-Fi.' } },
    { estado: 'Pendiente', elemento:'Equipo de escritorio', ticket: 'Primer ticket', detalles: { fecha1: '2025-04-20',fecha2: '2025-04-23', modelo: 'HP ProDesk', serie: 'JKL012', tecnico: 'Ana Rodríguez', ambiente: 'Sala de juntas',ticket:'primer ticket ', descripcion: 'El teclado no responde.' } },
    { estado: 'En proceso', elemento:'Televisor', ticket: 'Primer ticket', detalles: { fecha1: '2025-04-19',fecha2: '2025-04-23', modelo: 'Dell OptiPlex', serie: 'MNO345', tecnico: 'Pedro Martínez', ambiente: 'Almacén',ticket:'primer ticket ', descripcion: 'Fallo en el disco duro.' } },
    { estado: 'Pendiente', elemento:'Portatil', ticket: 'Segundo ticket', detalles: { fecha1: '2025-04-18',fecha2: '2025-04-23', modelo: 'Lenovo IdeaCentre', serie: 'PQR678', tecnico: 'Laura Sánchez', ambiente: 'Biblioteca',ticket:'segundo ticket ', descripcion: 'El mouse no funciona correctamente.' } },
    { estado: 'Pendiente', elemento:'Televisor', ticket: 'Primer ticket', detalles: { fecha1: '2025-04-17',fecha2: '2025-04-23', modelo: 'HP All-in-One', serie: 'STU901', tecnico: 'Sofía Ramírez', ambiente: 'Cafetería',ticket:'primer ticket', descripcion: 'Problemas con el audio.' } },
    { estado: 'En proceso', elemento:'Equipo de escritorio', ticket: 'Segundo ticket', detalles: { fecha1: '2025-04-16',fecha2: '2025-04-23', modelo: 'Dell Inspiron', serie: 'VWX234', tecnico: 'Miguel Torres', ambiente: 'Aula Magna',ticket:'segundo ticket', descripcion: 'La impresora no imprime.' } },
  ];
  const ticketsFiltrados = elementoSeleccionado === 'Todos' ? tickets : tickets.filter(ticket => ticket.elemento.toLowerCase() === elementoSeleccionado.toLowerCase());
  const getTicketClass = (ticketName) => {
    if (ticketName.includes('Primer')) return 'ticket-1201';
    if (ticketName.includes('Segundo')) return 'ticket-1202';
    if (ticketName.includes('Tercer')) return 'ticket-1203';
    return '';
  };
  const handleselectElemento=(elemento)=>{
    setElementoSeleccionado(elemento);
  };

  return (
    <div className="container-1201">
      <Alert variant="success" className="alert-1202">
        <div className="flex-1203">
          <div className="flex-inner-1204">
            <strong className="strong-1205">TICKET</strong>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic-1010">
                {elementoSeleccionado}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={()=>handleselectElemento('Todos')}>Todos</Dropdown.Item>
                <Dropdown.Item onClick={()=>handleselectElemento('portatil')}>Portátiles</Dropdown.Item>
                <Dropdown.Item onClick={()=> handleselectElemento('Equipo de escritorio')}>Equipos de escritorio</Dropdown.Item>
                <Dropdown.Item onClick={()=>handleselectElemento('Televisor')}>Televisores</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className='contador-ticket'>
            monstrando {ticketsFiltrados.length} tickets
            de {tickets.length} tickets
          </div>
        </div>
      </Alert>
      <div className="grid-1206">
        {ticketsFiltrados.map((t, i) => (
          <div className={`item-1207 ${getTicketClass(t.ticket)}`} key={i}>
            <div className="header-1208">
              <h5>{t.ticket}</h5>
            </div>
            <div className="content-1209">
              <div className="elemento-box">
                {t.elemento}
              </div>
              <span className="status-1210">{t.estado}</span>
              <button className="button-1211" onClick={() => onVerClick(t.detalles)}>
                <span className="transition-1212"></span>
                <span className="gradient-1213"></span>
                <span className="label-1214">Ver</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pagination-1215">
        <div className="pagination-inner-1216">
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
          <span className="selection-1217"></span>
        </div>
      </div>
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
      <Modal show={showModal} onHide={handleCloseModal} className="modal-1218" centered>
        <Modal.Header closeButton className="modal-header-1219">
          <Modal.Title>Detalles del Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-1220">
          <div className="form-row-1221">
            <label className="form-label-1222">Fecha de inicio:</label>
            <div className="form-control-wrap-1223">
              <Form.Control type="text" value={modalDetalles?.fecha1 || ''} readOnly />
            </div>
          </div>
          <div className="form-row-1221">
            <label className="form-label-1222">Fecha de fin:</label>
            <div className="form-control-wrap-1223">
              <Form.Control type="text" value={modalDetalles?.fecha2 || ''} readOnly />
            </div>
          </div>
          <div className="form-row-1221">
            <label className="form-label-1222">Modelo de PC:</label>
            <div className="form-control-wrap-1223">
              <Form.Control type="text" value={modalDetalles?.modelo || ''} readOnly />
            </div>
          </div>

          <div className="form-row-1221">
            <label className="form-label-1222">Número de serie:</label>
            <div className="form-control-wrap-1223">
              <Form.Control type="text" value={modalDetalles?.serie || ''} readOnly />
            </div>
          </div>

          <div className="form-row-1221">
            <label className="form-label-1222">Nombre del técnico:</label>
            <div className="form-control-wrap-1223">
              <Form.Control type="text" value={modalDetalles?.tecnico || ''} readOnly />
            </div>
          </div>

          <div className="form-row-1221">
            <label className="form-label-1222">Ambiente:</label>
            <div className="form-control-wrap-1223">
              <Form.Control type="text" value={modalDetalles?.ambiente || ''} readOnly />
            </div>
          </div>
          <div className="form-row-1221">
            <label className="form-label-1222">ticket:</label>
            <div className="form-control-wrap-1223">
              <Form.Control type="text" value={modalDetalles?.ticket || ''} readOnly />
            </div>
          </div>
          <div className="form-row-1221 mt-3">
            <label className="form-label-1222">Descripción:</label>
            <div className="form-control-wrap-1223">
              <Form.Control as="textarea" rows={3} value={modalDetalles?.descripcion || ''} readOnly />
            </div>
          </div>    
        </Modal.Body>
        <Modal.Footer className="modal-footer-1224">
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