import './informacion_equipos.css';
import Datos_equipos from './Datos_equipos';
import Headerpedidosescritorio from './Header/Header';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Paginas from './Paginas';
import Footer from '../../Footer/Footer';

function Información_equipos() {
  return (
    <>
   

      <Headerpedidosescritorio />
      <div className='Blanco'>
        <div className="inventario-header">
          <h1 className="Nom_inventario">Inventario</h1>
          <DropdownButton id="dropdown-basic-button" title="Portátiles" className="selector-inventario">
            <Dropdown.Item>Equipos de escritorio</Dropdown.Item>
            <Dropdown.Item>Televisores</Dropdown.Item>
          </DropdownButton>
        </div>
        <Datos_equipos />
        <Datos_equipos />
        <Datos_equipos />
        <Datos_equipos />
        <Datos_equipos />

</div>
<div className='Ajustpagina'>
      <Paginas/>
</div>
<div className='Ajustfooter'>
      <Footer/>
</div>

    </>
  );
}

export default Información_equipos;

