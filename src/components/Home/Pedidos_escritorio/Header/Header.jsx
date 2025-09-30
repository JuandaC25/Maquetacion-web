import { Navbar, Offcanvas, Button } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";


function Headerpedidosescritorio() {
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
              <i className="bi bi-list"></i>
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

          {/* Título */}
          <h1 className="main-title">Solicitar equipos</h1>

          {/* Iconos */}
          <div className="icons-container">
            <div className="buttons-wrapper">
              <div className="button-group" onClick={navigateToHome}>
                <i className="bi bi-house-door"></i>
                <span className="button-text">Home</span>
              </div>

              <div className="button-group" onClick={navigateToBlog}>
                <i className="bi bi-search"></i>
                <span className="button-text">Blog CEET</span>
              </div>

              <div className="button-group" onClick={handleShowProfile}>
                <i className="bi bi-person"></i>
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
            <button
              className="profile-close-button"
              onClick={handleCloseProfile}
            >
              ✖
            </button>

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

export default Headerpedidosescritorio;
