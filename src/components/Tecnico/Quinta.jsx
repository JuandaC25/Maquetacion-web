import './stile_tec.css'
import React from "react";
import { Navbar, Nav, Container,NavDropdown } from "react-bootstrap";
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button'; 
function Quinta() {
    
    return(
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
                <NavDropdown.Item href='/tecnico' >
                  Solicitudes de equipos
                </NavDropdown.Item >
                </div>
                <div id="desplegable2">
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
        <Navbar data-bs-theme="dark" >
            <Navbar.Brand href="#home" id="solicitud">Solicitudes de equipos</Navbar.Brand>
            <Nav className="me-auto" id="Nav1">
              <Nav.Link href="http://localhost:5173/Login">Home</Nav.Link>
              <Nav.Link href="https://electricidadelectronicaytelecomu.blogspot.com/">Blog CEET</Nav.Link>
            </Nav>
        </Navbar>
        </div>
        <Stack gap={3} id="centro">
            <div id="supremof">
        
        <div id="contgr2">
          <div id="escrito">
        Fecha de reporte
        </div>
        <div className="p-3" ></div>
        </div>
        <div id="contgr2">
        <div id="escrito">
              Modelo de pc
              </div>
        <div className="p-3" ></div>
        </div>
        <div id="contgr2">
        <div id="escrito">
          Numero de serie
          </div>
        <div className="p-3" id="grillas"></div>
        </div>
        <div id="contgr2">
        <div id="escrito">
     Ambiente
        </div>
        <div className="p-3" id="grillas"></div>
        </div>
        </div>
       
      
      </Stack>
      <Button variant="primary" id='button' href='/Sexta'>Reportar</Button>
      
        </>
    )
}

export default Quinta;