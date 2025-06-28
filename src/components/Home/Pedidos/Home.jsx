import Cuadro_Pedidos from './Cua_pedidos/Cuadro_pedidos';
import Footer from '../../Footer/Footer';
import Header from './Header/Header';
import "./Estilos.css";

function Home() {
 return (
     <>
     <Header/>
      <Cuadro_Pedidos />
  <div className='ajustarfoter'>
    <Footer/>
  </div>
  </>
 );
}

export default Home;