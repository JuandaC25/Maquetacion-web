import React, { useState } from "react";
import { useAuth } from '../../../../auth/AuthContext';
import { Navbar, Container, Nav, Button, Offcanvas, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Header.css";

function Headerpedidosescritorio() {
    const [showMenu, setShowMenu] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const { user } = useAuth();
    const handleCloseMenu = () => setShowMenu(false);
    const handleShowMenu = () => setShowMenu(true);
    const handleCloseProfile = () => setShowProfile(false);
    const handleShowProfile = () => setShowProfile(true);
    const handleCloseEditModal = () => setShowEditModal(false);
    const handleShowEditModal = () => {
        setShowProfile(false);
        setShowEditModal(true);
    };

    const handleSaveChanges = () => {
        console.log('Guardando cambios en el perfil...');
        handleCloseEditModal();
        alert('Información actualizada con éxito.');
    }

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace("/Login");
    }

    const navigateToHome = () => {
        window.location.href = "http://localhost:5173/Login";
    };

    const navigateToBlog = () => {
        window.location.href = "https://electricidadelectronicaytelecomu.blogspot.com/";
    };

    return (
        <div className='header-pedidos__container'>
            <Navbar expand="xxxl" className="w-100">
                <div className='header-pedidos__content'>

                    {/* Botón de Menú (Offcanvas) */}
                    <button className="menu-button" onClick={handleShowMenu}>
                        <span className="menu-button__icon">
                            <svg viewBox="0 0 175 80" width="40" height="40">
                                <rect width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                                <rect y="30" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                                <rect y="60" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                            </svg>
                        </span>
                        <span className="menu-button__text">MENU</span>
                    </button>

                    {/* Menú lateral (Offcanvas) */}
                    <Offcanvas show={showMenu} onHide={handleCloseMenu}>
                        <Offcanvas.Header className="offcanvas-header" closeButton>
                            <Offcanvas.Title className="offcanvas-title">
                                <h1>Menú</h1>
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className="menu-cards">
                            <Link to="/inicio" className="menu-card">
                                <p className="card-title">
                                    <i className="bi bi-ticket-detailed"></i> Solicitar equipos
                                </p>
                                <p className="card-subtitle">
                                    Solicita los equipos que necesites
                                </p>
                            </Link>
                            <Link to="/Informacion_equiposs" className="menu-card">
                                <p className="card-title">
                                    <i className="bi bi-person-plus"></i> Información de equipos
                                </p>
                                <p className="card-subtitle">
                                    Revisa el inventario y reporta los equipos defectuosos
                                </p>
                            </Link>
                            <Link to="/espacios" className="menu-card">
                                <p className="card-title">
                                    <i className="bi bi-box-seam"></i> Solicitar espacios
                                </p>
                                <p className="card-subtitle">
                                    Solicita los espacios públicos que necesites
                                </p>
                            </Link>
                            <Link to="/Historial_pedidos" className="menu-card">
                                <p className="card-title">
                                    <i className="bi bi-search"></i> Historial de pedidos
                                </p>
                                <p className="card-subtitle">Revisar tus pedidos realizados</p>
                            </Link>
                        </Offcanvas.Body>
                    </Offcanvas>

                    <h1 className='header-pedidos__title-main'>Solicitud elementos</h1>
                    <div className='header-pedidos__icons-container'>
                        <div className="header-pedidos__buttons-wrapper">
                            <div className="icon-button-group">
                                <button className="icon-button" onClick={navigateToHome}>
                                    <svg
                                        className="icon-button__svg"
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth="0"
                                        viewBox="0 0 1024 1024"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"
                                        ></path>
                                    </svg>
                                </button>
                                <span className="icon-button-group__text">Home</span>
                            </div>

                            {/* Blog Button */}
                            <div className="icon-button-group">
                                <button className="icon-button" onClick={navigateToBlog}>
                                    <svg
                                        className="icon-button__svg"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        ></path>
                                    </svg>
                                </button>
                                <span className="icon-button-group__text">Blog CEET</span>
                            </div>

                            {/* Profile Button */}
                            <div className="icon-button-group">
                                <button className="icon-button" onClick={handleShowProfile}>
                                    <svg
                                        className="icon-button__svg"
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth="0"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"
                                        ></path>
                                    </svg>
                                </button>
                                <span className="icon-button-group__text">Perfil</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Navbar>
            
            {/* Modal de Perfil */}
            {showProfile && (
                <div className="profile-card">
                    <div className="profile-card-border-top"></div>
                    <button className="profile-card-close-btn" onClick={handleCloseProfile} style={{position:'absolute',top:'10px',right:'10px'}}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <div className="profile-card-img">
                        <i className="bi bi-person-circle" style={{fontSize:'2.2rem',color:'#fff',margin:'auto',display:'block',textAlign:'center'}}></i>
                    </div>
                    <span className="profile-card-title">
                        ¡Hola, {user?.nombre || user?.name || user?.username || user?.sub || 'usuario'}!
                    </span>
                    <span className="profile-card-email">
                        {user?.email || user?.correo || user?.username || user?.sub || 'Sin correo'}
                    </span>
                    <button className="profile-card-btn" style={{background:'#09b41a',color:'#fff'}} onClick={handleShowEditModal}>Editar información</button>
                    <button className="profile-card-btn" style={{background:'#09b41a',color:'#fff'}} onClick={handleLogout}>Cerrar sesión</button>
                </div>
            )}
            <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
                <Modal.Header closeButton className="edit-modal-header">
                    <Modal.Title className="edit-modal-title">
                        <i className="bi bi-person-gear"></i> Editar Perfil
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="edit-modal-body">
                    <Form>
                        <Form.Group className="mb-3" controlId="formEditName">
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Tu Nombre Actual" 
                                defaultValue="Nombre del Usuario"
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEditEmail">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="email@ejemplo.com" 
                                defaultValue="Example@gmail.com"
                                disabled 
                            />
                            <Form.Text className="text-muted">
                                El correo es tu identificador y no se puede modificar.
                            </Form.Text>
                        </Form.Group>

                        <hr className="my-3 edit-modal-divider" />
                        <h5 className="edit-modal-subtitle">Cambio de Contraseña</h5>
                        <Form.Group className="mb-3" controlId="formEditNewPassword">
                            <Form.Label>Nueva Contraseña (Opcional)</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Ingresa nueva contraseña" 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEditConfirmPassword">
                            <Form.Label>Confirmar Contraseña</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Confirma nueva contraseña" 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="edit-modal-footer">
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Headerpedidosescritorio;