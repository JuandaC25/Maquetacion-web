import React, { useState } from 'react';
import { Button, Alert, Modal, Form, Dropdown, Pagination, InputGroup } from 'react-bootstrap';
import { FaUserCircle, FaSearch } from 'react-icons/fa';
import "./adcrear_ad.css"; 
import Footer from '../../Footer/Footer.jsx';
import HeaderCrear from '../header_crear/header_crear.jsx'; 

const UserDetailsModal = ({ show, onHide, userDetails, onEliminar }) => {
    if (!userDetails) return null;

    return (
        <Modal show={show} onHide={onHide} centered dialogClassName="modern-modal-dialog-xd111">
            <Modal.Header closeButton className="modern-modal-header-xd112">
                <Modal.Title className="modern-modal-title-xd113">
                    <div className="modal-title-content-xd114">
                        <FaUserCircle className="user-icon-title-xd115" />
                        <span>Información del Usuario</span>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modern-modal-body-xd114">
                <div className="detail-item-xd115">
                    <label className="detail-label-xd116">Nombre completo:</label>
                    <div className="detail-value-display-xd117">
                        <Form.Control type="text" value={`${userDetails.nombre || ''} ${userDetails.apellido || ''}`} readOnly className="modern-form-control-xd118" />
                    </div>
                </div>
                <div className="detail-item-xd115">
                    <label className="detail-label-xd116">Correo electrónico:</label>
                    <div className="detail-value-display-xd117">
                        <Form.Control type="email" value={userDetails.correo || ''} readOnly className="modern-form-control-xd118" />
                    </div>
                </div>
                <div className="detail-item-xd115">
                    <label className="detail-label-xd116">Tipo de documento:</label>
                    <div className="detail-value-display-xd117">
                        <Form.Control type="text" value={userDetails.tipoDocumento || ''} readOnly className="modern-form-control-xd118" />
                    </div>
                </div>
                <div className="detail-item-xd115">
                    <label className="detail-label-xd116">Número de documento:</label>
                    <div className="detail-value-display-xd117">
                        <Form.Control type="text" value={userDetails.id || ''} readOnly className="modern-form-control-xd118" />
                    </div>
                </div>
                <div className="detail-item-xd115">
                    <label className="detail-label-xd116">Rol:</label>
                    <div className="detail-value-display-xd117">
                        <Form.Control type="text" value={userDetails.rol || ''} readOnly className="modern-form-control-xd118" />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="modern-modal-footer-xd119">
                <Button variant="danger" onClick={() => onEliminar(userDetails.id)} className="modal-action-button-xd120 delete-action-xd121">Eliminar</Button>
                <Button variant="secondary" onClick={onHide} className="modal-action-button-xd120 close-action-xd122">Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

const UserCard = ({ user, onVerClick }) => (
    <div className="modern-equipment-card-xd101" onClick={() => onVerClick(user)}>
        <div className="card-content-xd102">
            <div className="icon-display-xd103">
                <FaUserCircle />
            </div>
            <div className="equipment-info-xd104">
                <span className="equipment-title-xd105">{`${user.nombre} ${user.apellido}`}</span>
                <span className="equipment-serie-xd107">{user.id}</span>
                <span className="equipment-category-xd106">{user.rol}</span>
            </div>
        </div>
        <button className="view-details-button-xd108" onClick={(e) => { e.stopPropagation(); onVerClick(user); }}>
            Ver
        </button>
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
        <div className="inventory-app-container-xd125">
            <HeaderCrear /> 

            <div className="inventory-header-bar-xd126">
                <div className="header-bar-content-xd127">
                    <div className="header-left-section-xd128">
                        <h5 className="inventory-main-title-xd129">Gestión de Usuarios</h5>
                        <div className="filters-row-xd130">
                            <Dropdown className="category-filter-dropdown-xd131">
                                <Dropdown.Toggle variant="success" id="dropdown-basic" className="dropdown-toggle">
                                    {selectedRole === 'todos' ? 'Todos los roles' : selectedRole} <span className="dropdown-arrow-xd132">&#9660;</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="category-dropdown-menu-xd133">
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
                            
                            <InputGroup className="search-bar-xd134">
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
                    <Button className="add-new-equipment-button-xd135" onClick={handleShowAddUserModal}>
                        <span role="img" aria-label="añadir">➕</span> Añadir Usuario
                    </Button>
                </div>
            </div>

            <div className="equipment-list-grid-xd109">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <UserCard key={user.id} user={user} onVerClick={handleViewUserDetails} />
                    ))
                ) : (
                    <p className="empty-list-message-xd110">No hay usuarios registrados con los criterios seleccionados.</p>
                )}
            </div>
            
            <div className="pagination-1215-xd136">
                <div className="pagination-inner-1216-xd137">
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
                    <span className="selection-1217-xd138"></span>
                </div>
            </div>

            <Modal show={showAddUserModal} onHide={handleCloseAddUserModal} centered dialogClassName="modern-modal-dialog-xd111">
                <Modal.Header closeButton className="modern-modal-header-xd112">
                    <Modal.Title className="modern-modal-title-xd113">Añadir Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modern-modal-body-xd114">
                    <div className="detail-item-xd115">
                        <label className="detail-label-xd116" htmlFor="rol">Rol</label>
                        <div className="detail-value-display-xd117">
                            <Form.Control as="select" id="rol" name="rol" value={newUserData.rol} onChange={handleNewUserChange} className="modern-form-control-xd118">
                                <option value="">Seleccionar rol</option>
                                <option value="instructor">Instructor</option>
                                <option value="técnico">Técnico</option>
                                <option value="administrador">Administrador</option>
                            </Form.Control>
                        </div>
                    </div>

                    <div className="detail-item-xd115">
                        <label className="detail-label-xd116" htmlFor="tipoDocumento">Tipo de Documento</label>
                        <div className="detail-value-display-xd117">
                            <Form.Control as="select" id="tipoDocumento" name="tipoDocumento" value={newUserData.tipoDocumento} onChange={handleNewUserChange} className="modern-form-control-xd118">
                                <option value="">Seleccionar tipo</option>
                                <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                                <option value="Tarjeta de Extranjería">Tarjeta de Extranjería</option>
                                <option value="Pasaporte">Pasaporte</option>
                            </Form.Control>
                        </div>
                    </div>

                    <div className="detail-item-xd115">
                        <label className="detail-label-xd116" htmlFor="id">Número de Documento</label>
                        <div className="detail-value-display-xd117">
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
                                className="modern-form-control-xd118"
                            />
                        </div>
                    </div>

                    <div className="detail-item-xd115">
                        <label className="detail-label-xd116" htmlFor="nombre">Nombre</label>
                        <div className="detail-value-display-xd117">
                            <Form.Control type="text" id="nombre" placeholder="Ingrese el nombre" name="nombre" value={newUserData.nombre} onChange={handleNewUserChange} className="modern-form-control-xd118" />
                        </div>
                    </div>

                    <div className="detail-item-xd115">
                        <label className="detail-label-xd116" htmlFor="apellido">Apellido</label>
                        <div className="detail-value-display-xd117">
                            <Form.Control type="text" id="apellido" placeholder="Ingrese el apellido" name="apellido" value={newUserData.apellido} onChange={handleNewUserChange} className="modern-form-control-xd118" />
                        </div>
                    </div>

                    <div className="detail-item-xd115">
                        <label className="detail-label-xd116" htmlFor="correo">Correo electrónico</label>
                        <div className="detail-value-display-xd117">
                            <Form.Control
                                type="email"
                                id="correo"
                                placeholder="ejemplo@dominio.com"
                                name="correo"
                                value={newUserData.correo}
                                onChange={handleNewUserChange}
                                isInvalid={!!emailError}
                                className="modern-form-control-xd118"
                            />
                            <Form.Control.Feedback type="invalid">
                                {emailError}
                            </Form.Control.Feedback>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="modern-modal-footer-xd119">
                    <Button variant="secondary" onClick={handleCloseAddUserModal} className="modal-action-button-xd120 cancel-action-xd123">Cancelar</Button>
                    <Button variant="success" onClick={handleAddUserSubmit} className="modal-action-button-xd120 add-action-xd124">Añadir Usuario</Button>
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
