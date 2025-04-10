import Breadcrumb from 'react-bootstrap/Breadcrumb';
import './Estilos.css';
import Desplegable from './Desplegable.jsx';
import CuadroPedidos from './Cuadro_pedidos';

function Home() {
  return (
    <div className='Container1'>
      <div className='Encabezado'>
        <div className="HeaderContent">
          <Desplegable />
          <h1 className='Texto1'>Solicitar equipos</h1>
          <div className="Navegacion">
            <Breadcrumb className='Texto2'>
              <Breadcrumb.Item href="http://localhost:5173/Login">Home</Breadcrumb.Item>
              <Breadcrumb.Item href="https://electricidadelectronicaytelecomu.blogspot.com/">Blog CEET</Breadcrumb.Item>
            </Breadcrumb>
            <span className="IconoPerfil">👤</span>
          </div>
        </div>
      </div>
      <CuadroPedidos />
    </div>
  );
}
export default Home;
