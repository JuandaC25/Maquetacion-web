import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Footer from '../../Footer/Footer';
import ModalPeticion from './modal_informacion_E/Modal2';
import './Info_equipos_tec.css';
import Otromodal from './OTRO.MODAL/Otro_modal';
import Header_informacion from '../header_informacion_E/Header_informacion_E.jsx';
import Carousel from 'react-bootstrap/Carousel';
import Dropdown from 'react-bootstrap/Dropdown';

function Cuarta() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [activeIndex, setActiveIndex] = useState(0); 

  const equiposData = [
    { id: 1, tipo: 'Equipo de escritorio', modelo: 'Hp Victus', imagen: '/imagenes/jacson.png', categoria: 'Equipos escritorio' },
    { id: 2, tipo: 'Equipo de escritorio', modelo: 'Hp Victus', imagen: '/imagenes/jacson.png', categoria: 'Equipos escritorio' },
    { id: 3, tipo: 'Equipo de escritorio', modelo: 'Hp Victus', imagen: '/imagenes/jacson.png', categoria: 'Equipos escritorio' },
    { id: 4, tipo: 'Portatil', modelo: 'Hp Victus', imagen: '/imagenes/pc.png', categoria: 'Portatiles' },
    { id: 5, tipo: 'Portatil', modelo: 'Hp Victus', imagen: '/imagenes/pc.png', categoria: 'Portatiles' },
    { id: 6, tipo: 'Televisor', modelo: 'Samsung 42"', imagen: '/imagenes/tele.jpg', categoria: 'Televisores' },
    { id: 7, tipo: 'Televisor', modelo: 'Samsung 42"', imagen: '/imagenes/tele.jpg', categoria: 'Televisores' },
    { id: 8, tipo: 'Televisor', modelo: 'Samsung 42"', imagen: '/imagenes/tele.jpg', categoria: 'Televisores' },
    { id: 9, tipo: 'Televisor', modelo: 'Samsung 42"', imagen: '/imagenes/tele.jpg', categoria: 'Televisores' },
    { id: 10, tipo: 'Elemento', modelo: 'Teclado Logitech', imagen: '/imagenes/tecla.jpg', categoria: 'Elementos' },
    { id: 11, tipo: 'Elemento', modelo: 'Teclado Logitech', imagen: '/imagenes/teclado.png', categoria: 'Elementos' },
    { id: 12, tipo: 'Elemento', modelo: 'Teclado Logitech', imagen: '/imagenes/tecla.jpg', categoria: 'Elementos' },
    { id: 13, tipo: 'Elemento', modelo: 'Teclado Logitech', imagen: '/imagenes/teclado.png', categoria: 'Elementos' },
    { id: 14, tipo: 'Equipo de escritorio', modelo: 'Dell Optiplex', imagen: '/imagenes/jacson.png', categoria: 'Equipos escritorio' },
    { id: 15, tipo: 'Portatil', modelo: 'Lenovo ThinkPad', imagen: '/imagenes/pc.png', categoria: 'Portatiles' },
    { id: 16, tipo: 'Portatil', modelo: 'Lenovo ThinkPad', imagen: '/imagenes/pc.png', categoria: 'Portatiles' },
  ];

  const [equiposFiltrados, setEquiposFiltrados] = useState(equiposData);

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  const filtrarEquipos = (busqueda, categoria) => {
    const filtrados = equiposData.filter(equipo => {
      const coincideCategoria = categoria ? equipo.categoria === categoria : true;
      const coincideBusqueda = busqueda
        ? equipo.modelo.toLowerCase().includes(busqueda.toLowerCase()) ||
          equipo.tipo.toLowerCase().includes(busqueda.toLowerCase())
        : true;
      return coincideCategoria && coincideBusqueda;
    });
    setEquiposFiltrados(filtrados);
    setActiveIndex(0); 
  };

 
  const dividirEnSlides = (lista, tamaño) => {
    const slides = [];
    for (let i = 0; i < lista.length; i += tamaño) {
      slides.push(lista.slice(i, i + tamaño));
    }
    return slides;
  };

  const slides = dividirEnSlides(equiposFiltrados, 4);

  return (
    
    <div className='suprem'>
      <Header_informacion />
      <div className='carrusel'>
        <div className='dibsi'>
          <input
            className="Cuadro_busc_port"
            placeholder="Buscar..."
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              filtrarEquipos(e.target.value, categoriaSeleccionada);
            }}
          />
          <Dropdown className='Drop_histo'>
            <Dropdown.Toggle variant='outline-dark' id="dropdown-basic" className='oscuro'>
              {categoriaSeleccionada || "Categoría"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => { setCategoriaSeleccionada('Equipos escritorio'); filtrarEquipos(searchTerm, 'Equipos escritorio'); }}>Equipos escritorio</Dropdown.Item>
              <Dropdown.Item onClick={() => { setCategoriaSeleccionada('Portatiles'); filtrarEquipos(searchTerm, 'Portatiles'); }}>Portatiles</Dropdown.Item>
              <Dropdown.Item onClick={() => { setCategoriaSeleccionada('Televisores'); filtrarEquipos(searchTerm, 'Televisores'); }}>Televisores</Dropdown.Item>
              <Dropdown.Item onClick={() => { setCategoriaSeleccionada('Elementos'); filtrarEquipos(searchTerm, 'Elementos'); }}>Elementos</Dropdown.Item>
              <Dropdown.Item onClick={() => { setCategoriaSeleccionada(''); filtrarEquipos(searchTerm, ''); }}>Todos</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Carousel 
          data-bs-theme="dark" 
          activeIndex={activeIndex} 
          onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
        >
          {slides.length === 0 ? (
            <Carousel.Item>
              <div className="carrusel_1">
                <p style={{ margin: 'auto' }}>No se encontraron equipos.</p>
              </div>
            </Carousel.Item>
          ) : (
            slides.map((grupo, index) => (
              <Carousel.Item key={index}>
                <div className='carrusel_1'>
                  {grupo.map(equipo => (
                    <div key={equipo.id} className='reportes'>
                      <h4 className='oter'>DETALLES DEL EQUIPO</h4>
                      <div className='pcesito'>
                        <img src={equipo.imagen} alt="equipo" className='comp' />
                      </div>
                      <h5>{equipo.tipo}</h5>
                      <h5 className='izquierdita'>Modelo equipo:</h5><h6>{equipo.modelo}</h6>
                      <Button className='buttoninfo' onClick={abrirModal}>Abrir</Button>
                    </div>
                  ))}
                </div>
              </Carousel.Item>
            ))
          )}
        </Carousel>

        <ModalPeticion show={mostrarModal} onHide={cerrarModal} />
      </div>
      <Footer />
      </div>
    
  );
}

export default Cuarta;
