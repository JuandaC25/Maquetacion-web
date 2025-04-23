import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Header.css';
import Desplegable from '../../../desplegable/desplegable';



function Headerpedidosescritorio() {
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
                  <div className='header1006'>
                    <NavDropdown.Item href='/Usuario'>
                      <i className="bi bi-plus-circle"></i> Solicitar equipos de
                    </NavDropdown.Item>
                  </div>
                  <div className='header1006'>
                    <NavDropdown.Item href="/Informacion_equiposs">
                      <i className="bi bi-gear"></i> Información de equipos
                    </NavDropdown.Item>
                  </div>
                  <div className='header1006'>
                    <NavDropdown.Item href="/espacios">
                      <i className="bi bi-people-fill"></i> Solicitar espacios
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