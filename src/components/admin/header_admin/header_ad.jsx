import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './header_ad.css';
import Desplegable from '../../desplegable/desplegable';


function header_ad() {
  return (
    <div className='header1001'> 

      <Navbar expand="xxxl" className='header6002'>
        <Container>
          <Navbar.Toggle className='header6003' />
          <Navbar.Collapse className='header6004'>
            <Nav>

            <div>
              
              <div className='header6005'>
              <NavDropdown.Item href="#action/3.1">Menu</NavDropdown.Item>
              </div>
              <div  className='header6006'>
              <NavDropdown.Item href='/Admin' >
                Estado del ticket
              </NavDropdown.Item >
              </div>
              <div  className='header6006'>
              <NavDropdown.Item href='/Adcrear' >
                Gestionar usuarios
              </NavDropdown.Item >
              </div>
              <div className='header6006'>
              <NavDropdown.Item href="/Inventario">
                Consultar inventario
              </NavDropdown.Item>
              </div>
              <NavDropdown.Divider />
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>


      <Navbar>
        <Container>
          <h1 className='header6007'>Solicitudes de equipos</h1>
          
            <Nav.Link href="http://localhost:5173/Login" className='header6008'>Home</Nav.Link>
            <Nav.Link href="https://electricidadelectronicaytelecomu.blogspot.com/" className='header6009'>Blog CEET</Nav.Link>
        <Desplegable></Desplegable>
        
        </Container>
      </Navbar>
    </div>
  );
}

export default header_ad;
//hola
