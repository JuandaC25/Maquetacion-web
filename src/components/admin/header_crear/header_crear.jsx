import React, { useState } from 'react';
import { Navbar, Container, Nav, Button, Offcanvas } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './header_crear.css';
import Desplegable from '../../desplegable/desplegable';
import { Link } from 'react-router-dom';

function Header_crear() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className='header90001'> 
      <Navbar expand="xxxl" className='header90002'>
        <Container>
          <Button variant="primary" className='header90003' onClick={handleShow}>
            <i className="bi bi-list"></i>
          </Button>
          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header className='header_menuuu'>
              <Offcanvas.Title className='header_menu'><h1>Menú</h1></Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Link to="/Admin" className='header90006'>
                <h3><i className="bi bi-ticket-detailed"></i> Estado del ticket</h3>
              </Link>
              <Link to="/Adcrear" className='header90006'>
                <h3><i className="bi bi-person-plus"></i> Gestionar usuarios</h3>
              </Link>
              <Link to="/Inventario" className='header90006'>
                <h3><i className="bi bi-box-seam"></i> Consultar inventario</h3>
              </Link>
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </Navbar>

      <Navbar>
        <Container>
          <h1 className='header90007'>Gestionar usuarios</h1>
          <Nav.Link href="http://localhost:5173/Login" className='header90008'>Home</Nav.Link>
          <Nav.Link href="https://electricidadelectronicaytelecomu.blogspot.com/" className='header90009'>Blog CEET</Nav.Link>
          <Desplegable></Desplegable>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header_crear;

