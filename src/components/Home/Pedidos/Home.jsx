import './Estilos.css';
import Button from 'react-bootstrap/Button';
import Cuadro_Pedidos from './Cuadro_pedidos';

function Home() {
  return (
    <>
      <div className="Usu-container">
        <h1 className="Hea_home1">Solicitar equipos</h1>
        <div className="custom-buttons-container2">
          <Button variant="custom-1">Home</Button>
          <div className="vertical-line" /> 
          <Button variant="custom-2">Blog CEET</Button>
        </div>
      </div>
      <Cuadro_Pedidos /> 
    </>
  );
}

export default Home;


