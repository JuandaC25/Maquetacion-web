import Breadcrumb from 'react-bootstrap/Breadcrumb';
import './Estilos.css';
import Desplegable from './Desplegable.jsx';
import CuadroPedidos from './Cuadro_pedidos';

function Home() {
  return (
    <div className='Container1'>
      <div id='Encabezado'>
      <div className="header-row">
      <Desplegable />
        <h1 className='Texto1'>
          HEADER
        </h1>
        <div id='Elementos'>
          <Breadcrumb className='Texto2'>
            <Breadcrumb.Item href="http://localhost:5173/Login">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="https://electricidadelectronicaytelecomu.blogspot.com/">Blogceet</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        </div>
      </div>
      <CuadroPedidos />
    </div>
  );
}
export default Home;