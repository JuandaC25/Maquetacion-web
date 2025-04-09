import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function Cuadro_Pedidos() {
  return (
    <div className='Cuadros'> 
      <div className='fila-superior'>
        <Card className='cuadro'>
          <Card.Body>
            <Card.Title><h1>Portátiles</h1></Card.Title>

            

            <Button href='/Solicitar-Portatiles'>Seleccionar</Button>

          </Card.Body>
        </Card>
        <Card className='cuadro'>
          <Card.Body>
            <Card.Title><h2>Equipos de escritorio</h2></Card.Title>
            <Button className='boton_esc'>Seleccionar</Button>
          </Card.Body>
        </Card>
      </div>
      <div className='fila-inferior'>
        <Card className='cuadro'>
          <Card.Body>
            <Card.Title><h1>Televisores</h1></Card.Title>
            <Button className='boton_TV'>Seleccionar</Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Cuadro_Pedidos;
