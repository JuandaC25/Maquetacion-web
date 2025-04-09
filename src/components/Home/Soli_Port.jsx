import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Pagination from 'react-bootstrap/Pagination';
import ListGroup from 'react-bootstrap/ListGroup';
function Soli_port() {
    return(
        <body id='soli_port'>
      <Navbar>
          <Navbar.Brand href="#home" id="solicitud1">Solicitar portatiles</Navbar.Brand>
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Blog CEET</Nav.Link>
      </Navbar>

      <ListGroup id='Lista_eq' >
      <ListGroup.Item id="Conte">Cras justo odio</ListGroup.Item>
      <ListGroup.Item id="Conte">Dapibus ac facilisis in</ListGroup.Item>
      <ListGroup.Item id="Conte">Morbi leo risus</ListGroup.Item>
      <ListGroup.Item id="Conte">Porta ac consectetur ac</ListGroup.Item>
      <ListGroup.Item id="Conte">Vestibulum at eros</ListGroup.Item>
      <ListGroup.Item id="Conte">Morbi leo risus</ListGroup.Item>
      <ListGroup.Item id="Conte">Porta ac consectetur ac</ListGroup.Item>
      <ListGroup.Item id="Conte">Vestibulum at eros</ListGroup.Item>
    </ListGroup>
    <Container id='num_port'>
      <Pagination>
      <Pagination.Prev/>
      <Pagination.Item active>{1}</Pagination.Item>
      <Pagination.Item>{2}</Pagination.Item>
      <Pagination.Item>{3}</Pagination.Item>
      <Pagination.Ellipsis />
      <Pagination.Item >{10}</Pagination.Item>
      <Pagination.Next />
    </Pagination>
    </Container>
    </body>
    );
  }
export default Soli_port;