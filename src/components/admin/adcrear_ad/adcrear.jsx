import React, { useState } from 'react';
import { Button, Alert, Modal, Form, Dropdown,Pagination} from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import "./adcrear_ad.css";
import Footer from '../../Footer/Footer.jsx';
import HeaderCrear from '../header_crear/header_crear.jsx';

const DetallesUsuarioModal = ({ show, onHide, detalles, onEliminar }) => {
  if (!detalles) return null;

  return (
    <Modal show={show} onHide={onHide} className="custom-modal115" centered>
      <Modal.Header closeButton className="modal-header-verde116">
        <Modal.Title>
          <div className="izquierda103">
            <FaUserCircle className="icono107" size={24} style={{ marginRight: '10px' }} />
            <div className="estado108">
              <span>Información del Usuario</span>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body117">
        <div className="form-group-row110">
          <label className="form-label111">Nombre completo:</label>
          <div className="form-control-wrapper112">
            <Form.Control type="text" value={`${detalles.nombre || ''} ${detalles.apellido || ''}`} readOnly />
          </div>
        </div>
        <div className="form-group-row110">
          <label className="form-label111">Correo electrónico:</label>
          <div className="form-control-wrapper112">
            <Form.Control type="email" value={detalles.correo || ''} readOnly />
          </div>
        </div>
        <div className="form-group-row110">
          <label className="form-label111">Tipo de documento:</label>
          <div className="form-control-wrapper112">
            <Form.Control type="text" value={detalles.tipoDocumento || ''} readOnly />
          </div>
        </div>
        <div className="form-group-row110">
          <label className="form-label111">Número de documento:</label>
          <div className="form-control-wrapper112">
            <Form.Control type="text" value={detalles.id || ''} readOnly />
          </div>
        </div>
        <div className="form-group-row110">
          <label className="form-label111">Rol:</label>
          <div className="form-control-wrapper112">
            <Form.Control type="text" value={detalles.rol || ''} readOnly />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer118">
        <Button variant="danger" onClick={() => onEliminar(detalles.id)}>Eliminar</Button>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

const ConsultaItem = ({ usuario, onVerClick }) => (
  <div className='margin100'>
  <div className="ticket-item102">
    <div className="izquierda103">
      <div className="estado108">
        <span>{`${usuario.nombre} ${usuario.apellido} ${usuario.id}`}</span>
      </div>
    </div>
    <div className="derecha104">
      <button className="ver-boton109" onClick={() => onVerClick(usuario)}>Ver</button>
    </div>
  </div>
</div>

);

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
  const [emailError, setEmailError] = useState('');

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setFormData({ id: '', correo: '', nombre: '', apellido: '', rol: '', tipoDocumento: '' });
    setEmailError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'correo') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(value) ? '' : 'Ingrese un correo válido (ejemplo@dominio.com)');
    }
  };

  const handleSubmit = () => {
    const camposRequeridos = ['id', 'nombre', 'apellido', 'correo', 'rol', 'tipoDocumento'];
    const campoFaltante = camposRequeridos.find(campo => !formData[campo]);
    if (campoFaltante) {
      alert(`Por favor complete el campo: ${campoFaltante}`);
      return;
    }
    if (emailError) {
      alert(emailError);
      return;
    }
    setUsuarios(prev => [...prev, { ...formData }]);
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

  const handleEliminarUsuario = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
      handleCloseDetallesModal();
    }
  };

  return (
    <div className="lista-tickets101">
      <HeaderCrear />

      <Alert variant="success" className="alert301">
        <div className="d-flex justify-content-between align-items-center gap-3 w-100">
          <div className="d-flex align-items-center gap-3">
            <h5 className="mb-0">Consultas de Usuarios</h5>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Rol
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Administrador</Dropdown.Item>
                <Dropdown.Item>Instructor</Dropdown.Item>
                <Dropdown.Item>Técnico</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <Button className="añadir-boton322" onClick={handleShow}>Añadir Usuario</Button>
        </div>
      </Alert>

      {usuarios.map(usuario => (
        <ConsultaItem key={usuario.id} usuario={usuario} onVerClick={handleVerDetalles} />
      ))}
<Pagination className='pag101'>
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
      <Modal show={showModal} onHide={handleClose} className="custom-modal115" centered>
        <Modal.Header closeButton className="modal-header-verde116">
          <Modal.Title>Añadir Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body117">
          <div className="form-group-row110">
            <label className="form-label111" htmlFor="rol">Rol</label>
            <div className="form-control-wrapper112">
              <Form.Control as="select" id="rol" name="rol" value={formData.rol} onChange={handleChange}>
                <option value="">Seleccionar rol</option>
                <option value="instructor">Instructor</option>
                <option value="técnico">Técnico</option>
                <option value="administrador">Administrador</option>
              </Form.Control>
            </div>
          </div>

          <div className="form-group-row110 mt-2">
            <label className="form-label111" htmlFor="tipoDocumento">Tipo de Documento</label>
            <div className="form-control-wrapper112">
              <Form.Control as="select" id="tipoDocumento" name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange}>
                <option value="">Seleccionar tipo</option>
                <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                <option value="Tarjeta de Extranjería">Tarjeta de Extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
              </Form.Control>
            </div>
          </div>

          <div className="form-group-row110 mt-2">
            <label className="form-label111" htmlFor="id">Número de Documento</label>
            <div className="form-control-wrapper112">
              <Form.Control
                type="text"
                id="id"
                placeholder="Ingrese el número de documento"
                name="id"
                value={formData.id}
                onChange={handleChange}
                inputMode="numeric"
                pattern="\d*"
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
          </div>

          <div className="form-group-row110 mt-2">
            <label className="form-label111" htmlFor="nombre">Nombre</label>
            <div className="form-control-wrapper112">
              <Form.Control type="text" id="nombre" placeholder="Ingrese el nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group-row110 mt-2">
            <label className="form-label111" htmlFor="apellido">Apellido</label>
            <div className="form-control-wrapper112">
              <Form.Control type="text" id="apellido" placeholder="Ingrese el apellido" name="apellido" value={formData.apellido} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group-row110 mt-2">
            <label className="form-label111" htmlFor="correo">Correo electrónico</label>
            <div className="form-control-wrapper112">
              <Form.Control
                type="email"
                id="correo"
                placeholder="ejemplo@dominio.com"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                isInvalid={!!emailError}
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer118">
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="success" onClick={handleSubmit}>Añadir Usuario</Button>
        </Modal.Footer>
      </Modal>

      <DetallesUsuarioModal
        show={showDetallesModal}
        onHide={handleCloseDetallesModal}
        detalles={usuarioSeleccionado}
        onEliminar={handleEliminarUsuario}
      />

      <Footer />
    </div>
  );
};

const Admin = () => <Listaxd />;

export default Admin;