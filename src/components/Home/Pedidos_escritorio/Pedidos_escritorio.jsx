import './Pedidos_escritorio.css';
import Button from 'react-bootstrap/Button';
import Datos_escritorio from './Datos_escritorio'

function Pedidos_escritorio() {
  return (
  <>
<div className="Usu-container">

  <h1 className="Hea_home1">Solicitar equipos de escritorio</h1>

  <div className="custom-buttons-container2">
    <Button variant="custom-1">Home</Button>
    <div className="vertical-line" />
    <Button variant="custom-2">Blog CEET</Button>
  </div>
</div>
<Datos_escritorio/>
  </>
  );
}

export default Pedidos_escritorio;