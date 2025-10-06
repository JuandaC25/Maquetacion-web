import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Cuadro_Pedidos.css';

function Cuadro_Pedidos() {
  return (
    <div className='Cuadrost'> 
      <div className='fila-superiorr'>  
        <Card className="CuadroP0rt">
          <div className="background-effect-port"></div>
          <img src="/imagenes/portatil.png" className="imagen-animada-port" alt="Portátil" />
          <Card.Body>
            <Card.Title className='Tit-001'><h4>Portátiles</h4></Card.Title>
            <Button href='/Solicitar-Portatiles' className='bot00n1'>Seleccionar</Button>
          </Card.Body>
        </Card>
  
        <Card className="CuadroEscr">
          <div className="background-effect-escr"></div>
          <img src="/imagenes/Equipo de escritorio.png" className="imagen-animada-escr" alt="Escritorio" />
          <Card.Body>
            <Card.Title className='Tit-002'><h4>Equipos de escritorio</h4></Card.Title>
            <Button href='/Pedidoescritorio' className='boton_escs'>Seleccionar</Button>
          </Card.Body>
        </Card>
      </div>

      <div className='fila-inferiorr'>      
        <Card className="CuadroTV">
          <div className="background-effect-tv"></div>
          <img src="/imagenes/Televisor.png" className="imagen-animada-tv" alt="Televisor" />
          <Card.Body>
            <Card.Title className='Tit-003'><h4>Televisores</h4></Card.Title>
            <Button href='/Solicitartelevisores' className='boton_TV'>Seleccionar</Button>
          </Card.Body>
        </Card>

        
        <Card className="CuadroElem">
          <div className="background-effect-elem"></div>
          <img src="/imagenes/Accesorios.png" className="imagen-animada-elem" alt="Elementos" />
          <Card.Body>
            <Card.Title className='Tit-004'><h4>Elementos</h4></Card.Title>
            <Button href='/Pedidos_ele' className='boton_elements'>Seleccionar</Button>
          </Card.Body>
        </Card>

      </div>
    </div>
  );
}

export default Cuadro_Pedidos;