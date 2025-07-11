import React, { useState } from 'react';
import { Navbar, Container, Button, Offcanvas, Nav } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './header_solielemento.css';
import Desplegable from '../../desplegable/desplegable';
import { Link } from 'react-router-dom';
function Header_solielemento() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className='header_ad_main'> 
      <Navbar expand="xxxl" className="w-100">
        <div className='main-header-content'>

          <Button variant="primary" className='Icon_menu' onClick={handleShow}>
            <i className="bi bi-list"></i>
          </Button>

          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header className='header_menuuu' closeButton>
              <Offcanvas.Title className='header_menu'>
                <h1>Menú</h1>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Link to="/Admin" className='cuadrito1'>
                <h3><i className="bi bi-ticket-detailed"></i> Estado del ticket</h3>
              </Link>
              <Link to="/Adcrear" className='cuadrito1'>
                <h3><i className="bi bi-person-plus"></i> Gestionar usuarios</h3>
              </Link>
              <Link to="/Inventario" className='cuadrito1'>
                <h3><i className="bi bi-box-seam"></i> Consultar inventario</h3>
              </Link>
             <Link to="/Solielemento" className='cuadrito1'>
                <h3><i className="bi bi-search"></i>Solicitudes elementos</h3>
              </Link>
             <Link to="/Soliespacio" className='cuadrito1'>
                <h3><i className="bi bi-search"></i>Solicitudes espacios</h3>
              </Link>
            </Offcanvas.Body>
          </Offcanvas>

          <h1 className='header_ad_title'>Solicitudes de elementos</h1>

          <div className='Iconosst'>
            <Nav.Link href="http://localhost:5173/Login">Home</Nav.Link>
            <Nav.Link href="https://electricidadelectronicaytelecomu.blogspot.com/">Blog CEET</Nav.Link>
            <div className='desp .con'>
              <Desplegable />
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
}

export default Header_solielemento;