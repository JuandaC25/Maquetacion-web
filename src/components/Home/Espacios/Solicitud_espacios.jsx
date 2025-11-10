import Datos_espacio from './Datos_espacio';
import "./Solicitud_espacios.css";
import CrearEspacio from './Crear_espacio/Crear_espacio';
import Footer from '../../Footer/Footer';
import Headerespacios from './Header/Header';

function Soliespacios() {
  return (
    <>
      <Headerespacios/>
      <Datos_espacio />
      <CrearEspacio />
      <div className=' Ajustfot'>
        <Footer/>
      </div>
    </>
  );
}

export default Soliespacios;
