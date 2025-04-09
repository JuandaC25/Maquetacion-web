import Breadcrumb from 'react-bootstrap/Breadcrumb';
import './Estilos.css';
import { Row, Col } from 'react-bootstrap';
import Desplegable from './Desplegable.jsx';
import CuadroPedidos from './Cuadro_pedidos';


function Home() {
  return (
    <div className='Conteiner1'> 
      <Row className="justify-content-md-center">
        <Col>
          <Desplegable />
          <h1 className='Text1'>HEADER</h1>
        </Col>
        <Col>
          <Breadcrumb className='Text2'>
            <Breadcrumb.Item href="http://localhost:5173/Login">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="https://electricidadelectronicaytelecomu.blogspot.com/">Blogceet</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <CuadroPedidos/>
    </div>
  );
}
export default Home;