import './ReportarEquipo.css';
import Headerpedidosescritorio from './Header/Header';
import Footer from '../../Footer/Footer';
import ReportarEquipo from './ReportarEquipo';

function Información_equipos() {
  return (
    <>
      <Headerpedidosescritorio />
      
      <div className="informacion-equipos-container">
          <ReportarEquipo />
      </div>

      <div className="Ajustfooter">
        <Footer />
      </div>
    </>
  );
}

export default Información_equipos;


