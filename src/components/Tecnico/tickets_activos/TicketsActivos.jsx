import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Footer from '../../Footer/Footer';
import ModalTicketsActivos from './ModalTicketsActivos';
import '../informacion_de_equipos/Info_equipos_tec.css';
import Otromodal from '../informacion_de_equipos/OTRO.MODAL/Otro_modal';
import HeaderTicketsActivos from '../header_tickets_activos/header_tickets_activos.jsx';
import Carousel from 'react-bootstrap/Carousel';
import Dropdown from 'react-bootstrap/Dropdown';
import { authorizedFetch } from '../../../api/http';

function TicketsActivos() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null); // ticket seleccionado
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [ticketsData, setTicketsData] = useState([]);
  const [ticketsFiltrados, setTicketsFiltrados] = useState([]);
  const [elementos, setElementos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Obteniendo tickets activos...');
        // Solo obtener tickets activos con autenticación
        const ticketsRes = await authorizedFetch('/api/tickets/activos');
        console.log('Status:', ticketsRes.status);
        
        if (!ticketsRes.ok) {
          throw new Error(`HTTP error! status: ${ticketsRes.status}`);
        }
        
        const ticketsJson = await ticketsRes.json();
        console.log('Tickets activos obtenidos:', ticketsJson);
        setTicketsData(ticketsJson);
        setTicketsFiltrados(ticketsJson);

        const elementosRes = await authorizedFetch('/api/elementos');
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

  const actualizarTicketsDespuesDeReporte = async () => {
    // Recargar los tickets después de cambiar el estado
    try {
      const ticketsRes = await authorizedFetch('/api/tickets/activos');
      if (ticketsRes.ok) {
        const ticketsJson = await ticketsRes.json();
        setTicketsData(ticketsJson);
        setTicketsFiltrados(ticketsJson);
      }
    } catch (error) {
      console.error('Error al recargar tickets:', error);
    }
    cerrarModal();
  };

  const filtrarTickets = (busqueda, categoria, subcategoria) => {
    const filtrados = ticketsData.filter(ticket => {
      const elemento = elementos.find(e => e.id_elemen === ticket.id_eleme);
      const categoriaElem = elemento ? elemento.tip_catg : '';
      const coincideCategoria = categoria ? categoriaElem === categoria : true;
      const coincideSubcategoria = subcategoria ? elemento?.subcategoria === subcategoria : true;
      const coincideBusqueda = busqueda
        ? ticket.nom_elem?.toLowerCase().includes(busqueda.toLowerCase())
        : true;
      return coincideCategoria && coincideSubcategoria && coincideBusqueda;
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
      <HeaderTicketsActivos />
      <div className='carrusel'>
        <div className="barra-filtros">
          <select value={categoriaSeleccionada} onChange={e => {
            setCategoriaSeleccionada(e.target.value);
            filtrarTickets(searchTerm, e.target.value, subcategoriaSeleccionada);
          }}>
            <option value="">Todos</option>
            <option value="Equipo de mesa">Equipo de mesa</option>
            <option value="Portátiles">Portátiles</option>
            <option value="Televisores">Televisores</option>
            <option value="Accesorios">Accesorios</option>
          </select>

          <Dropdown className='Drop_histo' style={{ margin: 0, padding: 0, alignSelf: 'center' }}>
            <Dropdown.Toggle 
              variant='outline-dark' 
              id="dropdown-basic" 
              className='oscuro'
              style={{
                background: '#fff',
                color: '#00AF00',
                border: 'none',
                borderRadius: '8px',
                boxShadow: 'none',
                fontWeight: 500,
                fontSize: '1rem',
                padding: '0.4rem 1.2rem',
                minWidth: '160px',
                margin: 0,
                transition: 'border-color 0.2s',
              }}
            >
              {subcategoriaSeleccionada || "Subcategoría"}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ borderRadius: '8px', border: '1px solid #00AF00', boxShadow: 'none', background: '#fff' }}>
              <Dropdown.Item onClick={() => { setSubcategoriaSeleccionada(''); filtrarTickets(searchTerm, categoriaSeleccionada, ''); }} style={{ color: '#00AF00', fontWeight: 500, background: '#fff' }}>
                Todas las subcategorías
              </Dropdown.Item>
              <Dropdown.Item onClick={() => { setSubcategoriaSeleccionada('Subcat 1'); filtrarTickets(searchTerm, categoriaSeleccionada, 'Subcat 1'); }} style={{ color: '#00AF00', fontWeight: 500, background: '#fff' }}>
                Subcat 1
              </Dropdown.Item>
              <Dropdown.Item onClick={() => { setSubcategoriaSeleccionada('Subcat 2'); filtrarTickets(searchTerm, categoriaSeleccionada, 'Subcat 2'); }} style={{ color: '#00AF00', fontWeight: 500, background: '#fff' }}>
                Subcat 2
              </Dropdown.Item>
              <Dropdown.Item onClick={() => { setSubcategoriaSeleccionada('Subcat 3'); filtrarTickets(searchTerm, categoriaSeleccionada, 'Subcat 3'); }} style={{ color: '#00AF00', fontWeight: 500, background: '#fff' }}>
                Subcat 3
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              filtrarTickets(e.target.value, categoriaSeleccionada, subcategoriaSeleccionada);
            }}
          />

          <div className="rango-fechas-min">
            <label>Desde:</label>
            <input type="date" value={fechaInicio} onChange={e => { setFechaInicio(e.target.value); filtrarTickets(searchTerm, categoriaSeleccionada, subcategoriaSeleccionada); }} />
            <label>Hasta:</label>
            <input type="date" value={fechaFin} onChange={e => { setFechaFin(e.target.value); filtrarTickets(searchTerm, categoriaSeleccionada, subcategoriaSeleccionada); }} />
          </div>
        </div>


        <Carousel 
          data-bs-theme="dark" 
          activeIndex={activeIndex} 
          onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
          nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" style={{ filter: 'invert(38%) sepia(99%) saturate(1000%) hue-rotate(90deg) brightness(1.2)', width: '48px', height: '48px', margin: 'auto' }} />}
          prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon" style={{ filter: 'invert(38%) sepia(99%) saturate(1000%) hue-rotate(90deg) brightness(1.2)', width: '48px', height: '48px', margin: 'auto' }} />}
          indicators={false}
          className="carrusel-centro"
        >
          {slides.length === 0 ? (
            <Carousel.Item>
              <div className="carrusel_1">
                <p style={{ margin: 'auto' }}>No se encontraron tickets activos.</p>
              </div>
            </Carousel.Item>
          ) : (
            slides.map((grupo) => (
              <Carousel.Item key={grupo[0]?.id_tickets || Math.random()}>
                <div className='carrusel_1'>
                  {grupo.map(ticket => {
                    const elemento = elementos.find(e => e.id_elemen === ticket.id_eleme);
                    const categoriaElem = elemento ? elemento.tip_catg : '';
                    
                    // Extraer imagen del atributo imageness
                    const obtenerPrimeraImagen = () => {
                      if (!ticket || !ticket.imageness) return null;
                      try {
                        if (typeof ticket.imageness === 'string' && ticket.imageness.startsWith('[')) {
                          const imagenes = JSON.parse(ticket.imageness);
                          console.log('Imágenes parseadas de JSON:', imagenes);
                          return imagenes[0];
                        }
                        console.log('imageness value:', ticket.imageness);
                        return Array.isArray(ticket.imageness) ? ticket.imageness[0] : ticket.imageness;
                      } catch (e) {
                        console.error('Error parseando imageness:', e, 'valor:', ticket.imageness);
                        return null;
                      }
                    };
                    
                    const imagen = obtenerPrimeraImagen();
                    console.log('Primera imagen:', imagen);
                    const imagenUrl = imagen 
                      ? (imagen.startsWith('data:') || imagen.startsWith('http') 
                          ? imagen 
                          : `http://localhost:8081${imagen}`)
                      : null;
                    console.log('URL final:', imagenUrl);
                    
                    return (
                      <div key={ticket.id_tickets || ticket.id} className='reportes'>
                        <h4 className='oter'>{ticket.nom_elem}</h4>
                        <div className='pcesito'>
                          {imagenUrl ? (
                            <img src={imagenUrl} alt={ticket.nom_elem || 'Ticket'} className='comp' onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<p style="color:#999;text-align:center;">Sin imagen</p>'; }} />
                          ) : (
                            <p style={{ color: '#999', textAlign: 'center', margin: 'auto' }}>Sin imagen disponible</p>
                          )}
                        </div>
                        <h5>Ambiente:</h5>
                        <h6>{ticket.ambiente || ticket.ambient || 'No registrado'}</h6>
                        <h5>Categoría:</h5>
                        <h6>{categoriaElem}</h6>
                        <Button className='buttoninfo' onClick={() => abrirModal(ticket)}>Reportar</Button>
                      </div>
                    );
                  })}
                </div>
              </Carousel.Item>
            ))
          )}
        </Carousel>

        {/* Paginación visual del carrusel */}
        {slides.length > 1 && (
          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <span style={{ fontWeight: 500, fontSize: '1.1rem', color: '#00AF00' }}>
              Página {activeIndex + 1} de {slides.length}
            </span>
          </div>
        )}

        <ModalTicketsActivos 
          show={mostrarModal} 
          onHide={cerrarModal} 
          ticket={ticketSeleccionado} 
          elementos={elementos}
          onTicketUpdated={actualizarTicketsDespuesDeReporte}
        />
      </div>
      <Footer />
    </div>
  );
}

export default TicketsActivos;
