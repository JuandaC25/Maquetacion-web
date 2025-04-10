import './Estilos.css';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Button from 'react-bootstrap/Button';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import Alert from 'react-bootstrap/Alert';
import Cuadro_Pedidos from './Cuadro_pedidos';

function Home() {
  return (
    <div className="admin-container">
      <div className="icon-container">
      </div>
      <h1>Solicitar equipos</h1>
      <div className="custom-buttons-container">
        <Button variant="custom-1">Home</Button>
        <Button variant="custom-2">Blog CEET</Button>
        <div className="custom-3-container">
          <FaUserCircle />
        </div>
      </div>
      <Cuadro_Pedidos />
    </div>
  );
}

export default Home;


