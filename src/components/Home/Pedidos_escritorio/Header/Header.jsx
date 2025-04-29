import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header.css';
import Desplegable from '../../../desplegable/desplegable';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';



function Headerpedidosescritorio() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
    return (
      <div className='header1001'>
        <Navbar expand="xxxl" >
          <Container>
          <Button variant="primary" className='Icon_menu' onClick={handleShow}>
          <i  class="bi bi-list"></i>
      </Button>
      <Offcanvas show={show} onHide={handleClose}>
      <Offcanvas.Header className='header_menuuu'>
          <Offcanvas.Title className='header_menu'><h2>Menú</h2></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <button className='cuadrito1'href="/Usuario" >
            <h3><i class="bi bi-plus-circle"></i> Solicitar equipos</h3>
            </button>
            <button className='cuadrito1' href="/Informacion_equiposs" >
            <h3> <i class="bi bi-gear"></i>   informacion de equipos</h3>
            </button>
            <button className='cuadrito1' href="/espacios">
            <h3> <i class="bi bi-person-plus"></i> Solicitar espacios</h3>
            </button>
        </Offcanvas.Body>
      </Offcanvas>
          </Container>
        </Navbar>
  
        <Navbar>
          <Container>
            <h1 className='header1007'>Solicitar equipos de escritorio</h1>
            <Nav.Link href="http://localhost:5173/Login" className='header1008'>Home</Nav.Link>
            <Nav.Link href="https://electricidadelectronicaytelecomu.blogspot.com/" className='header1009'>Blog CEET</Nav.Link>
            <Desplegable /> 
          </Container>
        </Navbar>
      </div>
    );
  }
  
  export default Headerpedidosescritorio;