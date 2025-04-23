import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './header_crear.css';
import Desplegable from '../../desplegable/desplegable';


function header_crear() {
  return (
    <div className='header90001'> 

      <Navbar expand="xxxl" className='header90002'>
        <Container>
          <Navbar.Toggle className='header90003' />
          <Navbar.Collapse className='header90004'>
            <Nav>

            <div>
              
              <div className='header90005'>
              <NavDropdown.Item href="#action/3.1">Menu</NavDropdown.Item>
              </div>
              <div  className='header90006'>
              <NavDropdown.Item href='/Admin' >
                Estado del ticket
              </NavDropdown.Item >
              </div>
              <div  className='header90006'>
              <NavDropdown.Item href='/Adcrear' >
                Gestionar usuarios
              </NavDropdown.Item >
              </div>
              <div className='header90006'>
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
          <h1 className='header90007'>Gestionar usuarios</h1>
          
            <Nav.Link href="http://localhost:5173/Login" className='header90008'>Home</Nav.Link>
            <Nav.Link href="https://electricidadelectronicaytelecomu.blogspot.com/" className='header90009'>Blog CEET</Nav.Link>
        <Desplegable></Desplegable>
        
        </Container>
      </Navbar>
    </div>
  );
}

export default header_crear;
