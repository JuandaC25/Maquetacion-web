import './stile_tec.css'
import React from "react";
import { Navbar, Nav, Container,NavDropdown } from "react-bootstrap";
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';    
function Pie() {
  return (
    <>
     <div id="new_cont">  
        
        <Navbar expand="xxxl" className={'new_colo ${"bg-body-tertiary"}'}>
        <Container>
            <Navbar.Toggle id="menu" aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
           
               
                <div>
                  <div id="desplegable1">
                  <NavDropdown.Item href="#action/3.1">Menu</NavDropdown.Item>
                  </div>
                  <div  id="desplegable2">
                  <NavDropdown.Item href="#action/3.2">
                    Solicitudes de equipos
                  </NavDropdown.Item>
                  </div>
                  <div id="desplegable2">
                  <NavDropdown.Item href="#action/3.2">
                  Tickets
                  </NavDropdown.Item>
                  </div>
                  <NavDropdown.Divider />
                  </div>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
          <Navbar data-bs-theme="dark" >
              <Navbar.Brand href="#home" id="solicitud">Solicitudes de equipos</Navbar.Brand>
              <Nav className="me-auto" id="Nav1">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#features">Blog CEET</Nav.Link>
              </Nav>
          </Navbar>
          </div>
          
    <Stack gap={3} id="centro">
        
      <div id="contgr1">
        
      Nombre Usuario
        
      <div className="p-2" ></div>
      </div>
      <div id="contgr">
        
            Ambiente
    
      <div className="p-2" ></div>
      </div>
      <div id="contgr">
        Cantidad de equipos
      <div className="p-2" id="grillas"></div>
      </div>
      <div id="contgr">
    Clase de equipos
      <div className="p-2" id="grillas"></div>
      </div>
     
    
    </Stack>
    <Button variant="primary" id='button' href='/Tercera'>finalizado</Button>

    </>
  );
}

export default Pie;

