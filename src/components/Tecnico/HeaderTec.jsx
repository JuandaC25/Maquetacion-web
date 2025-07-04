import { Navbar, Container, Nav } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './HeaderTec.css';
import Desplegable from '../desplegable/desplegable';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';

function HeaderTec() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className='header1001'>
    
        <Container className='dificil2'>
          <Button variant="primary" className='Icon_menu' onClick={handleShow}>
            <i className="bi bi-list"></i> {}
          </Button>
          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header className='header_menuuu'>
              <Offcanvas.Title className='header_menu'><h1>Menú</h1></Offcanvas.Title>
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
        </Container>


      <Navbar className='dificil'>
        
          <h1 className='header1007'>Solicitar espacios</h1>
          <Container className='Iconos'>
            <div>
            <Nav.Link href="http://localhost:5173/Login">Home</Nav.Link>
            </div>
            <div>
            <Nav.Link className="Blogc" href="https://electricidadelectronicaytelecomu.blogspot.com/">Blog CEET</Nav.Link>
            </div>
            <div>
            <Desplegable />
            </div>
          </Container>
       
      </Navbar>
  </div>
  );
}

export default HeaderTec;
