import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">Mi App</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link href="#perfil">
            <i className="bi bi-person-circle" style={{ fontSize: '1.5rem', color: 'white' }}></i>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
