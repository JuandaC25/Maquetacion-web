import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Footer from '../../Footer/Footer';
import ModalPeticion from './modal_informacion_E/Modal2'; // ahora recibe ticket y elementos
import './Info_equipos_tec.css';
import Otromodal from './OTRO.MODAL/Otro_modal';
import Header_informacion from '../header_informacion_E/Header_informacion_E.jsx';
import Carousel from 'react-bootstrap/Carousel';
import Dropdown from 'react-bootstrap/Dropdown';

function Cuarta() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null); // ticket seleccionado
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [ticketsData, setTicketsData] = useState([]);
  const [ticketsFiltrados, setTicketsFiltrados] = useState([]);
  const [elementos, setElementos] = useState([]);

  const categoriasDropdown = ['Equipo de mesa', 'Portátiles', 'Televisores', 'Accesorios'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketsRes = await fetch('http://localhost:8081/api/tickets');
        const ticketsJson = await ticketsRes.json();
        setTicketsData(ticketsJson);
        setTicketsFiltrados(ticketsJson);

        const elementosRes = await fetch('http://localhost:8081/api/elementos');
        const elementosJson = await elementosRes.json();
        setElementos(elementosJson);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    fetchData();
  }, []);

  const abrirModal = (ticket) => {
    setTicketSeleccionado(ticket);
    setMostrarModal(true);
  };
  const cerrarModal = () => setMostrarModal(false);

  const filtrarTickets = (busqueda, categoria) => {
    const filtrados = ticketsData.filter(ticket => {
      const elemento = elementos.find(e => e.id_elemen === ticket.id_eleme);
      const categoriaElem = elemento ? elemento.tip_catg : '';
      const coincideCategoria = categoria ? categoriaElem === categoria : true;
      const coincideBusqueda = busqueda
        ? ticket.nom_elem?.toLowerCase().includes(busqueda.toLowerCase())
        : true;
      return coincideCategoria && coincideBusqueda;
    });
    setTicketsFiltrados(filtrados);
    setActiveIndex(0);
  };

  const dividirEnSlides = (lista, tamaño) => {
    const slides = [];
    for (let i = 0; i < lista.length; i += tamaño) {
      slides.push(lista.slice(i, i + tamaño));
    }
    return slides;
  };

  const slides = dividirEnSlides(ticketsFiltrados, 4);

  return (
    <div className='suprem'>
      <Header_informacion />
      <div className='carrusel'>
        <div className='dibsi'>
          <input
            className="Cuadro_busc_port"
            placeholder="Buscar por nombre..."
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              filtrarTickets(e.target.value, categoriaSeleccionada);
            }}
          />
          <Dropdown className='Drop_histo'>
            <Dropdown.Toggle variant='outline-dark' id="dropdown-basic" className='oscuro'>
              {categoriaSeleccionada || "Categoría"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {categoriasDropdown.map(cat => (
                <Dropdown.Item
                  key={cat}
                  onClick={() => { setCategoriaSeleccionada(cat); filtrarTickets(searchTerm, cat); }}
                >
                  {cat}
                </Dropdown.Item>
              ))}
              <Dropdown.Item onClick={() => { setCategoriaSeleccionada(''); filtrarTickets(searchTerm, ''); }}>
                Todos
              </Dropdown.Item>
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
                <p style={{ margin: 'auto' }}>No se encontraron tickets.</p>
              </div>
            </Carousel.Item>
          ) : (
            slides.map((grupo, index) => (
              <Carousel.Item key={index}>
                <div className='carrusel_1'>
                  {grupo.map(ticket => {
                    const elemento = elementos.find(e => e.id_elemen === ticket.id_eleme);
                    const categoriaElem = elemento ? elemento.tip_catg : '';
                    return (
                      <div key={ticket.id_tickets} className='reportes'>
                        <h4 className='oter'>{ticket.nom_elem}</h4>
                        <div className='pcesito'>
                          <img src="/imagenes/ticket.png" alt="ticket" className='comp' />
                        </div>
                        <h5>Ambiente:</h5>
                        <h6>{ticket.ambient}</h6>
                        <h5>Categoría:</h5>
                        <h6>{categoriaElem}</h6>
                        <Button className='buttoninfo' onClick={() => abrirModal(ticket)}>Abrir</Button>
                      </div>
                    );
                  })}
                </div>
              </Carousel.Item>
            ))
          )}
        </Carousel>

        <ModalPeticion 
          show={mostrarModal} 
          onHide={cerrarModal} 
          ticket={ticketSeleccionado} 
          elementos={elementos} 
        />
      </div>
      <Footer />
    </div>
  );
}

export default Cuarta;
