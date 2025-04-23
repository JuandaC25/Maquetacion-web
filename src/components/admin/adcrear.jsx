import React, { useState } from 'react';
import { Button, Alert, Modal, Form } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import "./estilos_admin.css";
import Footer from '../Footer/Footer';
import HeaderCrear from "./header_crear/header_crear.jsx";

const Ticketxd = ({ estado, ticket }) => {
  return (
    <div className="ticket-item">
      <div className="izquierda">
        <div className="icono">
          <span role="img" aria-label="computadora">🖥️</span>
        </div>
        <div className="estado">
          <span>{estado}</span>
        </div>
      </div>
      <div className="derecha">
        <div className="ticket">
          <span>{ticket}</span>
        </div>
        <div className="folder">
          <span role="img" aria-label="folder">📁</span>
        </div>
        <button className="ver-boton">Ver</button>
      </div>
    </div>
  );
};

const Listaxd = () => {
  const tickets = [
    { estado: 'En proceso', ticket: 'Primer ticket' },
    { estado: 'En proceso', ticket: 'Segundo ticket' },
    { estado: 'Pendiente', ticket: 'Tercer ticket' },
    { estado: 'Pendiente', ticket: 'Primer ticket' },
    { estado: 'En proceso', ticket: 'Primer ticket' },
    { estado: 'Pendiente', ticket: 'Segundo ticket' },
    { estado: 'Pendiente', ticket: 'Primer ticket' },
    { estado: 'En proceso', ticket: 'Segundo ticket' },
  ];

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    correo: '',
    nombre: '',
    apellido: ''
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Usuario añadido:', formData);
    handleClose();
  };

  return (
    <div className="lista-tickets">
      <Alert variant="success" className="d-flex justify-content-between align-items-center">
        <strong>TICKET</strong>
        <Button className="añadir-boton" onClick={handleShow}>Añadir Usuario</Button>
      </Alert>

      {tickets.map((t, i) => (
        <Ticketxd key={i} estado={t.estado} ticket={t.ticket} />
      ))}

      <Modal
        show={showModal}
        onHide={handleClose}
        className="custom-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Añadir Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="formulario-container">
            <Form.Group controlId="formIdUsuario">
              <Form.Label>ID del usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el ID"
                name="id"
                value={formData.id}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formCorreoUsuario">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese el correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formNombreUsuario">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </Form.Group>
            
            <Form.Group controlId="formApellidoUsuario">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
              />
            </Form.Group>

            
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            Añadir Usuario
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const Admin = () => {
  return (
    <div>
      <HeaderCrear/>
      <Listaxd />
      <Footer />
    </div>
  );
};

export default Admin;