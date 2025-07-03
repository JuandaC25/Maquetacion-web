import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './header_inv.css';
import Desplegable from '../../desplegable/desplegable';


function header_inv() {
  return (
    <div className='header100001'> 

      <Navbar expand="xxxl" className='header100002'>
        <Container>
          <Navbar.Toggle className='header100003' />
          <Navbar.Collapse className='header100004'>
            <Nav>

            <div>
              
              <div className='header100005'>
              <NavDropdown.Item href="#action/3.1">Menu</NavDropdown.Item>
              </div>
              <div  className='header100006'>
              <NavDropdown.Item href='/Admin' >
                Estado del ticket
              </NavDropdown.Item >
              </div>
              <div  className='header100006'>
              <NavDropdown.Item href='/Adcrear' >
                Gestionar usuarios
              </NavDropdown.Item >
              </div>
              <div className='header100006'>
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
          <h1 className='header100007'>Inventario</h1>
          
            <Nav.Link href="http://localhost:5173/Login" className='header100008'>Home</Nav.Link>
            <Nav.Link href="https://electricidadelectronicaytelecomu.blogspot.com/" className='header100009'>Blog CEET</Nav.Link>
        <Desplegable></Desplegable>
        
        </Container>
      </Navbar>
    </div>
  );
}

export default header_inv;
