import React, { useState } from 'react';
import { Button, Alert, Modal, Form, Dropdown, Pagination, InputGroup } from 'react-bootstrap';
import { FaUserCircle, FaSearch } from 'react-icons/fa';
import "./adcrear_ad.css"; 
import Footer from '../../Footer/Footer.jsx';
import HeaderCrear from '../header_crear/header_crear.jsx'; 

const UserDetailsModal = ({ show, onHide, userDetails, onEliminar }) => {
    if (!userDetails) return null;

    return (
        <Modal show={show} onHide={onHide} centered dialogClassName="modern-modal-dialog2001">
            <Modal.Header closeButton className="modern-modal-header2002">
                <Modal.Title className="modern-modal-title2003">
                    <div className="modal-title-content2004">
                        <FaUserCircle className="user-icon-title2005" />
                        <span>Información del Usuario</span>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modern-modal-body2006">
                <div className="detail-item2007">
                    <label className="detail-label2008">Nombre completo:</label>
                    <div className="detail-value-display2009">
                        <Form.Control type="text" value={`${userDetails.nombre || ''} ${userDetails.apellido || ''}`} readOnly className="modern-form-control2010" />
                    </div>
                </div>
                <div className="detail-item2011">
                    <label className="detail-label2012">Correo electrónico:</label>
                    <div className="detail-value-display2013">
                        <Form.Control type="email" value={userDetails.correo || ''} readOnly className="modern-form-control" />
                    </div>
                </div>
                <div className="detail-item2014">
                    <label className="detail-label2015">Tipo de documento:</label>
                    <div className="detail-value-display2016">
                        <Form.Control type="text" value={userDetails.tipoDocumento || ''} readOnly className="modern-form-control" />
                    </div>
                </div>
                <div className="detail-item2017">
                    <label className="detail-label2018">Número de documento:</label>
                    <div className="detail-value-display2019">
                        <Form.Control type="text" value={userDetails.id || ''} readOnly className="modern-form-control" />
                    </div>
                </div>
                <div className="detail-item2020">
                    <label className="detail-label2021">Rol:</label>
                    <div className="detail-value-display2022">
                        <Form.Control type="text" value={userDetails.rol || ''} readOnly className="modern-form-control" />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="modern-modal-footer2023">
                <Button variant="danger" onClick={() => onEliminar(userDetails.id)} className="modal-action-button delete-action">Eliminar</Button>
                <Button variant="secondary" onClick={onHide} className="modal-action-button close-action">Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

const UserCard = ({ user, onVerClick }) => (
    <div className="user-card" onClick={() => onVerClick(user)}>
        <div className="user-card-content">
            <div className="icon-display">
                <FaUserCircle />
            </div>
            <div className="user-info">
                <span className="user-name">{`${user.nombre} ${user.apellido}`}</span>
                <span className="user-id">{user.id}</span>
                <span className="user-role">{user.rol}</span>
            </div>
            <button className="view-details-button" onClick={(e) => { e.stopPropagation(); onVerClick(user); }}>
                Ver
            </button>
        </div>
    </div>
);

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
        { id: '11111', correo: 'admin.user@example.com', nombre: 'Admin', apellido: 'User', rol: 'administrador', tipoDocumento: 'Cédula de Ciudadanía' },
    ];

    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUserData, setNewUserData] = useState({ id: '', correo: '', nombre: '', apellido: '', rol: '', tipoDocumento: '' });
    const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState(usersData);
    const [emailError, setEmailError] = useState('');
    const [selectedRole, setSelectedRole] = useState('todos');
    const [searchTerm, setSearchTerm] = useState(''); 

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


    const handleRoleFilter = (role) => {
        setSelectedRole(role);
    };


    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };


    const filteredUsers = users.filter(user => {

        const roleMatch = selectedRole === 'todos' || user.rol === selectedRole;
        

        const idMatch = searchTerm === '' || user.id.includes(searchTerm);
        
        return roleMatch && idMatch;
    });

    return (
        <div className="user-management-container">
            <HeaderCrear /> 

            <div className="management-header-bar">
                <div className="header-bar-content">
                    <div className="header-left-section">
                        <h5 className="management-main-title">Gestión de Usuarios</h5>
                        <div className="filters-row">
                            <Dropdown className="role-filter-dropdown">
                                <Dropdown.Toggle variant="success" id="dropdown-basic" className="filter-dropdown-toggle">
                                    {selectedRole === 'todos' ? 'Todos los roles' : selectedRole} <span className="dropdown-arrow">&#9660;</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="filter-dropdown-menu">
                                    <Dropdown.Item 
                                        onClick={() => handleRoleFilter('todos')}
                                        active={selectedRole === 'todos'}
                                    >
                                        Todos los roles
                                    </Dropdown.Item>
                                    <Dropdown.Item 
                                        onClick={() => handleRoleFilter('administrador')}
                                        active={selectedRole === 'administrador'}
                                    >
                                        Administrador
                                    </Dropdown.Item>
                                    <Dropdown.Item 
                                        onClick={() => handleRoleFilter('instructor')}
                                        active={selectedRole === 'instructor'}
                                    >
                                        Instructor
                                    </Dropdown.Item>
                                    <Dropdown.Item 
                                        onClick={() => handleRoleFilter('técnico')}
                                        active={selectedRole === 'técnico'}
                                    >
                                        Técnico
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            
                            <InputGroup className="search-bar">
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar por ID de usuario..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </InputGroup>
                        </div>
                    </div>
                    <Button className="add-user-button" onClick={handleShowAddUserModal}>
                    <span role="img" aria-label="añadir">➕</span> Añadir Equipo
                    </Button>
                </div>
            </div>

            <div className="user-list-grid">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <UserCard key={user.id} user={user} onVerClick={handleViewUserDetails} />
                    ))
                ) : (
                    <p className="empty-list-message">No hay usuarios registrados con los criterios seleccionados.</p>
                )}
            </div>
              <div className="pagination">
        <div className="pagination-inner">
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
          <span className="selection"></span>
        </div>
      </div>

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

