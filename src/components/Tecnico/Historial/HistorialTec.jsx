import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './HistorialTec.css';
import Header_HistorialTec from '../header_historialTec/Header_HistorialTec.jsx';
import Footer from '../../Footer/Footer';
function HistorialTec() {
  return (
    <>
    <Header_HistorialTec/>
    <div className='Cuadros' id='cuadrosote'> 

      <div className='h1'>
        <Card className='cuadrito'>
          <Card.Body>
            <Card.Title><h1 className='cua1'>Prestamos</h1></Card.Title>
            <Button href='/Historial_TicketsTec2' className='botoncito'>Seleccionar</Button>
          </Card.Body>
        </Card>
        <Card className='cuadrito'>
          <Card.Body>
            <Card.Title><h1 className='cua1'>Tickets</h1></Card.Title>
            <Button href='/Historial_TicketsTec'className='botoncito'>Seleccionar</Button>
          </Card.Body>
        </Card>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default HistorialTec;