import React, { useState } from 'react';
import { Button, Alert, Dropdown, Modal, Form, Pagination } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./solielemento.css";
import Footer from '../../Footer/Footer.jsx';
import HeaderAd from '../header_solielemento/header_solielemento.jsx'; 

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
  const[elementoSeleccionado, setElementoSeleccionado] = useState('Todos');
  const tickets = [
    { estado: 'pendiente',elemento:'Televisor', detalles: { fecha1: '2023-05-15 08:30', fecha2: '2023-05-15 10:45', elemento: 'Portátil HP EliteBook', elementoserie: 'SNHPELB83472', accesorios: 'Mouse inalámbrico', accesoriosserie: 'SNMSWL89234', usuario: 'María Rodríguez', tecnico: 'Carlos Méndez', ambiente: '203', estado: 'pendiente' } },
    { estado: 'pendiente',elemento:'Portatil', detalles: { fecha1: '2023-11-10 09:15', fecha2: '2023-11-10 11:30', elemento: 'Portátil Dell Latitude', elementoserie: 'SNDLLT542189', accesorios: 'Cargador y mousepad', accesoriosserie: 'SNCHGDL887/SNMPDL442', usuario: 'Andrés Gutiérrez', tecnico: 'Luisa Fernández', ambiente: '205', estado: 'pendiente' } },
    { estado: 'en proceso',elemento:'Equipo de escritorio', detalles: { fecha1: '2023-11-12 14:00', fecha2: '2023-11-12 16:20', elemento: 'Computador todo en uno Lenovo', elementoserie: 'SNLNVAI789032', accesorios: 'Teclado inalámbrico', accesoriosserie: 'SNTKLN55621', usuario: 'Carolina Méndez', tecnico: 'Roberto Jiménez', ambiente: '102', estado: 'en proceso' } },
    { estado: 'pendiente',elemento:'Equipo de escritorio', detalles: { fecha1: '2023-11-15 08:45', fecha2: '2023-11-15 10:15', elemento: 'Portátil MacBook Pro', elementoserie: 'SNMBP2023567', accesorios: 'Adaptador USB-C a HDMI', accesoriosserie: 'SNUSBHD789', usuario: 'Sofía Ramírez', tecnico: 'Diego Castro', ambiente: '302', estado: 'pendiente' } },
    { estado: 'en proceso',elemento:'Portatil', detalles: { fecha1: '2023-11-18 10:30', fecha2: '2023-11-18 12:45', elemento: 'Computador todo en uno HP', elementoserie: 'SNHPAIO334567', accesorios: 'Mouse óptico y cable de red', accesoriosserie: 'SNMSHP445/SNETHP778', usuario: 'Jorge Navarro', tecnico: 'María López', ambiente: '201', estado: 'en proceso' } },
    { estado: 'pendiente',elemento:'Televisor', detalles: { fecha1: '2023-11-20 13:20', fecha2: '2023-11-20 15:40', elemento: 'Portátil Asus VivoBook', elementoserie: 'SNASVB159753', accesorios: 'Cargador original', accesoriosserie: 'SNCHAS88234', usuario: 'Fernanda Soto', tecnico: 'Ricardo Mora', ambiente: '103', estado: 'pendiente' } },
    { estado: 'pendiente',elemento:'Televisor', detalles: { fecha1: '2023-11-23 11:00', fecha2: '2023-11-23 13:15', elemento: 'Computador todo en uno Acer', elementoserie: 'SNACAI789654', accesorios: 'Teclado mecánico', accesoriosserie: 'SNTKMEC1234', usuario: 'Raúl Villanueva', tecnico: 'Patricia Salazar', ambiente: '107', estado: 'pendiente' } }
  ];
const ticketsFiltrados = elementoSeleccionado === 'Todos' ? tickets : tickets.filter(ticket => ticket.elemento.toLowerCase() === elementoSeleccionado.toLowerCase());
  const handleSelectElemento = (elemento) => {
    setElementoSeleccionado(elemento);
  }
  return (
    <div className="lista-tickets-1613">
      <Alert variant="success" className="alert-1614">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic-1615">
                Elemento
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleSelectElemento('Todos')}>Todos</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelectElemento('Portatil')}>Portátiles</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelectElemento('Equipo de escritorio')}>Equipos de escritorio</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelectElemento('Televisor')}>Televisores</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

        </div>
      </Alert>

      <div className="cards-container-1616">
        {ticketsFiltrados.map((t, i) => (
          <Ticketxd key={i} estado={t.estado} detalles={t.detalles} onVerClick={() => onVerClick(t.detalles)} />
        ))}
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
      <Modal show={showModal} onHide={handleCloseModal} className="custom-modal-1620" centered>
        <Modal.Header closeButton className="modal-header-verde-1621">
          <Modal.Title>Detalles de la solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-1622">
          <div className="form-group-row-1623">
            <label className="form-label-1624">Fecha y hora de inicio:</label>
            <div className="form-control-wrapper-1625">
              <Form.Control type="text" value={modalDetalles?.fecha1 || ''} readOnly />
            </div>
          </div>

          <div className="form-group-row-1623">
            <label className="form-label-1624">Fecha y hora de fin:</label>
            <div className="form-control-wrapper-1625">
              <Form.Control type="text" value={modalDetalles?.fecha2 || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row-1623">
            <label className="form-label-1624">Tipo de elemento:</label>
            <div className="form-control-wrapper-1625">
              <Form.Control type="text" value={modalDetalles?.elemento || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row-1623">
            <label className="form-label-1624">Número de serie del elemento:</label>
            <div className="form-control-wrapper-1625">
              <Form.Control type="text" value={modalDetalles?.elementoserie || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row-1623">
            <label className="form-label-1624">Accesorios:</label>
            <div className="form-control-wrapper-1625">
              <Form.Control type="text" value={modalDetalles?.accesorios || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row-1623">
            <label className="form-label-1624">Número de serie de accesorio:</label>
            <div className="form-control-wrapper-1625">
              <Form.Control type="text" value={modalDetalles?.accesoriosserie || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row-1623">
            <label className="form-label-1624">Nombre del Usuario:</label>
            <div className="form-control-wrapper-1625">
              <Form.Control type="text" value={modalDetalles?.usuario || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row-1623">
            <label className="form-label-1624">Nombre del técnico:</label>
            <div className="form-control-wrapper-1625">
              <Form.Control type="text" value={modalDetalles?.tecnico || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row-1623">
            <label className="form-label-1624">Ambiente:</label>
            <div className="form-control-wrapper-1625">
              <Form.Control type="text" value={modalDetalles?.ambiente || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row-1623">
            <label className="form-label-1624">Estado:</label>
            <div className="form-control-wrapper-1625">
              <Form.Control type="text" value={modalDetalles?.estado || ''} readOnly />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer-1626">
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </div>
  );
};

export default Solielemento;