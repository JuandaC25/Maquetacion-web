import React, { useState } from 'react';
import { Navbar, Button, Offcanvas, Nav } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './header_ad.css';
import Desplegable from '../../desplegable/desplegable';
import { Link } from 'react-router-dom';

function Header_ad() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigateToHome = () => {
    window.location.href = "http://localhost:5173/Login";
  };

  const navigateToBlog = () => {
    window.location.href = "https://electricidadelectronicaytelecomu.blogspot.com/";
  };
  return (
    <div className='container-1301'> 
      <Navbar expand="xxxl" className="w-100">
        <div className='content-1302'>

          <button className="button-1303" onClick={handleShow}>
            <span className="icon-1304">
                <svg viewBox="0 0 175 80" width="40" height="40">
                    <rect width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                    <rect y="30" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                    <rect y="60" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                </svg>
            </span>
            <span className="text-1305">MENU</span>
          </button>

          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header className='header-1306' closeButton>
              <Offcanvas.Title className='title-1307'>
                <h1>Menú</h1>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="cards-1308">
              <Link to="/Admin" className="card-1309">
                <p className="text-primary-1310"><i className="bi bi-ticket-detailed"></i> Estado del ticket</p>
                <p className="text-secondary-1311">Ver estado de tickets</p>
              </Link>
              <Link to="/Adcrear" className="card-1309">
                <p className="text-primary-1310"><i className="bi bi-person-plus"></i> Gestionar usuarios</p>
                <p className="text-secondary-1311">Administrar usuarios</p>
              </Link>
              <Link to="/Inventario" className="card-1309">
                <p className="text-primary-1310"><i className="bi bi-box-seam"></i> Consultar inventario</p>
                <p className="text-secondary-1311">Ver elementos disponibles</p>
              </Link>
              <Link to="/Solielemento" className="card-1309">
                <p className="text-primary-1310"><i className="bi bi-search"></i> Solicitudes de elementos</p>
                <p className="text-secondary-1311">Revisar solicitudes</p>
              </Link>
              <Link to="/Soliespacio" className="card-1309">
                <p className="text-primary-1310"><i className="bi bi-search"></i> Solicitudes espacios</p>
                <p className="text-secondary-1311">Revisar reservas</p>
              </Link>
            </Offcanvas.Body>
          </Offcanvas>

          <h1 className='title-main-1312'>Estado De Ticket</h1>

          <div className='icons-container-1313'>
            <div className="buttons-wrapper-1314">
              <div className="button-group-1315">
                <button className="icon-button-1316" onClick={navigateToHome}>
                  <svg
                    className="icon-svg-1317"
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
                <span className="button-text-1318">Home</span>
              </div>
              
              <div className="button-group-1315">
                <button className="icon-button-1316" onClick={navigateToBlog}>
                  <svg
                    className="icon-svg-1317"
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
                <span className="button-text-1318">Blog CEET</span>
              </div>
              
              <div className="button-group-1315">
                <button className="icon-button-1316">
                  <svg
                    className="icon-svg-1317"
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
                <span className="button-text-1318">Perfil</span>
              </div>
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
}

export default Header_ad;