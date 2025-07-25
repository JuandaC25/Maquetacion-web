import React, { useState } from 'react';
import { Button, Alert, Modal, Form, Dropdown, Pagination } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import "./adcrear_ad.css"; // This CSS file will be updated below
import Footer from '../../Footer/Footer.jsx';
import HeaderCrear from '../header_crear/header_crear.jsx'; // Assuming this component exists

// --- DetallesUsuarioModal Component ---
const UserDetailsModal = ({ show, onHide, userDetails, onEliminar }) => {
    if (!userDetails) return null;

    return (
        <Modal show={show} onHide={onHide} centered dialogClassName="modern-modal-dialog">
            <Modal.Header closeButton className="modern-modal-header">
                <Modal.Title className="modern-modal-title">
                    <div className="modal-title-content">
                        <FaUserCircle className="user-icon-title" />
                        <span>Información del Usuario</span>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modern-modal-body">
                <div className="detail-item">
                    <label className="detail-label">Nombre completo:</label>
                    <div className="detail-value-display">
                        <Form.Control type="text" value={`${userDetails.nombre || ''} ${userDetails.apellido || ''}`} readOnly className="modern-form-control" />
                    </div>
                </div>
                <div className="detail-item">
                    <label className="detail-label">Correo electrónico:</label>
                    <div className="detail-value-display">
                        <Form.Control type="email" value={userDetails.correo || ''} readOnly className="modern-form-control" />
                    </div>
                </div>
                <div className="detail-item">
                    <label className="detail-label">Tipo de documento:</label>
                    <div className="detail-value-display">
                        <Form.Control type="text" value={userDetails.tipoDocumento || ''} readOnly className="modern-form-control" />
                    </div>
                </div>
                <div className="detail-item">
                    <label className="detail-label">Número de documento:</label>
                    <div className="detail-value-display">
                        <Form.Control type="text" value={userDetails.id || ''} readOnly className="modern-form-control" />
                    </div>
                </div>
                <div className="detail-item">
                    <label className="detail-label">Rol:</label>
                    <div className="detail-value-display">
                        <Form.Control type="text" value={userDetails.rol || ''} readOnly className="modern-form-control" />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="modern-modal-footer">
                <Button variant="danger" onClick={() => onEliminar(userDetails.id)} className="modal-action-button delete-action">Eliminar</Button>
                <Button variant="secondary" onClick={onHide} className="modal-action-button close-action">Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

// --- UserCard Component ---
const UserCard = ({ user, onVerClick }) => (
    <div className="user-card" onClick={() => onVerClick(user)}>
        <div className="user-card-content">
            <div className="icon-display">
                <FaUserCircle />
            </div>
            <div className="user-info">
                <span className="user-name">{`${user.nombre} ${user.apellido}`}</span>
                <span className="user-id">{user.id}</span>
            </div>
            <button className="view-details-button" onClick={(e) => { e.stopPropagation(); onVerClick(user); }}>
                Ver
            </button>
        </div>
    </div>
);

// --- UserManagementList Component (previously Listaxd) ---
const UserManagementList = () => {
    const usersData = [
        { id: '12345', correo: 'juan.perez@example.com', nombre: 'Juan', apellido: 'Pérez', rol: 'instructor', tipoDocumento: 'Cédula de Ciudadanía' },
        { id: '67890', correo: 'maria.gomez@example.com', nombre: 'María', apellido: 'Gómez', rol: 'técnico', tipoDocumento: 'Tarjeta de Extranjería' },
        { id: '13579', correo: 'carlos.lopez@example.com', nombre: 'Carlos', apellido: 'López', rol: 'instructor', tipoDocumento: 'Cédula de Ciudadanía' },
        { id: '24680', correo: 'ana.rodriguez@example.com', nombre: 'Ana', apellido: 'Rodríguez', rol: 'técnico', tipoDocumento: 'Tarjeta de Extranjería' },
        { id: '11223', correo: 'pedro.martinez@example.com', nombre: 'Pedro', apellido: 'Martínez', rol: 'instructor', tipoDocumento: 'Cédula de Ciudadanía' },
        { id: '44556', correo: 'laura.sanchez@example.com', nombre: 'Laura', apellido: 'Sánchez', rol: 'técnico', tipoDocumento: 'Tarjeta de Extranjería' },
        { id: '77889', correo: 'sofia.ramirez@example.com', nombre: 'Sofía', apellido: 'Ramírez', rol: 'instructor', tipoDocumento: 'Cédula de Ciudadanía' },
        { id: '99001', correo: 'miguel.torres@example.com', nombre: 'Miguel', apellido: 'Torres', rol: 'técnico', tipoDocumento: 'Tarjeta de Extranjería' },
    ];

    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUserData, setNewUserData] = useState({ id: '', correo: '', nombre: '', apellido: '', rol: '', tipoDocumento: '' });
    const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState(usersData);
    const [emailError, setEmailError] = useState('');

    const handleShowAddUserModal = () => setShowAddUserModal(true);
    const handleCloseAddUserModal = () => {
        setShowAddUserModal(false);
        setNewUserData({ id: '', correo: '', nombre: '', apellido: '', rol: '', tipoDocumento: '' });
        setEmailError('');
    };

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUserData(prev => ({ ...prev, [name]: value }));
        if (name === 'correo') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setEmailError(emailRegex.test(value) ? '' : 'Ingrese un correo válido (ejemplo@dominio.com)');
        }
    };

    const handleAddUserSubmit = () => {
        const requiredFields = ['id', 'nombre', 'apellido', 'correo', 'rol', 'tipoDocumento'];
        const missingField = requiredFields.find(field => !newUserData[field]);
        if (missingField) {
            alert(`Por favor complete el campo: ${missingField}`);
            return;
        }
        if (emailError) {
            alert(emailError);
            return;
        }
        setUsers(prev => [...prev, { ...newUserData }]);
        handleCloseAddUserModal();
    };

    const handleViewUserDetails = (user) => {
        setSelectedUser(user);
        setShowUserDetailsModal(true);
    };

    const handleCloseUserDetailsModal = () => {
        setShowUserDetailsModal(false);
        setSelectedUser(null);
    };

    const handleDeleteUser = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            setUsers(prev => prev.filter(user => user.id !== id));
            handleCloseUserDetailsModal();
        }
    };

    return (
        <div className="user-management-container">
            <HeaderCrear /> {/* This component is assumed */}

            <div className="management-header-bar">
                <div className="header-bar-content">
                    <div className="header-left-section">
                        <h5 className="management-main-title">Gestión de Usuarios</h5>
                        <Dropdown className="role-filter-dropdown">
                            <Dropdown.Toggle variant="success" id="dropdown-basic" className="filter-dropdown-toggle">
                                Rol <span className="dropdown-arrow">&#9660;</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="filter-dropdown-menu">
                                <Dropdown.Item href="#/action-1">Administrador</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Instructor</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Técnico</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <Button className="add-user-button" onClick={handleShowAddUserModal}>
                        Añadir Usuario
                    </Button>
                </div>
            </div>

            <div className="user-list-grid">
                {users.length > 0 ? (
                    users.map(user => (
                        <UserCard key={user.id} user={user} onVerClick={handleViewUserDetails} />
                    ))
                ) : (
                    <p className="empty-list-message">No hay usuarios registrados.</p>
                )}
            </div>

            <Pagination className='pagination-controls-container'>
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

            {/* Add New User Modal */}
            <Modal show={showAddUserModal} onHide={handleCloseAddUserModal} centered dialogClassName="modern-modal-dialog">
                <Modal.Header closeButton className="modern-modal-header">
                    <Modal.Title className="modern-modal-title">Añadir Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modern-modal-body">
                    <div className="detail-item">
                        <label className="detail-label" htmlFor="rol">Rol</label>
                        <div className="detail-value-display">
                            <Form.Control as="select" id="rol" name="rol" value={newUserData.rol} onChange={handleNewUserChange} className="modern-form-control">
                                <option value="">Seleccionar rol</option>
                                <option value="instructor">Instructor</option>
                                <option value="técnico">Técnico</option>
                                <option value="administrador">Administrador</option>
                            </Form.Control>
                        </div>
                    </div>

                    <div className="detail-item">
                        <label className="detail-label" htmlFor="tipoDocumento">Tipo de Documento</label>
                        <div className="detail-value-display">
                            <Form.Control as="select" id="tipoDocumento" name="tipoDocumento" value={newUserData.tipoDocumento} onChange={handleNewUserChange} className="modern-form-control">
                                <option value="">Seleccionar tipo</option>
                                <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                                <option value="Tarjeta de Extranjería">Tarjeta de Extranjería</option>
                                <option value="Pasaporte">Pasaporte</option>
                            </Form.Control>
                        </div>
                    </div>

                    <div className="detail-item">
                        <label className="detail-label" htmlFor="id">Número de Documento</label>
                        <div className="detail-value-display">
                            <Form.Control
                                type="text"
                                id="id"
                                placeholder="Ingrese el número de documento"
                                name="id"
                                value={newUserData.id}
                                onChange={handleNewUserChange}
                                inputMode="numeric"
                                pattern="\d*"
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                className="modern-form-control"
                            />
                        </div>
                    </div>

                    <div className="detail-item">
                        <label className="detail-label" htmlFor="nombre">Nombre</label>
                        <div className="detail-value-display">
                            <Form.Control type="text" id="nombre" placeholder="Ingrese el nombre" name="nombre" value={newUserData.nombre} onChange={handleNewUserChange} className="modern-form-control" />
                        </div>
                    </div>

                    <div className="detail-item">
                        <label className="detail-label" htmlFor="apellido">Apellido</label>
                        <div className="detail-value-display">
                            <Form.Control type="text" id="apellido" placeholder="Ingrese el apellido" name="apellido" value={newUserData.apellido} onChange={handleNewUserChange} className="modern-form-control" />
                        </div>
                    </div>

                    <div className="detail-item">
                        <label className="detail-label" htmlFor="correo">Correo electrónico</label>
                        <div className="detail-value-display">
                            <Form.Control
                                type="email"
                                id="correo"
                                placeholder="ejemplo@dominio.com"
                                name="correo"
                                value={newUserData.correo}
                                onChange={handleNewUserChange}
                                isInvalid={!!emailError}
                                className="modern-form-control"
                            />
                            <Form.Control.Feedback type="invalid">
                                {emailError}
                            </Form.Control.Feedback>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="modern-modal-footer">
                    <Button variant="secondary" onClick={handleCloseAddUserModal} className="modal-action-button cancel-action">Cancelar</Button>
                    <Button variant="success" onClick={handleAddUserSubmit} className="modal-action-button add-action">Añadir Usuario</Button>
                </Modal.Footer>
            </Modal>

            {/* User Details Modal */}
            <UserDetailsModal
                show={showUserDetailsModal}
                onHide={handleCloseUserDetailsModal}
                userDetails={selectedUser}
                onEliminar={handleDeleteUser}
            />

            <Footer />
        </div>
    );
};

const Admin = () => <UserManagementList />;

export default Admin;