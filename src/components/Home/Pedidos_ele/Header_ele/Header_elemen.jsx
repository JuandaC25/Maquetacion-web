import { Navbar, Container, Nav} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header_elemen.css';
import Desplegable from '../../../desplegable/desplegable';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';

function HeaderElemen() {
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleCloseMenu = () => setShowMenu(false);
  const handleShowMenu = () => setShowMenu(true);

  const handleCloseProfile = () => setShowProfile(false);
  const handleShowProfile = () => setShowProfile(true);

  const navigateToHome = () => {
    window.location.href = "http://localhost:5173/Login";
  };

  const navigateToBlog = () => {
    window.location.href =
      "https://electricidadelectronicaytelecomu.blogspot.com/";
  };

  return (
    <div className="header-container">
      <Navbar expand="xxxl" className="w-100">
        <div className="header-content">
          {/* Botón Menú */}
          <button className="menu-button" onClick={handleShowMenu}>
            <span className="menu-icon">
              <svg viewBox="0 0 175 80" width="40" height="40">
                <rect width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                <rect y="30" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                <rect y="60" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
              </svg>
            </span>
            <span className="menu-text">MENU</span>
          </button>

          {/* Menú lateral */}
          <Offcanvas show={showMenu} onHide={handleCloseMenu}>
            <Offcanvas.Header className="offcanvas-header" closeButton>
              <Offcanvas.Title className="offcanvas-title">
                <h1>Menú</h1>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="menu-cards">
              <Link to="/inicio" className="menu-card">
                <p className="card-title">
                  <i className="bi bi-ticket-detailed"></i>  Solicitar equipos
                </p>
                <p className="card-subtitle">Solicita los equipos que necesites</p>
              </Link>
              <Link to="/Informacion_equiposs" className="menu-card">
                <p className="card-title">
                  <i className="bi bi-person-plus"></i> Informacion de equipos
                </p>
                <p className="card-subtitle">Revisa el inventario y reporta los equipos defectuosos</p>
              </Link>
              <Link to="/espacios" className="menu-card">
                <p className="card-title">
                  <i className="bi bi-box-seam"></i> Solicitar espacios
                </p>
                <p className="card-subtitle">Solicita los espacios publicos que necesites</p>
              </Link>
              <Link to="/Historial_pedidos" className="menu-card">
                <p className="card-title">
                  <i className="bi bi-search"></i> Historial de pedidos
                </p>
                <p className="card-subtitle">Revisar tus pedidos realizados</p>
              </Link>
            </Offcanvas.Body>
          </Offcanvas>

          {/* Título */}
          <h1 className="main-title">Solicitar Elementos</h1>

          {/* Iconos */}
          <div className="icons-container">
            <div className="buttons-wrapper">
              <div className="button-group">
                <button className="icon-button" onClick={navigateToHome}>
                  <svg
                    className="icon-svg"
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M946.5 505..."></path>
                  </svg>
                </button>
                <span className="button-text">Home</span>
              </div>

              <div className="button-group">
                <button className="icon-button" onClick={navigateToBlog}>
                  <svg
                    className="icon-svg"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21 21l-6-6..."></path>
                  </svg>
                </button>
                <span className="button-text">Blog CEET</span>
              </div>

              <div className="button-group">
                <button className="icon-button" onClick={handleShowProfile}>
                  <svg
                    className="icon-svg"
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.5a5.5 5.5..."></path>
                  </svg>
                </button>
                <span className="button-text">Perfil</span>
              </div>
            </div>
          </div>
        </div>
      </Navbar>

      {/* Modal Perfil */}
      {showProfile && (
        <div className="profile-container">
          <div className="profile-frame">
            <span className="top-border"></span>
            <p className="time">12:00</p>
            <p className="date">Fri, 20 December</p>
            <button className="profile-close-button" onClick={handleCloseProfile}>
              ✖
            </button>

            <svg className="fingerprint"></svg>
            <svg className="camera"></svg>
            <svg className="phone"></svg>

            <span className="right-border-top"></span>
            <div className="profile-modal">
              <div className="profile-modal-header">
                <i className="bi bi-person-circle profile-icon"></i>
                <h3 className="profile-title">¡Hola, usuario!</h3>
              </div>

              <div className="profile-modal-footer">
                <div className="footer-content">
                  <h6>Example@gmail.com</h6>
                  <Button
                    className="profile-button"
                    onClick={handleCloseProfile}
                  >
                    Editar información
                  </Button>
                </div>
                <div className="footer-content">
                  <Button
                    className="profile-button"
                    href="http://localhost:5173/Login"
                    onClick={handleCloseProfile}
                  >
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
  export default HeaderElemen;