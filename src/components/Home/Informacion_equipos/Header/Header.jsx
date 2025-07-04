import { Navbar, Container, Nav} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header.css';
import Desplegable from '../../../desplegable/desplegable';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';

function Headerespacios() {
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
              <Link to="/Inicio" className='cuadrito1'>
                <h3><i className="bi bi-plus-circle"></i> Solicitar equipos</h3>
              </Link>
              <Link to="/Informacion_equiposs" className='cuadrito1'>
                <h3><i className="bi bi-gear"></i> Información de equipos</h3>
              </Link>
              <Link to="/espacios" className='cuadrito1'>
                <h3><i className="bi bi-person-plus"></i> Solicitar espacios</h3>
              </Link>
            </Offcanvas.Body>
          </Offcanvas>

          
          <h1 className='header1007'>Informacion de equipos</h1>

          
          <div className='Iconos'>
            <Nav.Link href="http://localhost:5173/">Home</Nav.Link>
            <Nav.Link className="Blogc" href="https://electricidadelectronicaytelecomu.blogspot.com/">Blog CEET</Nav.Link>
            <div className='desp.con'>
            <Desplegable />
            </div>
            
          </div>
        </div>
      </Navbar>
    </div>
  );
}
  
  export default Headerespacios;




  