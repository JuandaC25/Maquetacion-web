import React, { useState } from 'react';
import { Button, Alert, Dropdown, Modal, Form } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./estilos_admin.css";
import Footer from '../Footer/Footer';
import Header_Inv from "./header_inv/header_inv.jsx";

const DetallesEquipoModal = ({ show, onHide, detalles }) => {
  if (!detalles) {
    return null;
  }

  return (
    <Modal show={show} onHide={onHide} className="custom-modal" centered>
      <Modal.Header closeButton className="modal-header-verde"> 
        <Modal.Title>
          <div className="izquierda">
            <div className="icono" role="img" aria-label="información">ℹ️</div>
            <div className="estado">
              <span>Información del Equipo</span>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="formulario-container">
          <Form.Group controlId="formIdElemento">
            <Form.Label>Id del elemento</Form.Label>
            <Form.Control type="text" value={detalles.id || ''} readOnly />
          </Form.Group>

          <Form.Group controlId="formNombreElemento">
            <Form.Label>Nombre del elemento</Form.Label>
            <Form.Control type="text" value={detalles.nombre || ''} readOnly />
          </Form.Group>

          <Form.Group controlId="formCategoria">
            <Form.Label>Categoría</Form.Label>
            <Form.Control type="text" value={detalles.categoria || ''} readOnly />
          </Form.Group>

          <Form.Group controlId="formAccesorios">
            <Form.Label>Accesorios</Form.Label>
            <Form.Control type="text" value={detalles.accesorios || ''} readOnly />
          </Form.Group>

          <Form.Group controlId="formSerie">
            <Form.Label>Número de serie</Form.Label>
            <Form.Control type="text" value={detalles.serie || ''} readOnly />
          </Form.Group>

          <Form.Group controlId="formObservaciones">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control as="textarea" rows={3} value={detalles.observaciones || ''} readOnly />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ConsultaItem = ({ elemento, onVerClick }) => {
  return (
    <div className="ticket-item">
      <div className="izquierda">
        <div className="icono" role="img" aria-label="computadora">🖥️</div>
        <div className="estado">
          <span>Detalles del equipo</span>
        </div>
      </div>
      <div className="derecha">
        <div className="folder" role="img" aria-label="folder">📁</div>
        <button className="ver-boton" onClick={() => onVerClick(elemento)}>ver</button>
      </div>
    </div>
  );
};

const ListaConsultas = ({ elementos, onVerClick }) => {
  return (
    <div name="lista-inventario">
      {elementos.map((elemento, i) => (
        <ConsultaItem key={i} elemento={elemento} onVerClick={onVerClick} />
      ))}
    </div>
  );
};

const Admin = () => {
  const [showModalEquipo, setShowModalEquipo] = useState(false);
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [elementosInventario, setElementosInventario] = useState([
    { id: 'LAP001', nombre: 'Laptop Dell', categoria: 'Portátil', accesorios: 'Cargador, Mouse', serie: 'ABC12345', observaciones: 'Buen estado' },
    { id: 'DESK02', nombre: 'Escritorio HP', categoria: 'Equipos de escritorio', accesorios: 'Teclado, Mouse, Monitor', serie: 'XYZ67890', observaciones: 'Requiere limpieza' },
    { id: 'TV003', nombre: 'TV Samsung 40"', categoria: 'Televisores', accesorios: 'Control remoto', serie: 'QWE98765', observaciones: 'Imagen nítida' },
    { id: 'LAP002', nombre: 'Laptop Lenovo', categoria: 'Portátil', accesorios: 'Cargador', serie: 'LMN11223', observaciones: 'Batería con poca duración' },
    { id: 'DESK03', nombre: 'iMac', categoria: 'Equipos de escritorio', accesorios: 'Teclado, Mouse', serie: 'RST44556', observaciones: 'Rendimiento óptimo' },
    { id: 'TV004', nombre: 'Smart TV LG 55"', categoria: 'Televisores', accesorios: 'Control remoto, Base', serie: 'UVW77889', observaciones: 'Conexión Wi-Fi' },
    { id: 'LAP003', nombre: 'MacBook Air', categoria: 'Portátil', accesorios: 'Cargador', serie: 'FGH22334', observaciones: 'Ligero y rápido' },
  ]);

  const handleShowEquipo = () => setShowModalEquipo(true);
  const handleCloseEquipo = () => setShowModalEquipo(false);

  const handleVerDetalles = (elemento) => {
    setEquipoSeleccionado(elemento);
    setShowDetallesModal(true);
  };

  const handleCloseDetallesModal = () => {
    setShowDetallesModal(false);
    setEquipoSeleccionado(null);
  };

  return (
    <div>
      <Header_Inv />
      <Alert variant="success" className="d-flex justify-content-between align-items-center">
        <strong>INVENTARIO</strong>
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
        <Button className="añadir-boton" onClick={handleShowEquipo}>Añadir Equipo</Button>
      </Alert>
      <ListaConsultas elementos={elementosInventario} onVerClick={handleVerDetalles} />
      <Modal
        show={showModalEquipo}
        onHide={handleCloseEquipo}
        className="custom-modal"
        centered
      >
        <Modal.Header closeButton className="modal-header-verde"> 
          <Modal.Title>
            <div className="izquierda">
              <div className="icono" role="img" aria-label="computadora">🖥️</div>
              <div className="estado">
                <span>Añadir equipos</span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="formulario-container">
            <Form.Group controlId="formIdElemento">
              <Form.Label>Id del elemento</Form.Label>
              <Form.Control type="text" placeholder="Ingrese el ID" />
            </Form.Group>

            <Form.Group controlId="formNombreElemento">
              <Form.Label>Nombre del elemento</Form.Label>
              <Form.Control type="text" placeholder="Nombre" />
            </Form.Group>

            <Form.Group controlId="formCategoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Control as="select">
                <option>Portátiles</option>
                <option>Equipos de escritorio</option>
                <option>Televisores</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formAccesorios">
              <Form.Label>Accesorios</Form.Label>
              <Form.Control as="select">
                <option>Seleccionar</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formSerie">
              <Form.Label>Número de serie</Form.Label>
              <Form.Control type="text" placeholder="Número de serie" />
            </Form.Group>

            <Form.Group controlId="formObservaciones">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEquipo}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleCloseEquipo}>
            Añadir
          </Button>
        </Modal.Footer>
      </Modal>

      <DetallesEquipoModal
        show={showDetallesModal}
        onHide={handleCloseDetallesModal}
        detalles={equipoSeleccionado}
      />

      <Footer />
    </div>
  );
};

export default Admin;