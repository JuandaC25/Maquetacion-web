import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header_port.css';
import Desplegable from '../../../desplegable/desplegable';


function Header_port() {
  return (
    <div className='header1001'> 

      <Navbar expand="xxxl" className='header1002'>
        <Container>
          <Navbar.Toggle className='header1003' />
          <Navbar.Collapse className='header1004'>
            <Nav>

            <div>
              
              <div className='header1005'>
              <NavDropdown.Item href="#action/3.1">Menu</NavDropdown.Item>
              </div>
              <div  className='header1006'>
              <NavDropdown.Item href='/tecnico ' >
                <h3>Solicitudes de equipos</h3>
              </NavDropdown.Item >
              </div>
              <div className='header1006'>
              <NavDropdown.Item href="/Cuarta">
              Tickets
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
          <h1 className='header1007'>Solicitudes de equipos</h1>
          
            <Nav.Link href="http://localhost:5173/Login" className='header1008'>Home</Nav.Link>
            <Nav.Link href="https://electricidadelectronicaytelecomu.blogspot.com/" className='header1009'>Blog CEET</Nav.Link>
        <Desplegable></Desplegable>
        
        </Container>
      </Navbar>
    </div>
  );
}

export default Header_port;
