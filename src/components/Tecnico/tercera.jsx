import './stile_tec.css'
import React from 'react';
import { Navbar, Nav, Container,NavDropdown } from "react-bootstrap";
import Button from 'react-bootstrap/Button';

 
function Tercera() {
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
                       <NavDropdown.Item href='/tecnico'>
                         Solicitudes de equipos
                       </NavDropdown.Item>
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
                     <Nav.Link href="#home">Home</Nav.Link>
                     <Nav.Link href="https://electricidadelectronicaytelecomu.blogspot.com/">Blog CEET</Nav.Link>
                   </Nav>
               </Navbar>
               </div>
               <div id="salida">
               <div id="pregunta">
                <h2>¿Estas seguro de que quieres confirmar cierre de solicitud?</h2>
               </div>
               <div id="dueño">
               <Button variant="primary" id="cosos" href='Tecnico'>Aceptar</Button>
               <Button variant="primary" id="cosos" href='/pie'>Cancelar</Button>
               </div>
               </div>
    </>
  );
}

export default Tercera;