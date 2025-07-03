import React, { useState } from 'react'; // Added useState import
import { Navbar, Container, Nav, Button, Offcanvas } from 'react-bootstrap'; // Added Button and Offcanvas imports
import 'bootstrap-icons/font/bootstrap-icons.css';
import './header_ad.css';
import Desplegable from '../../desplegable/desplegable';
import { Link } from 'react-router-dom'; // Added Link import

function Header_crear() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className='header601'> 
      <Navbar expand="xxxl" className='header602'>
        <Container>
          <Button variant="primary" className='header603' onClick={handleShow}>
            <i className="bi bi-list"></i>
          </Button>
          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header className='header604'> {/* Changed from header_menuuu */}
              <Offcanvas.Title className='header605'><h1>Menú</h1></Offcanvas.Title> {/* Changed from header_menu */}
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Link to="/Admin" className='header606'> {/* Changed from header90006 */}
                <h3><i className="bi bi-ticket-detailed"></i> Estado del ticket</h3>
              </Link>
              <Link to="/Adcrear" className='header606'> {/* Changed from header90006 */}
                <h3><i className="bi bi-person-plus"></i> Gestionar usuarios</h3>
              </Link>
              <Link to="/Inventario" className='header606'> {/* Changed from header90006 */}
                <h3><i className="bi bi-box-seam"></i> Consultar inventario</h3>
              </Link>
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </Navbar>

      <Navbar>
        <Container>
          <h1 className='header607'>Estado De Ticket</h1> {/* Changed from header90007 */}
          <Nav.Link href="http://localhost:5173/Login" className='header608'>Home</Nav.Link> {/* Changed from header90008 */}
          <Nav.Link href="https://electricidadelectronicaytelecomu.blogspot.com/" className='header609'>Blog CEET</Nav.Link> {/* Changed from header90009 */}
          <Desplegable></Desplegable>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header_crear;