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
      
        <div className="inventario-header">
          <h1 className="Nom_inventario">Inventario</h1>
          <DropdownButton id="dropdown-basic-button" title="Portátiles" className="selector-inventario">
            <Dropdown.Item>Equipos de escritorio</Dropdown.Item>
            <Dropdown.Item>Televisores</Dropdown.Item>
            <Dropdown.Item>Accesorios</Dropdown.Item>
          </DropdownButton>
        </div>
  <div className="Acomodamient001">
        {/* EQUIPOS */}
        <Datos_equipos
          nombre="Lenovo ThinkCentre M720"
          numeroSerie="ABC12345XYZ"
          observaciones="Rayón en la parte trasera"
          componentes={[
            { label: "Procesador", value: "Intel Core i5 12th Gen." },
            { label: "Memoria RAM", value: "16 GB DDR4" },
            { label: "Almacenamiento", value: "SSD 512 GB NVMe" },
            { label: "Tarjeta gráfica", value: "NVIDIA GTX 1650" },
            { label: "Sistema operativo", value: "Windows 10" }
          ]}
        />

        <Datos_equipos
          nombre="HP EliteBook 840"
          numeroSerie="HP998877X"
          observaciones="Teclado presenta fallas"
          componentes={[
            { label: "Procesador", value: "Intel Core i7 10th Gen." },
            { label: "Memoria RAM", value: "8 GB DDR4" },
            { label: "Almacenamiento", value: "SSD 256 GB" },
            { label: "Tarjeta gráfica", value: "Intel UHD Graphics" },
            { label: "Sistema operativo", value: "Windows 11" }
          ]}
        />

        <Datos_equipos
          nombre="Dell Inspiron 15"
          numeroSerie="DELL445522Z"
          observaciones="Pantalla con manchas"
          componentes={[
            { label: "Procesador", value: "AMD Ryzen 5 5600U" },
            { label: "Memoria RAM", value: "16 GB DDR4" },
            { label: "Almacenamiento", value: "HDD 1 TB" },
            { label: "Tarjeta gráfica", value: "Radeon Vega 8" },
            { label: "Sistema operativo", value: "Windows 10 Pro" }
          ]}
        />
      </div>

      <div className="Ajustpagina">
        <Paginas />
      </div>
      <div className="Ajustfooter">
        <Footer />
      </div>
    </>
  );
}

export default Información_equipos;


