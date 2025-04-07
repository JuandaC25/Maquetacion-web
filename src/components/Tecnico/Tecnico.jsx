
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Pagination from 'react-bootstrap/Pagination';
import ListGroup from 'react-bootstrap/ListGroup';
import './stile_tec.css'
function Tecnico() {
    return(
        <>
        <div id="new_cont">
      <Navbar data-bs-theme="dark" >
          <Navbar.Brand href="#home" id="solicitud">Solicitudes de equipos</Navbar.Brand>
          <Nav className="me-auto" id="Nav1">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Blog CEET</Nav.Link>
          </Nav>
      </Navbar>
      </div>

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