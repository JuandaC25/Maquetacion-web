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
          <div className="form-group-row">
            <label className="form-label">Nombre completo:</label>
            <div className="form-control-wrapper">
              <Form.Control type="text" value={`${detalles.nombre || ''} ${detalles.apellido || ''}`} readOnly />
            </div>
          </div>
          <div className="form-group-row">
            <label className="form-label">Correo electrónico:</label>
            <div className="form-control-wrapper">
              <Form.Control type="email" value={detalles.correo || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row">
            <label className="form-label">Tipo de documento:</label>
            <div className="form-control-wrapper">
              <Form.Control type="text" value={detalles.tipoDocumento || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row">
            <label className="form-label">Número de documento:</label>
            <div className="form-control-wrapper">
              <Form.Control type="text" value={detalles.id || ''} readOnly />
            </div>
          </div>
          <div className="form-group-row">
            <label className="form-label">Rol:</label>
            <div className="form-control-wrapper">
              <Form.Control type="text" value={detalles.rol || ''} readOnly />
            </div>
          </div>
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
          <span>{`${usuario.nombre} ${usuario.apellido} ${usuario.id}`}</span>
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
    { id: '12345', correo: 'juan.perez@example.com', nombre: 'Juan', apellido: 'Pérez', rol: 'instructor', tipoDocumento: 'Cédula de Ciudadanía' },
    { id: '67890', correo: 'maria.gomez@example.com', nombre: 'María', apellido: 'Gómez', rol: 'técnico', tipoDocumento: 'Tarjeta de Extranjería' },
    { id: '13579', correo: 'carlos.lopez@example.com', nombre: 'Carlos', apellido: 'López', rol: 'instructor', tipoDocumento: 'Cédula de Ciudadanía' },
    { id: '24680', correo: 'ana.rodriguez@example.com', nombre: 'Ana', apellido: 'Rodríguez', rol: 'técnico', tipoDocumento: 'Tarjeta de Extranjería' },
    { id: '11223', correo: 'pedro.martinez@example.com', nombre: 'Pedro', apellido: 'Martínez', rol: 'instructor', tipoDocumento: 'Cédula de Ciudadanía' },
    { id: '44556', correo: 'laura.sanchez@example.com', nombre: 'Laura', apellido: 'Sánchez', rol: 'técnico', tipoDocumento: 'Tarjeta de Extranjería' },
    { id: '77889', correo: 'sofia.ramirez@example.com', nombre: 'Sofía', apellido: 'Ramírez', rol: 'instructor', tipoDocumento: 'Cédula de Ciudadanía' },
    { id: '99001', correo: 'miguel.torres@example.com', nombre: 'Miguel', apellido: 'Torres', rol: 'técnico', tipoDocumento: 'Tarjeta de Extranjería' },
  ];

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', correo: '', nombre: '', apellido: '', rol: '', tipoDocumento: '' });
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuarios, setUsuarios] = useState(usuariosData);

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setFormData({ id: '', correo: '', nombre: '', apellido: '', rol: '', tipoDocumento: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.id || !formData.nombre || !formData.apellido || !formData.correo || !formData.rol || !formData.tipoDocumento) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    if (usuarios.some(user => user.id === formData.id)) {
      alert("Ya existe un usuario con este ID. Por favor, use un ID diferente.");
      return;
    }

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

  const consultas = usuarios.map((usuario) => (
    <ConsultaItem key={usuario.id} usuario={usuario} onVerClick={handleVerDetalles} />
  ));

  return (
    <div className="lista-tickets">
      <HeaderAd />
      <Alert variant="success" className="d-flex justify-content-between align-items-center">
        <strong>CONSULTAS DE USUARIOS</strong>
        <Button className="añadir-boton" onClick={handleShow}>Añadir Usuario</Button>
      </Alert>

      {consultas}

      <Modal show={showModal} onHide={handleClose} className="custom-modal" centered>
        <Modal.Header closeButton className="modal-header-verde">
          <Modal.Title>Añadir Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="formulario-container">
            <div className="form-group-row">
              <label className="form-label" htmlFor="rol">Rol</label>
              <div className="form-control-wrapper">
                <Form.Control as="select" id="rol" name="rol" value={formData.rol} onChange={handleChange}>
                  <option value="">Seleccionar rol</option>
                  <option value="instructor">Instructor</option>
                  <option value="técnico">Técnico</option>
                  <option value="administrador">Administrador</option>
                </Form.Control>
              </div>
            </div>

            <div className="form-group-row mt-2">
              <label className="form-label" htmlFor="tipoDocumento">Tipo de Documento</label>
              <div className="form-control-wrapper">
                <Form.Control as="select" id="tipoDocumento" name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange}>
                  <option value="">Seleccionar tipo</option>
                  <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                  <option value="Tarjeta de Extranjería">Tarjeta de Extranjería</option>
                  <option value="Pasaporte">Pasaporte</option>
                </Form.Control>
              </div>
            </div>

            <div className="form-group-row mt-2">
              <label className="form-label" htmlFor="id">Número de Documento</label>
              <div className="form-control-wrapper">
                <Form.Control type="text" id="id" placeholder="Ingrese el número de documento" name="id" value={formData.id} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group-row mt-2">
              <label className="form-label" htmlFor="nombre">Nombre</label>
              <div className="form-control-wrapper">
                <Form.Control type="text" id="nombre" placeholder="Ingrese el nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group-row mt-2">
              <label className="form-label" htmlFor="apellido">Apellido</label>
              <div className="form-control-wrapper">
                <Form.Control type="text" id="apellido" placeholder="Ingrese el apellido" name="apellido" value={formData.apellido} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group-row mt-2">
              <label className="form-label" htmlFor="correo">Correo electrónico</label>
              <div className="form-control-wrapper">
                <Form.Control type="email" id="correo" placeholder="Ingrese el correo electrónico" name="correo" value={formData.correo} onChange={handleChange} />
              </div>
            </div>
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
      <Footer />
    </div>
  );
};

const Admin = () => {
  return (
    <div>
      <Listaxd />
    </div>
  );
};

export default Admin;