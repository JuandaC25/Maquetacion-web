import './Pedidos_escritorio.css';
import Datos_escritorio from './Datos_escritorio'
import Footer from '../../Footer/Footer';
import Headerpedidosescritorio from './Header/Header';
function Pedidos_escritorio() {
  return (
  <>
<Headerpedidosescritorio/>
<Datos_escritorio/>
<div className='Ajust'>
<Footer/>
</div>
  </>
  );
}

export default Pedidos_escritorio;  