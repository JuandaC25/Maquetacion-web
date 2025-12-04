import './ReportarEquipo.css';
import Header from '../../common/Header/Header';
import Footer from '../../Footer/Footer';
import ReportarEquipo from './ReportarEquipo';

function Información_equipos() {
  return (
    <>
      <Header title="Información de equipos" />
      
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


