import React from 'react';
import { Button, Alert } from 'react-bootstrap';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import Dropdown from 'react-bootstrap/Dropdown';
import { Navbar, Nav, Container,NavDropdown } from "react-bootstrap";
import "./estilos_admin.css";

function Admin() {
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
      <Navbar.Brand  id="solicitud">Solicitudes de equipos</Navbar.Brand>
      <Nav className="me-auto" id="Nav1">
        <Nav.Link href="http://localhost:5173/Login">Home</Nav.Link>
        <Nav.Link href="https://electricidadelectronicaytelecomu.blogspot.com/">Blog CEET</Nav.Link>
      </Nav>
  </Navbar>
  </div>
  </>
  )
}
export default Admin;