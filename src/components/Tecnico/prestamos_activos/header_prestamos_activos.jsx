
import { Navbar } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../header_tickets_activos/header_tickets_activos.css';
import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';

function HeaderPrestamosActivos() {
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
    <div className='container-xd201tec'>
      <Navbar expand="xxxl" className="w-100tec">
        <div className='content-xd202tec'>
          <button className="button-xd203tec" onClick={handleShowMenu}>
            <span className="icon-xd204tec">
              <svg viewBox="0 0 175 80" width="40" height="40">
                <rect width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                <rect y="30" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                <rect y="60" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
              </svg>
            </span>
            <span className="text-xd205tec">MENU</span>
          </button>

          <Offcanvas show={showMenu} onHide={handleCloseMenu}>
            <Offcanvas.Header className='header-xd206tec' closeButton>
              <Offcanvas.Title className='title-xd207tec'><h1>Menú</h1></Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="cards-xd208tec">
              <Link to="/Prestamos-Tecnico" className='card-xd209tec'>
                <p className="text-primary-xd210tec"><i className="bi bi-arrow-left-right"></i> Prestamos</p>
                <p className="text-secondary-xd211tec">Ver solicitudes de prestamos</p>
              </Link>
              <Link to="/Tickets-Tecnico" className='card-xd209tec'>
                <p className="text-primary-xd210tec"><i className="bi bi-tools"></i> Tickets</p>
                <p className="text-secondary-xd211tec">Ver tickets de equipos</p>
              </Link>
              <Link to="/TicketsActivos" className='card-xd209tec'>
                <p className="text-primary-xd210tec"><i className="bi bi-lightning-charge"></i> Tickets Activos</p>
                <p className="text-secondary-xd211tec">Ver solo tickets activos</p>
              </Link>
              <Link to="/PrestamosActivos" className='card-xd209tec'>
                <p className="text-primary-xd210tec"><i className="bi bi-lightning-charge"></i> Préstamos Activos</p>
                <p className="text-secondary-xd211tec">Ver solo préstamos activos</p>
              </Link>
              <Link to="/HistorialTec" className='card-xd209tec'>
                <p className="text-primary-xd210tec"><i className="bi bi-clock-history"></i> Historial</p>
                <p className="text-secondary-xd211tec">Ver registros(prestamos y tickets)</p>
              </Link>
            </Offcanvas.Body>
          </Offcanvas>

          <h1 className='title-main-xd212tec'>Préstamos Activos</h1>
        </div>
      </Navbar>
    </div>
  );
}

export default HeaderPrestamosActivos;
