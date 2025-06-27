import { Link } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import './Soli_port.css';
import Footer from '../../Footer/Footer.jsx';
import Header_port from './Header/Header.jsx';
const ConsultaItem = () => {

  return (
    <div className="ticket-item2">
      <div className="izquierda2">
        <div className="icono" role="img" aria-label="computadora">🖥️</div>
        <div className="estado1">
          <span>Detalles del equipo</span>
        </div>
      </div>
      <div className="derecha1">
      <Link to="/Formulario" className="btn btn-primary Buton_Fomr">Ver</Link>
      </div>
    </div>
  );
};

const ListaConsultas = () => {
  const elementos = new Array(8).fill(null); 
  return (
    <div name="lista-inventario1">
      {elementos.map((_, i) => (
        <ConsultaItem key={i} />
      ))}

    <div id="piepor">
    <Pagination>
      <Pagination.Prev/>
      <Pagination.Item  id="font">{1}</Pagination.Item>
      <Pagination.Item id="font">{2}</Pagination.Item>
      <Pagination.Item id="font">{3}</Pagination.Item>
      <Pagination.Ellipsis />
      <Pagination.Item  id="font">{10}</Pagination.Item>
      <Pagination.Next />
    </Pagination >
    </div>
    </div>
  );
};

function Soli_Port() {
  return (
    <div className="Usu-container1">
      <div className='general2'>
        <Header_port/>
      </div>
      <ListaConsultas />
      <Footer/>
    </div>
  );
}

export default Soli_Port;
