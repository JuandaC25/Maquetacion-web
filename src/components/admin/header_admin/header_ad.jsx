import React, { useState } from 'react';
import { Navbar, Container, Nav, Button, Offcanvas } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './header_ad.css'; // This CSS file will now be identical to header_inv.css
import Desplegable from '../../desplegable/desplegable';
import { Link } from 'react-router-dom';

function Header_crear() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className='header1001'> {/* Class changed to header1001 to match Header_inv */}
      <Navbar expand="xxxl"> {/* Removed explicit Navbar className to match Header_inv's structure */}
        <Container>
          <Button variant="primary" className='Icon_menu' onClick={handleShow}> {/* Class changed to Icon_menu */}
            <i className="bi bi-list"></i>
          </Button>
          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header className='header_menuuu'> {/* Class changed to header_menuuu */}
              <Offcanvas.Title className='header_menu'><h1>Menú</h1></Offcanvas.Title> {/* Class changed to header_menu */}
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Link to="/Admin" className='cuadrito1'> {/* Class changed to cuadrito1 */}
                <h3><i className="bi bi-ticket-detailed"></i> Estado del ticket</h3>
              </Link>
              <Link to="/Adcrear" className='cuadrito1'> {/* Class changed to cuadrito1 */}
                <h3><i className="bi bi-person-plus"></i> Gestionar usuarios</h3>
              </Link>
              <Link to="/Inventario" className='cuadrito1'> {/* Class changed to cuadrito1 */}
                <h3><i className="bi bi-box-seam"></i> Consultar inventario</h3>
              </Link>
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </Navbar>

      <Navbar>
        <Container>
          {/* Class changed to header1007, but text remains "Estado De Ticket" */}
          <h1 className='header1007'>Estado De Ticket</h1>
          <Container className='Iconos'> {/* Added Iconos container */}
            <Nav.Link href="http://localhost:5173/Login">Home</Nav.Link> {/* No class for Home in Header_inv's final structure */}
            <Nav.Link className="Blogc" href="https://electricidadelectronicaytelecomu.blogspot.com/">Blog CEET</Nav.Link> {/* Class changed to Blogc */}
            <Desplegable />
          </Container>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header_crear;