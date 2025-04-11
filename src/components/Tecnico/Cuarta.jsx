import './stile_tec.css'
import React from "react";
import Pagination from 'react-bootstrap/Pagination';
import ListGroup from 'react-bootstrap/ListGroup';
import { Navbar, Nav, Container,NavDropdown } from "react-bootstrap";
function Cuarta() {
    
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
        <div id="conainer_blanco">
  
        <ListGroup >
        <ListGroup.Item id="Conte1">
          <div id="part1"><h4>Detalle del equipo(Accesorios,numero de serie)</h4></div>
          <Nav.Link href="/Quinta" id="ver">Tomar peticion</Nav.Link>
  
        </ListGroup.Item>
        <ListGroup.Item id="Conte1">
        <div id="part1"><h4>Detalle del equipo(Accesorios,numero de serie)</h4></div>
        <Nav.Link href="/Quinta" id="ver">Tomar peticion</Nav.Link>
        </ListGroup.Item>
        <ListGroup.Item id="Conte1">
        <div id="part1"><h4>Detalle del equipo(Accesorios,numero de serie)</h4></div>
        <Nav.Link href="/Quinta" id="ver">Tomar peticion</Nav.Link>
  
        </ListGroup.Item>
        <ListGroup.Item id="Conte1">
        <div id="part1"><h4>Detalle del equipo(Accesorios,numero de serie)</h4></div>
        <Nav.Link href="/Quinta" id="ver">Tomar peticion</Nav.Link>
  
  
        </ListGroup.Item>
        <ListGroup.Item id="Conte1">
        <div id="part1"><h4>Detalle del equipo(Accesorios,numero de serie)</h4></div>
        <Nav.Link href="/Quinta" id="ver">Tomar peticion</Nav.Link>
  
        </ListGroup.Item>
        <ListGroup.Item id="Conte1">
        <div id="part1"><h4>Detalle del equipo(Accesorios,numero de serie)</h4></div>
        <Nav.Link href="/Quinta" id="ver">Tomar peticion</Nav.Link>
  
        </ListGroup.Item>
        <ListGroup.Item id="Conte1">
        <div id="part1"><h4>Detalle del equipo(Accesorios,numero de serie)</h4></div>
        <Nav.Link href="/Quinta" id="ver">Tomar peticion</Nav.Link>
        </ListGroup.Item>
        <ListGroup.Item id="Conte1">
        <div id="part1"><h4>Detalle del equipo(Accesorios,numero de serie)</h4></div>
        <Nav.Link href="/Quinta" id="ver">Tomar peticion</Nav.Link>
  
        </ListGroup.Item>
        <ListGroup.Item id="Conte1">
        <div id="part1"><h4>Detalle del equipo(Accesorios,numero de serie)</h4></div>
        <Nav.Link href="/Quinta" id="ver">Tomar peticion</Nav.Link>
  
        </ListGroup.Item>
        <ListGroup.Item id="Conte1">
        <div id="part1"><h4>Detalle del equipo(Accesorios,numero de serie)</h4></div>
        <Nav.Link href="/Quinta" id="ver">Tomar peticion</Nav.Link>
  
        </ListGroup.Item>
      </ListGroup>
      </div>
      </>
    )
  }
  
  export default Cuarta;
  