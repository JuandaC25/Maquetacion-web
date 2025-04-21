import Pagination from 'react-bootstrap/Pagination';
import ListGroup from 'react-bootstrap/ListGroup';
import './stile_tec.css'
import React from "react";
import {Nav} from "react-bootstrap";
import Footer from '../Footer/Footer';
import Header_tec from '../header_tecnico/header_tec';


function Tecnico() {
return(
  <>
  <Header_tec></Header_tec>
    <div id="container_blanco">

      <ListGroup >
      <ListGroup.Item id="Conte">
        <div id="part"><h4>Cantidad/Equipo/Ambiente</h4></div>
        <Nav.Link href="/pie">ver</Nav.Link>

      </ListGroup.Item>
      <ListGroup.Item id="Conte">
      <div id="part"><h4>Cantidad/Equipo/Ambiente</h4></div>
      <Nav.Link href="/pie">ver</Nav.Link>

      </ListGroup.Item>
      <ListGroup.Item id="Conte">
      <div id="part"><h4>Cantidad/Equipo/Ambiente</h4></div>
      <Nav.Link href="/pie">ver</Nav.Link>
      </ListGroup.Item>
      <ListGroup.Item id="Conte">
      <div id="part"><h4>Cantidad/Equipo/Ambiente</h4></div>
      <Nav.Link href="/pie">ver</Nav.Link>
      </ListGroup.Item>
      <ListGroup.Item id="Conte">
      <div id="part"><h4>Cantidad/Equipo/Ambiente</h4></div>
      <Nav.Link href="/pie">ver</Nav.Link>
      

      </ListGroup.Item>
      <ListGroup.Item id="Conte">
      <div id="part"><h4>Cantidad/Equipo/Ambiente</h4></div>
      <Nav.Link href="/pie">ver</Nav.Link>

      </ListGroup.Item>
      <ListGroup.Item id="Conte">
      <div id="part"><h4>Cantidad/Equipo/Ambiente</h4></div>
      <Nav.Link href="/pie">ver</Nav.Link>
      </ListGroup.Item>
      <ListGroup.Item id="Conte">
      <div id="part"><h4>Cantidad/Equipo/Ambiente</h4></div>
      <Nav.Link href="/pie">ver</Nav.Link>

      </ListGroup.Item>
      <ListGroup.Item id="Conte">
      <div id="part"><h4>Cantidad/Equipo/Ambiente</h4></div>
      <Nav.Link href="/pie">ver</Nav.Link>

      </ListGroup.Item>
      <ListGroup.Item id="Conte">
      <div id="part"><h4>Cantidad/Equipo/Ambiente</h4></div>
      <Nav.Link href="/pie">ver</Nav.Link>

      </ListGroup.Item>
    </ListGroup>
    </div>
      <div class="pie">
      <Pagination id="font" >
      <Pagination.Prev href='/tecnico'/>
      <Pagination.Item  id="font" href='/tecnico'>{1}</Pagination.Item>

      <Pagination.Item id="font" href='/tecnico'>{2}</Pagination.Item>
      <Pagination.Item id="font" href='/tecnico'>{3}</Pagination.Item>
      <Pagination.Ellipsis href='/tecnico'/>
      <Pagination.Item  id="font" href='/tecnico'>{10}</Pagination.Item>
      <Pagination.Next  href='/tecnico'/>
    </Pagination >
    </div> 
    <Footer></Footer>
  </>
  );
  }
export default Tecnico;