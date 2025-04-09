import "./Soli_televisor.css";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

function Solitelevisores() {
    return (
      <>
        <div className='Conteiner1'> 
          <Row className="justify-content-md-center">
            <Col>
              <h1 className='Text1'>HEADER</h1>
            </Col>
            <Col>
              <Breadcrumb className='Text2'>
                <Breadcrumb.Item href="http://localhost:5173/Login">Home</Breadcrumb.Item>
                <Breadcrumb.Item href="https://electricidadelectronicaytelecomu.blogspot.com/">Blogceet</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </div>
  
        <div className='Cuadros'> 
          <div className='fila-superior'>
            <Card className='cuadro'>
              <Card.Body>
                <Form.Label htmlFor="inputCantidad" className="etiqueta-input"><h3>Ingrese cantidad</h3></Form.Label>
                <Form.Control type="text" id="inputCantidad" />
              </Card.Body>
            </Card>
  
            <Card className='cuadro'>
              <Card.Body>
                <Form.Label htmlFor="inputAmbiente" className="etiqueta-input"><h3>Ambiente</h3></Form.Label>
                <Form.Control type="text" id="inputAmbiente" />
              </Card.Body>
            </Card>
          </div>
  
          <div className='fila-inferior'>
            <Card className='cuadro'>
              <Card.Body>
                <Form.Label htmlFor="inputFecha" className="etiqueta-input"><h3>Fecha de uso</h3></Form.Label>
                <Form.Control type="date" id="inputFecha" />
              </Card.Body>
            </Card>
          </div>
        </div>
  
        <div className="conteinercenter2">
          <Button type="submit" className="boton-personalizado">
            Enviar solicitud
          </Button>
        </div>
      </>
    );
  }
  export default Solitelevisores;
  

