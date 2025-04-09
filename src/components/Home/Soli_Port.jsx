import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Pagination from 'react-bootstrap/Pagination';
import ListGroup from 'react-bootstrap/ListGroup';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Button } from 'react-bootstrap';
function Soli_port() {
    return(
        <body id='soli_port'>
      <Navbar>
          <Navbar.Brand href="#home" id="solicitud1">Solicitar portatiles</Navbar.Brand>
          <Breadcrumb className='Text2'>
            <Breadcrumb.Item href="http://localhost:5173/Login">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="https://electricidadelectronicaytelecomu.blogspot.com/">Blogceet</Breadcrumb.Item>
          </Breadcrumb>
      </Navbar>
      <Container id='Container_info'>
      <ListGroup id='Lista_eq' >
      <ListGroup.Item id="Conte">Detalles del equipo <Button id='Button_ver'>Ver</Button></ListGroup.Item>
      <ListGroup.Item id="Conte">Detalles del equipo <Button id='Button_ver'>Ver</Button></ListGroup.Item>
      <ListGroup.Item id="Conte">Detalles del equipo <Button id='Button_ver'>Ver</Button></ListGroup.Item>
      <ListGroup.Item id="Conte">Detalles del equipo <Button id='Button_ver'>Ver</Button></ListGroup.Item>
      <ListGroup.Item id="Conte">Detalles del equipo <Button id='Button_ver'>Ver</Button></ListGroup.Item>
      <ListGroup.Item id="Conte">Detalles del equipo <Button id='Button_ver'>Ver</Button></ListGroup.Item>
      <ListGroup.Item id="Conte">Detalles del equipo <Button id='Button_ver'>Ver</Button></ListGroup.Item>
      <ListGroup.Item id="Conte">Detalles del equipo <Button id='Button_ver'>Ver</Button></ListGroup.Item>
    </ListGroup>
    </Container>
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