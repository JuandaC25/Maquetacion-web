import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Container, Row, Col } from 'react-bootstrap';
import Datos_pedido from './Datos_pedido';
import "./Solicitud_espacios.css";
import Footer from '../../Footer/Footer';

function Soliespacios() {
  return (
    <div>
      <div className='Conteiner1'> 
        <Row className="justify-content-md-center">
          <Col>
            <h1 className='Head'>Solicitud espacios</h1>
          </Col>
          <Col>
            <Breadcrumb className='Text2'>
              <Breadcrumb.Item href="http://localhost:5173/Login">Home</Breadcrumb.Item>
              <Breadcrumb.Item href="https://electricidadelectronicaytelecomu.blogspot.com/">Blogceet</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
      </div>
      <Datos_pedido />
      <Footer/>
    </div>
  );
}

export default Soliespacios;
  