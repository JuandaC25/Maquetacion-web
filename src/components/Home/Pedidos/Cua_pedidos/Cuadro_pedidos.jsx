import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Cuadro_Pedidos.css';

function Cuadro_Pedidos() {
  return (
    <div className='Cuadros'> 
      <div className='fila-superior'>
        <Card className='cuadro1'>
          <Card.Body>
            <Card.Title><h1 className='portatiles'>Portátiles</h1></Card.Title>
            <Button href='/Solicitar-Portatiles' className='boton1'>Seleccionar</Button>
          </Card.Body>
        </Card>
        <Card className='cuadro2'>
          <Card.Body>
            <Card.Title><h2 className='escritorio'>Equipos de escritorio</h2></Card.Title>
            <Button href='/Pedidoescritorio'className='boton_esc'>Seleccionar</Button>
          </Card.Body>
        </Card>
      </div>
      <div className='fila-inferior'>
        <Card className='cuadro3'>
          <Card.Body>
            <Card.Title><h1 className='televisores'>Televisores</h1></Card.Title>
            <Button href='/Solicitartelevisores' className='boton_TV'>Seleccionar</Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Cuadro_Pedidos;
