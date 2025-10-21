import React, { useState, useEffect } from 'react';
import { Button, Alert, Modal, Form, Dropdown, Pagination, InputGroup } from 'react-bootstrap';
import { FaUserCircle, FaSearch } from 'react-icons/fa';
import "./adcrear_ad.css"; 
import Footer from '../../Footer/Footer.jsx';
import HeaderCrear from '../header_crear/header_crear.jsx'; 
import { 
  obtenerUsuarios, 
  crearUsuario, 
  actualizarUsuario, 
  eliminarUsuario 
} from '../../../api/UsuariosApi.js';

const UserDetailsModal = ({ show, onHide, userDetails, onDesactivar, onActualizarUsuario }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState(null);

    useEffect(() => {
        if (userDetails) {
            setEditedUser({
                ...userDetails,
                rolEdit: userDetails.nomb_rol || '',
                estadoEdit: userDetails.nom_est === 1 ? 'activo' : 'inactivo'
            });
        }
        setEditMode(false);
    }, [userDetails]);

    if (!userDetails || !editedUser) return null;

    const handleEditChange = (field, value) => {
        setEditedUser(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveChanges = async () => {
        try {
            const usuarioActualizado = {
                id_Usu: userDetails.id_usuari,
                nom_us: editedUser.nom_usua,
                ape_us: editedUser.ape_usua,
                corre: editedUser.corre,
                password: userDetails.password,
                est_usu: editedUser.estadoEdit === 'activo' ? 1 : 0,
                id_role: mapearRolAId(editedUser.rolEdit)
            };
            console.log(' Guardando cambios:', usuarioActualizado);
            await onActualizarUsuario(userDetails.id_usuari, usuarioActualizado);
            setEditMode(false);
        } catch (error) {
            console.error('Error al guardar cambios:', error);
            alert('Error al guardar los cambios');
        }
    };

    const mapearRolAId = (rol) => {
        const rolesMap = {
            'instructor': 2,
            'técnico': 3,
            'administrador': 1
        };
        return rolesMap[rol] || userDetails.id_role;
    };

    return (
        <Modal show={show} onHide={onHide} centered dialogClassName="modern-modal-dialog-xd111">
            <Modal.Header closeButton className="modern-modal-header-xd112">
                <Modal.Title className="modern-modal-title-xd113">
                    <div className="modal-title-content-xd114">
                        <FaUserCircle className="user-icon-title-xd115" />
                        <span>
                            {editMode ? 'Editar Usuario' : 'Información del Usuario'}
                        </span>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modern-modal-body-xd114">
                <div className="detail-item-xd115">
                    <label className="detail-label-xd116">Nombre completo:</label>
                    <div className="detail-value-display-xd117">
                        <Form.Control 
                            type="text" 
                            value={`${userDetails.nom_usua || ''} ${userDetails.ape_usua || ''}`} 
                            readOnly 
                            className="modern-form-control-xd118" 
                        />
                    </div>
                </div>
                
                <div className="detail-item-xd115">
                    <label className="detail-label-xd116">Correo electrónico:</label>
                    <div className="detail-value-display-xd117">
                        <Form.Control 
                            type="email" 
                            value={userDetails.corre || ''} 
                            readOnly 
                            className="modern-form-control-xd118" 
                        />
                    </div>
                </div>
                
                <div className="detail-item-xd115">
                    <label className="detail-label-xd116">Tipo de documento:</label>
                    <div className="detail-value-display-xd117">
                        <Form.Control 
                            type="text" 
                            value={userDetails.tip_docu || ''} 
                            readOnly 
                            className="modern-form-control-xd118" 
                        />
                    </div>
                </div>
                
                <div className="detail-item-xd115">
                    <label className="detail-label-xd116">Número de documento:</label>
                    <div className="detail-value-display-xd117">
                        <Form.Control 
                            type="text" 
                            value={userDetails.num_docu || ''} 
                            readOnly 
                            className="modern-form-control-xd118" 
                        />
                    </div>
                </div>
                <div className="detail-item-xd115">
                    <label className="detail-label-xd116">Rol:</label>
                    <div className="detail-value-display-xd117">
                        {editMode ? (
                            <Form.Control
                                as="select"
                                value={editedUser.rolEdit}
                                onChange={(e) => handleEditChange('rolEdit', e.target.value)}
                                className="modern-form-control-xd118"
                            >
                                <option value="administrador">Administrador</option>
                                <option value="instructor">Instructor</option>
                                <option value="técnico">Técnico</option>
                            </Form.Control>
                        ) : (
                            <Form.Control 
                                type="text" 
                                value={userDetails.nomb_rol || ''} 
                                readOnly 
                                className="modern-form-control-xd118" 
                            />
                        )}
                    </div>
                </div>

                <div className="detail-item-xd115">
                    <label className="detail-label-xd116">Estado:</label>
                    <div className="detail-value-display-xd117">
                        {editMode ? (
                            <Form.Control
                                as="select"
                                value={editedUser.estadoEdit}
                                onChange={(e) => handleEditChange('estadoEdit', e.target.value)}
                                className={`modern-form-control-xd118 ${
                                    editedUser.estadoEdit === 'activo' ? 'text-success' : 'text-danger'
                                }`}
                            >
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </Form.Control>
                        ) : (
                            <Form.Control 
                                type="text" 
                                value={userDetails.nom_est === 1 ? 'Activo' : 'Inactivo'} 
                                readOnly 
                                className={`modern-form-control-xd118 ${
                                    userDetails.nom_est === 1 ? 'text-success' : 'text-danger'
                                }`}
                            />
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="modern-modal-footer-xd119">
                {editMode ? (
                    <>
                        <Button 
                            variant="secondary" 
                            onClick={() => setEditMode(false)}
                            className="modal-action-button-xd120"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            variant="success" 
                            onClick={handleSaveChanges}
                            className="modal-action-button-xd120"
                        >
                            Guardar Cambios
                        </Button>
                    </>
                ) : (
                    <>
                        <Button 
                            variant="primary" 
                            onClick={() => setEditMode(true)}
                            className="modal-action-button-xd120"
                        >
                            Editar
                        </Button>
                        <Button 
                            variant={userDetails.nom_est === 1 ? "warning" : "success"} 
                            onClick={() => onDesactivar(userDetails.id_usuari, userDetails.nom_est !== 1)}
                            className="modal-action-button-xd120"
                        >
                            {userDetails.nom_est === 1 ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button variant="secondary" onClick={onHide} className="modal-action-button-xd120 close-action-xd122">
                            Cerrar
                        </Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    );
};

const UserCard = ({ user, onVerClick }) => (
    <div className={`modern-equipment-card-xd101 ${user.nom_est !== 1 ? 'user-desactivado-xd139' : ''}`}>
        <div className="card-img-section-xd102">
            <FaUserCircle />
        </div>
        <div className="card-desc-xd103">
            <div className="card-header-xd104">
                <div className="card-title-xd105">{user.nomb_rol}</div>
                <div className="card-menu-xd106">
                    <div className="dot-xd107"></div>
                    <div className="dot-xd107"></div>
                    <div className="dot-xd107"></div>
                </div>
            </div>
            <p className="card-user-name-xd108">{`${user.nom_usua} ${user.ape_usua}`}</p>
            <p className="card-user-id-xd109">ID: {user.num_docu}</p>
            <div className="user-status-badge-xd141">
                <span className={`status-indicator-xd142 ${user.nom_est === 1 ? 'active-xd143' : 'inactive-xd144'}`}>
                    {user.nom_est === 1 ? 'Activo' : 'Inactivo'}
                </span>
            </div>
        </div>
        <button className="card-view-button-xd110" onClick={() => onVerClick(user)}>
            Ver Detalles
        </button>
    </div>
);

const UserManagementList = () => {
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUserData, setNewUserData] = useState({ 
        nom_su: '', 
        ape_su: '', 
        corre: '', 
        num_docu: '', 
        pasword: '',
        estad: 1,
        tip_docu: '', 
        id_role: '' 
    });
    const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [selectedRole, setSelectedRole] = useState('todos');
    const [selectedEstado, setSelectedEstado] = useState('activos');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            setLoading(true);
            const usuarios = await obtenerUsuarios();
            setUsers(usuarios);
            setError('');
        } catch (err) {
            setError(err.message);
            console.error('Error al cargar usuarios:', err);
        } finally {
            setLoading(false);
        }
    };

    const obtenerRolesUnicos = () => {
        const roles = users.map(user => user.nomb_rol).filter(Boolean);
        const rolesUnicos = [...new Set(roles)];
        return rolesUnicos.sort();
    };

    const handleShowAddUserModal = () => setShowAddUserModal(true);
    
    const handleCloseAddUserModal = () => {
        setShowAddUserModal(false);
        setNewUserData({ 
            nom_su: '', 
            ape_su: '', 
            corre: '', 
            num_docu: '', 
            pasword: '',
            estad: 1,
            tip_docu: '', 
            id_role: '' 
        });
        setEmailError('');
        setPasswordError('');
    };

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUserData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'corre') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setEmailError(emailRegex.test(value) ? '' : 'Ingrese un correo válido (ejemplo@dominio.com)');
        }
        if (name === 'pasword') {
            if (value.length > 0 && value.length < 6) {
                setPasswordError('La contraseña debe tener al menos 6 caracteres.');
            } else {
                setPasswordError('');
            }
        }
    };

    const mapearRolAId = (rol) => {
        const rolesMap = {
            'instructor': 1,
            'técnico': 2,
            'administrador': 3
        };
        return rolesMap[rol] || '';
    };

    const mapearTipoDocumentoAId = (tipoDoc) => {
        const tiposMap = {
            'Cédula de Ciudadanía': 1,
            'Tarjeta de Extranjería': 2,
            'Pasaporte': 3
        };
        return tiposMap[tipoDoc] || '';
    };

    const handleAddUserSubmit = async () => {
        try {
            const requiredFields = ['num_docu', 'nom_su', 'ape_su', 'corre','pasword'];
            const missingField = requiredFields.find(field => !newUserData[field]);
            if (missingField) {
                alert(`Por favor complete el campo: ${missingField}`);
                return;
            }
            
            if (emailError) {
                alert('Por favor corrija el error en el correo electrónico');
                return;
            }
            if(passwordError){
                alert('Por favor corrija el error en la contraseña');
                
            }

            if (!newUserData.tip_docu || !newUserData.id_role) {
                alert('Por favor seleccione el tipo de documento y el rol');
                return;
            }

            const usuarioParaCrear = {
                ...newUserData,
                num_docu: parseInt(newUserData.num_docu),
                tip_docu: mapearTipoDocumentoAId(newUserData.tip_docu),
                id_role: mapearRolAId(newUserData.id_role),
                estad: 1
            };

            console.log('Creando usuario con datos:', usuarioParaCrear);
            await crearUsuario(usuarioParaCrear);
            await cargarUsuarios();
            handleCloseAddUserModal();
            alert('Usuario creado exitosamente');
            
        } catch (err) {
            console.error('Error al crear usuario:', err);
            alert(`Error al crear usuario: ${err.message}`);
        }
    };

    const handleViewUserDetails = (user) => {
        setSelectedUser(user);
        setShowUserDetailsModal(true);
    };

    const handleCloseUserDetailsModal = () => {
        setShowUserDetailsModal(false);
        setSelectedUser(null);
    };

    const handleDesactivarUser = async (id, activar) => {
        try {
            const accion = activar ? 'activar' : 'desactivar';
            console.log('🔧 Iniciando acción:', { id, activar, accion, selectedUser });
            
            if (window.confirm(`¿Estás seguro de que deseas ${accion} este usuario?`)) {
                const usuarioActualizado = {
                    id_Usu: id,
                    nom_us: selectedUser.nom_usua,
                    ape_us: selectedUser.ape_usua,
                    corre: selectedUser.corre,
                    password: selectedUser.password ,
                    est_usu: activar ? 1 : 0
                };

                console.log('📤 Enviando actualización:', usuarioActualizado);
                
                await actualizarUsuario(id, usuarioActualizado);
                await cargarUsuarios();
                handleCloseUserDetailsModal();
                alert(`Usuario ${accion}do exitosamente`);
            }
        } catch (err) {
            console.error('❌ Error completo al actualizar usuario:', err);
            alert(`Error al ${activar ? 'activar' : 'desactivar'} usuario: ${err.message}`);
        }
    };

    const handleActualizarUsuario = async (id, usuarioActualizado) => {
        try {
            console.log('🔄 Actualizando usuario desde modal:', { id, usuarioActualizado });
            
            const resultado = await actualizarUsuario(id, usuarioActualizado);
            console.log('✅ Actualización exitosa desde modal:', resultado);
            
            await cargarUsuarios();

            handleCloseUserDetailsModal();
            
            alert('Usuario actualizado exitosamente');
        } catch (err) {
            console.error('❌ Error al actualizar usuario desde modal:', err);
            throw err;
        }
    };

    const handleRoleFilter = (role) => {
        setSelectedRole(role);
    };

    const handleEstadoFilter = (estado) => {
        setSelectedEstado(estado);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(user => {
        const roleMatch = selectedRole === 'todos' || user.nomb_rol === selectedRole;
        const estadoMatch = 
            selectedEstado === 'todos' || 
            (selectedEstado === 'activos' && user.nom_est === 1) || 
            (selectedEstado === 'desactivados' && user.nom_est !== 1);
        const idMatch = searchTerm === '' || user.num_docu.toString().includes(searchTerm);
        return roleMatch && estadoMatch && idMatch;
    });

    const rolesUnicos = obtenerRolesUnicos();

    if (loading) {
        return <div className="text-center p-4">Cargando usuarios...</div>;
    }

    return (
        <div className="inventory-app-container-xd125">
            <HeaderCrear />

            <div className="inventory-header-bar-xd126">
                <div className="header-bar-content-xd127">
                    <div className="header-left-section-xd128">
                        <h5 className="inventory-main-title-xd129">Gestión de Usuarios</h5>
                        {error && (
                            <Alert variant="danger" className="mb-3">
                                {error}
                            </Alert>
                        )}
                        <div className="filters-row-xd130">
                            <Dropdown className="category-filter-dropdown-xd131">
                                <Dropdown.Toggle variant="success" id="dropdown-role" className="dropdown-toggle">
                                    {selectedRole === 'todos' ? 'Todos los roles' : selectedRole} <span className="dropdown-arrow-xd132">&#9660;</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="category-dropdown-menu-xd133">
                                    <Dropdown.Item 
                                        onClick={() => handleRoleFilter('todos')}
                                        active={selectedRole === 'todos'}
                                    >
                                        Todos los roles
                                    </Dropdown.Item>
                                    {rolesUnicos.map((rol, index) => (
                                        <Dropdown.Item 
                                            key={index}
                                            onClick={() => handleRoleFilter(rol)}
                                            active={selectedRole === rol}
                                        >
                                            {rol}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>

                            <Dropdown className="category-filter-dropdown-xd131">
                                <Dropdown.Toggle variant="info" id="dropdown-estado" className="dropdown-toggle">
                                    {selectedEstado === 'todos' ? 'Todos' : 
                                     selectedEstado === 'activos' ? 'Activos' : 'Desactivados'} <span className="dropdown-arrow-xd132">&#9660;</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="category-dropdown-menu-xd133">
                                    <Dropdown.Item 
                                        onClick={() => handleEstadoFilter('todos')}
                                        active={selectedEstado === 'todos'}
                                    >
                                        Todos los usuarios
                                    </Dropdown.Item>
                                    <Dropdown.Item 
                                        onClick={() => handleEstadoFilter('activos')}
                                        active={selectedEstado === 'activos'}
                                    >
                                        Usuarios activos
                                    </Dropdown.Item>
                                    <Dropdown.Item 
                                        onClick={() => handleEstadoFilter('desactivados')}
                                        active={selectedEstado === 'desactivados'}
                                    >
                                        Usuarios desactivados
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            
                            <InputGroup className="search-bar-xd134">
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar por número de documento..."
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
                        <UserCard key={user.id_usuari} user={user} onVerClick={handleViewUserDetails} />
                    ))
                ) : (
                    <p className="empty-list-message-xd110">
                        {users.length === 0 ? 'No hay usuarios registrados.' : 'No hay usuarios con los criterios seleccionados.'}
                    </p>
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
                        <label className="detail-label-xd116" htmlFor="id_role">Rol</label>
                        <div className="detail-value-display-xd117">
                            <Form.Control 
                                as="select" 
                                id="id_role" 
                                name="id_role" 
                                value={newUserData.id_role} 
                                onChange={handleNewUserChange} 
                                className="modern-form-control-xd118"
                            >
                                <option value="">Seleccionar rol</option>
                                <option value="instructor">Instructor</option>
                                <option value="técnico">Técnico</option>
                                <option value="administrador">Administrador</option>
                            </Form.Control>
                        </div>
                    </div>

                    <div className="detail-item-xd115">
                        <label className="detail-label-xd116" htmlFor="tip_docu">Tipo de Documento</label>
                        <div className="detail-value-display-xd117">
                            <Form.Control 
                                as="select" 
                                id="tip_docu" 
                                name="tip_docu" 
                                value={newUserData.tip_docu} 
                                onChange={handleNewUserChange} 
                                className="modern-form-control-xd118"
                            >
                                <option value="">Seleccionar tipo</option>
                                <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                                <option value="Tarjeta de Extranjería">Tarjeta de Extranjería</option>
                                <option value="Pasaporte">Pasaporte</option>
                            </Form.Control>
                        </div>
                    </div>

                    <div className="detail-item-xd115">
                        <label className="detail-label-xd116" htmlFor="num_docu">Número de Documento</label>
                        <div className="detail-value-display-xd117">
                            <Form.Control
                                type="text"
                                id="num_docu"
                                placeholder="Ingrese el número de documento"
                                name="num_docu"
                                value={newUserData.num_docu}
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
                        <label className="detail-label-xd116" htmlFor="nom_su">Nombre</label>
                        <div className="detail-value-display-xd117">
                            <Form.Control 
                                type="text" 
                                id="nom_su" 
                                placeholder="Ingrese el nombre" 
                                name="nom_su" 
                                value={newUserData.nom_su} 
                                onChange={handleNewUserChange} 
                                className="modern-form-control-xd118" 
                            />
                        </div>
                    </div>

                    <div className="detail-item-xd115">
                        <label className="detail-label-xd116" htmlFor="ape_su">Apellido</label>
                        <div className="detail-value-display-xd117">
                            <Form.Control 
                                type="text" 
                                id="ape_su" 
                                placeholder="Ingrese el apellido" 
                                name="ape_su" 
                                value={newUserData.ape_su} 
                                onChange={handleNewUserChange} 
                                className="modern-form-control-xd118" 
                            />
                        </div>
                    </div>

                    <div className="detail-item-xd115">
                        <label className="detail-label-xd116" htmlFor="corre">Correo electrónico</label>
                        <div className="detail-value-display-xd117">
                            <Form.Control
                                type="email"
                                id="corre"
                                placeholder="ejemplo@dominio.com"
                                name="corre"
                                value={newUserData.corre}
                                onChange={handleNewUserChange}
                                isInvalid={!!emailError}
                                className="modern-form-control-xd118"
                            />
                            <Form.Control.Feedback type="invalid">
                                {emailError}
                            </Form.Control.Feedback>
                        </div>
                    </div>
                        <div className="detail-item-xd115">
                            <label className="detail-label-xd116" htmlFor="pasword">Contraseña</label>
                        <div className="detail-value-display-xd117">
                            <Form.Control
                                type="password"
                                id="pasword"
                                placeholder="Ingrese la contraseña"
                                name="pasword"
                                value={newUserData.pasword}
                                onChange={handleNewUserChange}
                                isInvalid={!!passwordError}
                                className="modern-form-control-xd118"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {passwordError}
                                </Form.Control.Feedback>
                            </div>
                        </div>
                </Modal.Body>
                <Modal.Footer className="modern-modal-footer-xd119">
                    <Button variant="secondary" onClick={handleCloseAddUserModal} className="modal-action-button-xd120 cancel-action-xd123">
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={handleAddUserSubmit} className="modal-action-button-xd120 add-action-xd124">
                        Añadir Usuario
                    </Button>
                </Modal.Footer>
            </Modal>

            <UserDetailsModal
                show={showUserDetailsModal}
                onHide={handleCloseUserDetailsModal}
                userDetails={selectedUser}
                onDesactivar={handleDesactivarUser}
                onActualizarUsuario={handleActualizarUsuario}
            />

            <Footer />
        </div>
    );
};

const Admin = () => <UserManagementList />;

export default Admin;