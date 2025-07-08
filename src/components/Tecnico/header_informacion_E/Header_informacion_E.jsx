import { Navbar, Container, Nav } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header_informacion.css'
import Desplegable from '../../desplegable/desplegable';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';

function Header_informacion() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className='headeR'>
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
              <Link to="/Tecnico" className='cuadrito1'>
                <h3><i className="bi bi-plus-circle"></i> Solicitudes de equipos</h3>
              </Link>
              <Link to="/Cuarta" className='cuadrito1'>
                <h3><i className="bi bi-gear"></i> Información de equipos</h3>
              </Link>
              
            </Offcanvas.Body>
          </Offcanvas>

          
          <h1 className='heads'>Informacion de equipos</h1>

          
          <div className='Iconosst'>
            <Nav.Link href="http://localhost:5173/">Home</Nav.Link>
            <Nav.Link href="https://electricidadelectronicaytelecomu.blogspot.com/">Blog CEET</Nav.Link>
            <div className='desp.con'>
            <Desplegable />
            </div>
            
          </div>
        </div>
      </Navbar>
    </div>
  );
}

export default Header_informacion;


