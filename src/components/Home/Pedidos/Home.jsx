import './Estilos.css';
import Button from 'react-bootstrap/Button';
import Cuadro_Pedidos from './Cuadro_pedidos';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Footer from '../../Footer/Footer';

function Home() {
  return (
    <>
      <div id="new_cont">
      <Navbar expand="xxxl" className="new_colo">
          <Container>
            <Navbar.Toggle id="menu" aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <div id="desplegable1">
                  <NavDropdown.Item href="#action/3.1">Menu</NavDropdown.Item>
                </div>
                <div id="desplegable2">
                  <NavDropdown.Item href="/Usuario">Solicitar equipos</NavDropdown.Item>
                </div>
                <div id="desplegable3">
                  <NavDropdown.Item href="/inventario">Información de equipos</NavDropdown.Item>
                </div>
                <div id="desplegable4">
                  <NavDropdown.Item href="/espacios">Solicitar espacios</NavDropdown.Item>
                </div>
                <NavDropdown.Divider />
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Navbar data-bs-theme="dark">
          <Navbar.Brand id="solicitud">Solicitar equipos</Navbar.Brand>
          <Nav className="me-auto" id="Nav1">
            <Nav.Link href="http://localhost:5173/Login">Home</Nav.Link>
            <Nav.Link href="https://electricidadelectronicaytelecomu.blogspot.com/">Blog CEET</Nav.Link>
          </Nav>
        </Navbar>
      </div>
      <Cuadro_Pedidos />
      <Footer/>
    </>
  );
}

export default Home;


