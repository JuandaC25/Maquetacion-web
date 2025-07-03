import React, { useState } from 'react';
import { Navbar, Container, Nav, Button, Offcanvas } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './header_inv.css'; // This CSS file will now contain the new class styles
import Desplegable from '../../desplegable/desplegable';
import { Link } from 'react-router-dom';

function Header_inv() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className='header1001'> {/* Changed to header1001 */}
      <Navbar expand="xxxl"> {/* Removed header100002 as it's not in the new structure */}
        <Container>
          <Button variant="primary" className='Icon_menu' onClick={handleShow}> {/* Changed to Icon_menu */}
            <i className="bi bi-list"></i>
          </Button>
          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header className='header_menuuu'>
              <Offcanvas.Title className='header_menu'><h1>Menú</h1></Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {/* Changed to cuadrito1 */}
              <Link to="/Admin" className='cuadrito1'>
                <h3><i className="bi bi-ticket-detailed"></i> Estado del ticket</h3>
              </Link>
              <Link to="/Adcrear" className='cuadrito1'>
                <h3><i className="bi bi-person-plus"></i> Gestionar usuarios</h3>
              </Link>
              <Link to="/Inventario" className='cuadrito1'>
                <h3><i className="bi bi-box-seam"></i> Consultar inventario</h3>
              </Link>
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </Navbar>

      <Navbar>
        <Container>
          {/* Changed to header1007 but keeping "Inventario" text */}
          <h1 className='header1007'>Inventario</h1>
          <Container className='Iconos'>
            <Nav.Link href="http://localhost:5173/Login">Home</Nav.Link> {/* Removed header100008 */}
            <Nav.Link className="Blogc" href="https://electricidadelectronicaytelecomu.blogspot.com/">Blog CEET</Nav.Link> {/* Changed to Blogc */}
            <Desplegable />
          </Container>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header_inv;