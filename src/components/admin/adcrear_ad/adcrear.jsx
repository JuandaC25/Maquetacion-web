import React, { useState, useEffect, useRef } from 'react';
import { Button, Alert, Modal, Form, Dropdown, InputGroup } from 'react-bootstrap';
import { FaUserCircle, FaSearch } from 'react-icons/fa';
import "./adcrear_ad.css"; 
import Footer from '../../Footer/Footer.jsx';
import HeaderCrear from '../headers/AdminHeader.jsx'; 
import { 
    obtenerUsuarios, 
    crearUsuario, 
    actualizarUsuario, 
    eliminarUsuario,
    uploadUsuariosMasivos
} from '../../../api/UsuariosApi.js';
import { downloadTemplate } from '../../../api/UsuariosApi.js';

const UserDetailsModal = ({ show, onHide, userDetails, onActualizarUsuario }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState(null);

    useEffect(() => {
        if (userDetails) {
            // Mapear el nombre del rol a su valor en minúsculas
            const rolActual = userDetails.nomb_rol ? userDetails.nomb_rol.toLowerCase() : '';
            setEditedUser({
                ...userDetails,
                estadoEdit: userDetails.nom_est === 1 ? 'activo' : 'inactivo',
                rolEdit: rolActual,
                password: '' // no devolvemos la contraseña desde el backend, permitir ingresar nueva contraseña
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

    const mapearRolAId = (rol) => {
        const rolesMap = {
            'instructor': 1,
            'técnico': 3,
            'administrador': 2
        };
        return rolesMap[rol] || null;
    };

    const handleSaveChanges = async () => {
        try {
            if (editedUser.corre) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(editedUser.corre)) {
                    alert('Ingrese un correo válido (ejemplo@dominio.com)');
                    return;
                }
            }

            const usuarioActualizado = {
                nom_us: editedUser.nom_usua,
                ape_us: editedUser.ape_usua,
                corre: editedUser.corre,
                est_usu: editedUser.estadoEdit === 'activo' ? 1 : 2
            };
            
            // Siempre agregar id_rl (incluso si no cambió)
            if (editedUser.rolEdit) {
                const idRol = mapearRolAId(editedUser.rolEdit);
                if (idRol) {
                    usuarioActualizado.id_rl = idRol;
                }
            }

            if (editedUser.password && editedUser.password.length > 0) {
                if (editedUser.password.length < 6) {
                    alert('La contraseña debe tener al menos 6 caracteres.');
                    return;
                }
                usuarioActualizado.password = editedUser.password;
            }
            
            console.log('Guardando cambios:', usuarioActualizado);
            console.log('ID del usuario:', userDetails.id_usuari);
            
            await onActualizarUsuario(userDetails.id_usuari, usuarioActualizado);
            setEditMode(false);
        } catch (error) {
            console.error('Error completo:', error);
            console.error('Mensaje de error:', error.message);
            alert('Error al guardar los cambios. Verifica la consola para más detalles.');
        }
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
                        {editMode ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <label className="detail-label-xd116" style={{ marginBottom: '6px' }}>Nombre</label>
                                    <Form.Control
                                        type="text"
                                        value={editedUser.nom_usua || ''}
                                        onChange={(e) => handleEditChange('nom_usua', e.target.value)}
                                        placeholder="Nombre"
                                        className="modern-form-control-xd118"
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <label className="detail-label-xd116" style={{ marginBottom: '6px' }}>Apellidos</label>
                                    <Form.Control
                                        type="text"
                                        value={editedUser.ape_usua || ''}
                                        onChange={(e) => handleEditChange('ape_usua', e.target.value)}
                                        placeholder="Apellidos"
                                        aria-label="Apellidos"
                                        title="Apellidos"
                                        className="modern-form-control-xd118"
                                    />
                                </div>
                            </div>
                        ) : (
                            <Form.Control 
                                type="text" 
                                value={`${userDetails.nom_usua || ''} ${userDetails.ape_usua || ''}`} 
                                readOnly 
                                className="modern-form-control-xd118" 
                            />
                        )}
                    </div>
                </div>
                    <div className="detail-item-xd115">
                        <label className="detail-label-xd116">Contraseña:</label>
                        <div className="detail-value-display-xd117">
                            {editMode ? (
                                <Form.Control
                                    type="password"
                                    value={editedUser.password || ''}
                                    onChange={(e) => handleEditChange('password', e.target.value)}
                                    placeholder="Ingrese nueva contraseña (dejar vacío para no cambiar)"
                                    className="modern-form-control-xd118"
                                    autoComplete="new-password"
                                />
                            ) : (
                                <>
                                    <Form.Control
                                        type="text"
                                        value={'********'}
                                        readOnly
                                        className="modern-form-control-xd118"
                                    />
                                    <Form.Text className="text-muted" style={{ display: 'block', marginTop: '6px' }}>
                                        La contraseña no se muestra por seguridad. Ingrese una nueva para cambiarla.
                                    </Form.Text>
                                </>
                            )}
                        </div>
                    </div>

                <div className="detail-item-xd115">
                    <label className="detail-label-xd116">Correo electrónico:</label>
                    <div className="detail-value-display-xd117">
                        {editMode ? (
                            <Form.Control
                                type="email"
                                value={editedUser.corre || ''}
                                onChange={(e) => handleEditChange('corre', e.target.value)}
                                placeholder="ejemplo@dominio.com"
                                className="modern-form-control-xd118"
                                autoComplete="off"
                            />
                        ) : (
                            <Form.Control 
                                type="email" 
                                value={userDetails.corre || ''} 
                                readOnly 
                                className="modern-form-control-xd118" 
                            />
                        )}
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
                                value={editedUser.rolEdit || ''}
                                onChange={(e) => handleEditChange('rolEdit', e.target.value)}
                                className="modern-form-control-xd118"
                            >
                                <option value="">Seleccionar rol</option>
                                <option value="instructor">Instructor</option>
                                <option value="técnico">Técnico</option>
                                <option value="administrador" disabled title="Solo puede existir un administrador en el sistema">Administrador (Bloqueado)</option>
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
        id_tip_docu: '', 
        id_role: '' 
    });
    const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [uploadFile, setUploadFile] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);
    const [downloadingTemplate, setDownloadingTemplate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [selectedRole, setSelectedRole] = useState('todos');
    const [selectedEstado, setSelectedEstado] = useState('activos');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

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

    const handleShowAddUserModal = () => {
        setNewUserData({ 
            nom_su: '', 
            ape_su: '', 
            corre: '', 
            num_docu: '', 
            pasword: '',
            estad: 1,
            id_tip_docu: '', 
            id_role: '' 
        });
        setEmailError('');
        setPasswordError('');
        setShowAddUserModal(true);
    };
    
    const handleCloseAddUserModal = () => {
        setShowAddUserModal(false);
        setNewUserData({ 
            nom_su: '', 
            ape_su: '', 
            corre: '', 
            num_docu: '', 
            pasword: '',
            estad: 1,
            id_tip_docu: '', 
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
            'técnico': 3,
            'administrador': 2
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

            if (!newUserData.id_tip_docu || !newUserData.id_role) {
                alert('Por favor seleccione el tipo de documento y el rol');
                return;
            }

            const usuarioParaCrear = {
                nom_su: newUserData.nom_su,
                ape_su: newUserData.ape_su,
                corre: newUserData.corre,
                pasword: newUserData.pasword,
                num_docu: parseInt(newUserData.num_docu),
                id_tip_docu: mapearTipoDocumentoAId(newUserData.id_tip_docu),
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

    const handleActualizarUsuario = async (id, usuarioActualizado) => {
        try {
            console.log('Actualizando usuario desde modal:', { id, usuarioActualizado });
            
            const resultado = await actualizarUsuario(id, usuarioActualizado);
            console.log('Actualización exitosa desde modal:', resultado);
            
            await cargarUsuarios();

            handleCloseUserDetailsModal();
            
            alert('Usuario actualizado exitosamente');
        } catch (err) {
            console.error('Error al actualizar usuario desde modal:', err);
            throw err;
        }
    };

    const handleRoleFilter = (role) => {
        setSelectedRole(role);
    };

    const handleFileChange = (e) => {
        const f = e.target.files && e.target.files[0];
        setUploadFile(f || null);
    };

    const handleUploadFile = async () => {
        if (!uploadFile) {
            alert('Seleccione un archivo .xlsx antes de subir');
            return;
        }
        try {
            const res = await uploadUsuariosMasivos(uploadFile);
            alert(`Subida completa. Creados: ${res.creados || 0}. Errores: ${ (res.errores || []).length }`);
            await cargarUsuarios();
            setUploadFile(null);
            const input = document.getElementById('excel-file-input'); if (input) input.value = '';
        } catch (err) {
            console.error('Error al subir archivo:', err);
            alert('Error al subir archivo: ' + (err.message || err));
        }
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
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedRole, selectedEstado, searchTerm, users]);

    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const rolesUnicos = obtenerRolesUnicos();

    if (loading) {
        return <div className="text-center p-4">Cargando usuarios...</div>;
    }

    return (
        <div className="inventory-app-container-xd125">
            <HeaderCrear title="Gestionar usuarios" />

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
                            <Dropdown>
                                <Dropdown.Toggle 
                                    variant="success" 
                                    id="dropdown-role" 
                                    className="dropdown-toggle-xd146"
                                >
                                    {selectedRole === 'todos' ? 'Todos los roles' : selectedRole}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-xd147">
                                    <Dropdown.Item 
                                        onClick={() => handleRoleFilter('todos')}
                                        active={selectedRole === 'todos'}
                                        className="dropdown-item-xd148"
                                    >
                                        Todos los roles
                                    </Dropdown.Item>
                                    {rolesUnicos.map((rol, index) => (
                                        <Dropdown.Item 
                                            key={index}
                                            onClick={() => handleRoleFilter(rol)}
                                            active={selectedRole === rol}
                                            className="dropdown-item-xd148"
                                        >
                                            {rol}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>

                            <Dropdown>
                                <Dropdown.Toggle 
                                    variant="success" 
                                    id="dropdown-estado" 
                                    className="dropdown-toggle-xd146"
                                >
                                    {selectedEstado === 'todos' ? 'Todos' : 
                                     selectedEstado === 'activos' ? 'Activos' : 'Desactivados'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-xd147">
                                    <Dropdown.Item 
                                        onClick={() => handleEstadoFilter('todos')}
                                        active={selectedEstado === 'todos'}
                                        className="dropdown-item-xd148"
                                    >
                                        Todos los usuarios
                                    </Dropdown.Item>
                                    <Dropdown.Item 
                                        onClick={() => handleEstadoFilter('activos')}
                                        active={selectedEstado === 'activos'}
                                        className="dropdown-item-xd148"
                                    >
                                        Usuarios activos
                                    </Dropdown.Item>
                                    <Dropdown.Item 
                                        onClick={() => handleEstadoFilter('desactivados')}
                                        active={selectedEstado === 'desactivados'}
                                        className="dropdown-item-xd148"
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
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Button className="add-new-equipment-button-xd135" onClick={handleShowAddUserModal}>
                            <span role="img" aria-label="añadir">➕</span> Añadir Usuario
                        </Button>
                        <Button variant="outline-primary" onClick={() => setShowUploadModal(true)} className="modal-action-button-xd120">
                            Importar usuarios (.xlsx)
                        </Button>
                    </div>
                </div>
            </div>

            <div className="equipment-list-grid-xd109">
                {paginatedUsers.length > 0 ? (
                    paginatedUsers.map(user => (
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
                        <input value="1" name="value-radio" id="value-1" type="radio" checked={currentPage === 1} onChange={() => setCurrentPage(1)} />
                        <span>1</span>
                    </label>
                    <label>
                        <input value="2" name="value-radio" id="value-2" type="radio" checked={currentPage === 2} onChange={() => setCurrentPage(2)} />
                        <span>2</span>
                    </label>
                    <label>
                        <input value="3" name="value-radio" id="value-3" type="radio" checked={currentPage === 3} onChange={() => setCurrentPage(3)} />
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
                                <option value="administrador" disabled title="Solo puede existir un administrador en el sistema">Administrador (Bloqueado)</option>
                            </Form.Control>
                        </div>
                    </div>

                    <div className="detail-item-xd115">
                        <label className="detail-label-xd116" htmlFor="id_tip_docu">Tipo de Documento</label>
                        <div className="detail-value-display-xd117">
                            <Form.Control 
                                as="select" 
                                id="id_tip_docu" 
                                name="id_tip_docu" 
                                value={newUserData.id_tip_docu} 
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
                        <label className="detail-label-xd116" htmlFor="nom_usu">Nombre</label>
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
                        <label className="detail-label-xd116" htmlFor="ape_usu">Apellido</label>
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
                                autoComplete="off"
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
                                autoComplete="new-password"
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

            {/* Upload Modal for .xlsx import */}
            <Modal show={showUploadModal} onHide={() => { setShowUploadModal(false); setUploadFile(null); }} centered dialogClassName="modern-modal-dialog-xd111">
                <Modal.Header closeButton className="modern-modal-header-xd112">
                    <Modal.Title className="modern-modal-title-xd113">Importar usuarios (.xlsx)</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modern-modal-body-xd114">
                    <div
                        className={`upload-modal-dropzone-xd150 ${dragActive ? 'drag-active-xd151' : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDragActive(false);
                            const files = e.dataTransfer && e.dataTransfer.files;
                            if (files && files.length > 0) {
                                const f = files[0];
                                setUploadFile(f);
                            }
                        }}
                    >
                        <div className="upload-modal-content-xd152">
                            <p className="mb-2">Arrastra aquí tu archivo .xlsx o</p>
                            <Button variant="outline-primary" onClick={() => fileInputRef.current && fileInputRef.current.click()} className="modal-action-button-xd120">Seleccionar archivo</Button>
                            <input
                                ref={fileInputRef}
                                id="excel-file-input"
                                type="file"
                                accept=".xlsx"
                                onChange={(e) => { handleFileChange(e); setShowUploadModal(true); }}
                                style={{ display: 'none' }}
                            />
                            {uploadFile && (
                                <div className="selected-file-info-xd153 mt-3">
                                    <strong>Archivo seleccionado:</strong>
                                    <div className="selected-file-name-xd154">{uploadFile.name}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="modern-modal-footer-xd119">
                    <Button variant="secondary" onClick={() => { setShowUploadModal(false); setUploadFile(null); }} className="modal-action-button-xd120 cancel-action-xd123">
                        Cancelar
                    </Button>
                    <Button
                        variant="outline-secondary"
                        onClick={async () => {
                            try {
                                setDownloadingTemplate(true);
                                const blob = await downloadTemplate();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'usuarios_plantilla.xlsx';
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                                window.URL.revokeObjectURL(url);
                            } catch (err) {
                                console.error(err);
                                alert('Error al descargar la plantilla: ' + (err.message || err));
                            } finally {
                                setDownloadingTemplate(false);
                            }
                        }}
                        disabled={downloadingTemplate}
                        className="modal-action-button-xd120 template-action-xd125"
                    >
                        {downloadingTemplate ? 'Descargando...' : 'Descargar plantilla'}
                    </Button>
                    <Button variant="success" onClick={async () => {
                        await handleUploadFile();
                        setShowUploadModal(false);
                    }} className="modal-action-button-xd120 add-action-xd124" disabled={!uploadFile}>
                        Subir archivo
                    </Button>
                </Modal.Footer>
            </Modal>

            <UserDetailsModal
                show={showUserDetailsModal}
                onHide={handleCloseUserDetailsModal}
                userDetails={selectedUser}
                onActualizarUsuario={handleActualizarUsuario}
            />

            <Footer />
        </div>
    );
};

const Admin = () => <UserManagementList />;

export default Admin;