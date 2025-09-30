import React, { useState } from 'react';
import { Navbar, Button, Offcanvas, Nav, Modal } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header.css';
import { Link } from 'react-router-dom';

function Header_ad() {
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
    window.location.href = "https://electricidadelectronicaytelecomu.blogspot.com/";
  };

  return (
    <div className='header-portatiles__container'> {/* Cambio aquí */}
      <Navbar expand="xxxl" className="w-100">
        <div className='header-portatiles__content'> {/* Cambio aquí */}

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

          <h1 className='header-portatiles__title-main'>Solicitud portátiles</h1> {/* Cambio aquí */}

          <div className='header-portatiles__icons-container'> {/* Cambio aquí */}
            <div className="header-portatiles__buttons-wrapper"> {/* Cambio aquí */}
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
      {showProfile && (
        <div className="profile-modal-container">
          <div className="profile-modal__frame">
            <span className="profile-modal__top-notch"></span>
            <p className="profile-modal__time">12:00</p>
            <p className="profile-modal__date">Fri, 20 December</p>
            <button className="profile-modal__close-button" onClick={handleCloseProfile}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <svg
              className="profile-modal__fingerprint"
              width="26px"
              height="26px"
              viewBox="0 0 0.488 0.488"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.409 0.114a0.196 0.196 0 0 1 0.027 0.122v0.024c0 0.026 0.007 0.051 0.019 0.073M0.146 0.212c0 -0.026 0.01 -0.051 0.028 -0.069a0.096 0.096 0 0 1 0.068 -0.029c0.026 0 0.05 0.01 0.068 0.029s0.028 0.043 0.028 0.069v0.024c0 0.053 0.017 0.104 0.048 0.146m-0.145 -0.17v0.049A0.343 0.343 0 0 0 0.303 0.455M0.146 0.309A0.442 0.442 0 0 0 0.189 0.455m-0.118 -0.049c-0.016 -0.055 -0.024 -0.113 -0.022 -0.17V0.212a0.195 0.195 0 0 1 0.026 -0.098 0.194 0.194 0 0 1 0.071 -0.072 0.192 0.192 0 0 1 0.194 0"
                stroke="#000000"
                strokeLinecap="square"
                strokeLinejoin="round"
                strokeWidth="0.0325"
              ></path>
            </svg>
            <svg
              className="profile-modal__camera"
              width="24"
              height="24"
              viewBox="0 0 0.72 0.72"
              version="1.2"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M.57.18H.522L.492.15A.1.1 0 0 0 .42.12H.3a.1.1 0 0 0-.072.03l-.03.03H.15a.09.09 0 0 0-.09.09v.24C.06.56.1.6.15.6h.42C.62.6.66.56.66.51V.27A.09.09 0 0 0 .57.18m-.21.3a.105.105 0 1 1 0-.21.105.105 0 0 1 0 .21M.54.339a.039.039 0 1 1 0-.078.039.039 0 0 1 0 .078"
              ></path>
            </svg>
            <svg
              className="profile-modal__phone-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              xmlSpace="preserve"
              width="24"
              height="24"
            >
              <path
                fill="none"
                stroke="#000"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                d="m10.2 6.375-3.075-3.15c-.375-.3-.9-.3-1.275 0l-2.325 2.4c-.525.45-.675 1.2-.45 1.8.6 1.725 2.175 5.175 5.25 8.25s6.525 4.575 8.25 5.25c.675.225 1.35.075 1.875-.375l2.325-2.325c.375-.375.375-.9 0-1.275L17.7 13.875c-.375-.375-.9-.375-1.275 0L14.55 15.75s-2.1-.9-3.75-2.475-2.475-3.75-2.475-3.75L10.2 7.65c.375-.375.375-.975 0-1.275z"
              ></path>
            </svg>
            <span className="profile-modal__right-button-sim"></span>
            <div className="profile-modal__content">
              <div className="profile-modal__content-header">
                <i className="bi bi-person-circle profile-modal__icon"></i>
                <h3 className="profile-modal__title">¡Hola, usuario!</h3>
              </div>

              <div className="profile-modal__content-footer">
                <div className="profile-modal__footer-item">
                  <h6>Example@gmail.com</h6>
                  <Button className="profile-modal__button" onClick={handleCloseProfile}>
                    Editar información
                  </Button>
                </div>
                <div className="profile-modal__footer-item">
                  <Button
                    className="profile-modal__button"
                    href="http://localhost:5173/Login"
                    onClick={handleCloseProfile}>
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

export default Header_ad;