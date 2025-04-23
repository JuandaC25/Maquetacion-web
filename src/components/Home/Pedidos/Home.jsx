import './Estilos.css';
import Cuadro_Pedidos from './Cuadro_pedidos';
import Footer from '../../Footer/Footer';
import Headerhome from './Header/Header';
function Home() {
 return (
     <>
     <Headerhome/>
      <Cuadro_Pedidos />
  <div className='Ajusst'>
    <Footer/>
  </div>
  </>
 );
}

export default Home;


