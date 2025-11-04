import './informacion_equipos.css';
import Headerpedidosescritorio from './Header/Header';
import Footer from '../../Footer/Footer';
import ReportarEquipo from '../ReportarEquipo/ReportarEquipo';

function Información_equipos() {
  return (
    <>
      <Headerpedidosescritorio />
      
      <div className="informacion-equipos-container">
        <div className="formulario-reporte-wrapper">
          <ReportarEquipo />
        </div>
      </div>

      <div className="Ajustfooter">
        <Footer />
      </div>
    </>
  );
}

export default Información_equipos;


