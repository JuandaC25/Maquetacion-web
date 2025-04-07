import Pagination from 'react-bootstrap/Pagination';
import ListGroup from 'react-bootstrap/ListGroup';
import './stile_tec.css'
import React from "react";
import { Navbar, Nav, Container,NavDropdown } from "react-bootstrap";


function Tecnico() {
    return(
        <>
    
      <div id="new_cont">  
        
    <Navbar expand="xxl" className={'new_colo ${"bg-body-tertiary"}'}>
    <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
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
      <div id="conainer_blanco">

      <ListGroup >
      <ListGroup.Item id="Conte">Cras justo odio</ListGroup.Item>
      <ListGroup.Item id="Conte">Dapibus ac facilisis in</ListGroup.Item>
      <ListGroup.Item id="Conte">Morbi leo risus</ListGroup.Item>
      <ListGroup.Item id="Conte">Porta ac consectetur ac</ListGroup.Item>
      <ListGroup.Item id="Conte">Vestibulum at eros</ListGroup.Item>
      <ListGroup.Item id="Conte">Morbi leo risus</ListGroup.Item>
      <ListGroup.Item id="Conte">Porta ac consectetur ac</ListGroup.Item>
      <ListGroup.Item id="Conte">Vestibulum at eros</ListGroup.Item>
    </ListGroup>
    </div>
      <div class="pie">
      <Pagination >
      <Pagination.Prev/>
      <Pagination.Item active>{1}</Pagination.Item>

      <Pagination.Item>{2}</Pagination.Item>
      <Pagination.Item>{3}</Pagination.Item>
      <Pagination.Ellipsis />
      <Pagination.Item >{10}</Pagination.Item>
      <Pagination.Next />
    </Pagination>
    </div> 
    </>
    )
}
export default Tecnico;