import React, { useState } from 'react';
import { Button, Alert, Modal, Form } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import "./estilos_admin.css";
import Footer from '../Footer/Footer';
import HeaderAd from './header_admin/header_ad.jsx';

const DetallesUsuarioModal = ({ show, onHide, detalles, onEliminar }) => {
  if (!detalles) return null;

  return (
    <Modal show={show} onHide={onHide} className="custom-modal" centered>
      <Modal.Header closeButton className="modal-header-verde">
        <Modal.Title>
          <div className="izquierda">
            <FaUserCircle className="icono" size={24} style={{ marginRight: '10px' }} />
            <div className="estado">
              <span>Información del Usuario</span>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="formulario-container">
          <Form.Group controlId="formNombreCompleto">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control type="text" value={`${detalles.nombre || ''} ${detalles.apellido || ''}`} readOnly />
          </Form.Group>
          <Form.Group controlId="formCorreoElectronico">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control type="email" value={detalles.correo || ''} readOnly />
          </Form.Group>
          <Form.Group controlId="formTipoDocumento">
            <Form.Label>Tipo de documento</Form.Label>
            <Form.Control type="text" value={detalles.tipoDocumento || ''} readOnly />
          </Form.Group>
          <Form.Group controlId="formNumeroDocumento">
            <Form.Label>Número de documento</Form.Label>
            <Form.Control type="text" value={detalles.id || ''} readOnly />
          </Form.Group>
          <Form.Group controlId="formRol">
            <Form.Label>Rol</Form.Label>
            <Form.Control type="text" value={detalles.rol || ''} readOnly />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => onEliminar(detalles.id)}>Eliminar</Button>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

const ConsultaItem = ({ usuario, onVerClick }) => {
  return (
    <div className="ticket-item">
      <div className="izquierda">
        <div className="estado">
          <span>Nombre Apellido CC</span>
        </div>
      </div>
      <div className="derecha">
        <button className="ver-boton" onClick={() => onVerClick(usuario)}>Ver</button>
      </div>
    </div>
  );
};

const Listaxd = () => {
  const usuariosData = [
    { id: '12345', correo: 'usuario1@example.com', nombre: 'Juan', apellido: 'Pérez', rol: 'instructor', tipoDocumento: 'cedula_ciudadania' },
    { id: '67890', correo: 'usuario2@example.com', nombre: 'María', apellido: 'Gómez', rol: 'tecnico', tipoDocumento: 'extranjeria' },
    { id: '13579', correo: 'usuario3@example.com', nombre: 'Carlos', apellido: 'López', rol: 'instructor', tipoDocumento: 'cedula_ciudadania' },
    { id: '24680', correo: 'usuario4@example.com', nombre: 'Ana', apellido: 'Rodríguez', rol: 'tecnico', tipoDocumento: 'extranjeria' },
    { id: '11223', correo: 'usuario5@example.com', nombre: 'Pedro', apellido: 'Martínez', rol: 'instructor', tipoDocumento: 'cedula_ciudadania' },
    { id: '44556', correo: 'usuario6@example.com', nombre: 'Laura', apellido: 'Sánchez', rol: 'tecnico', tipoDocumento: 'extranjeria' },
    { id: '77889', correo: 'usuario7@example.com', nombre: 'Sofía', apellido: 'Ramírez', rol: 'instructor', tipoDocumento: 'cedula_ciudadania' },
    { id: '99001', correo: 'usuario8@example.com', nombre: 'Miguel', apellido: 'Torres', rol: 'tecnico', tipoDocumento: 'extranjeria' },
  ];

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', correo: '', nombre: '', apellido: '', rol: '', tipoDocumento: '' });
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuarios, setUsuarios] = useState(usuariosData);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const nuevoUsuario = { ...formData };
    setUsuarios(prevUsuarios => [...prevUsuarios, nuevoUsuario]);
    handleClose();
  };

  const handleVerDetalles = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setShowDetallesModal(true);
  };

  const handleCloseDetallesModal = () => {
    setShowDetallesModal(false);
    setUsuarioSeleccionado(null);
  };

  const handleEliminarEquipo = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (confirmacion) {
      const nuevosUsuarios = usuarios.filter(usuario => usuario.id !== id);
      setUsuarios(nuevosUsuarios);
      setShowDetallesModal(false);
    }
  };

  const consultas = usuarios.map((usuario, index) => (
    <ConsultaItem key={index} usuario={usuario} onVerClick={handleVerDetalles} />
  ));

  return (
    <div className="lista-tickets">
      <Alert variant="success" className="d-flex justify-content-between align-items-center">
        <strong>CONSULTAS</strong>
        <Button className="añadir-boton" onClick={handleShow}>Añadir Usuario</Button>
      </Alert>

      {consultas}

      <Modal show={showModal} onHide={handleClose} className="custom-modal" centered>
        <Modal.Header closeButton className="modal-header-verde">
          <Modal.Title>Añadir Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="formulario-container">
            <Form.Group controlId="formRolUsuario">
              <Form.Label>Rol</Form.Label>
              <Form.Control as="select" name="rol" value={formData.rol} onChange={handleChange}>
                <option value="">Seleccionar rol</option>
                <option value="tecnico">Técnico</option>
                <option value="instructor">Instructor</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formTipoDocumentoUsuario">
              <Form.Label>Tipo de Documento</Form.Label>
              <Form.Control as="select" name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange}>
                <option value="">Seleccionar tipo</option>
                <option value="extranjeria">Extranjería</option>
                <option value="cedula_ciudadania">Cédula de Ciudadanía</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formIdUsuario">
              <Form.Label>ID del usuario</Form.Label>
              <Form.Control type="text" placeholder="Ingrese el ID" name="id" value={formData.id} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="formCorreoUsuario">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control type="email" placeholder="Ingrese el correo" name="correo" value={formData.correo} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="formNombreUsuario">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Ingrese el nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="formApellidoUsuario">
              <Form.Label>Apellido</Form.Label>
              <Form.Control type="text" placeholder="Ingrese el apellido" name="apellido" value={formData.apellido} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="success" onClick={handleSubmit}>Añadir Usuario</Button>
        </Modal.Footer>
      </Modal>

      <DetallesUsuarioModal
        show={showDetallesModal}
        onHide={handleCloseDetallesModal}
        detalles={usuarioSeleccionado}
        onEliminar={handleEliminarEquipo}
      />
    </div>
  );
};

const Admin = () => {
  return (
    <div>
      <HeaderAd />
      <Listaxd />
      <Footer />
    </div>
  );
};

export default Admin;