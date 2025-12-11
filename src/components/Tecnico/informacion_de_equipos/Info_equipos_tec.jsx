import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Footer from '../../Footer/Footer';
import ModalPeticion from './modal_informacion_E/Modal2'; // ahora recibe ticket y elementos
import './Info_equipos_tec.css';
import Otromodal from './OTRO.MODAL/Otro_modal';
import Header_soli_equi_tec from '../header_solicitudes_equ_tec/Header_soli_equi_tec.jsx';
import Carousel from 'react-bootstrap/Carousel';
import Dropdown from 'react-bootstrap/Dropdown';
import { authorizedFetch } from '../../../api/http';

function Cuarta() {
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
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

  // ...eliminado categoriasDropdown...

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Obteniendo tickets pendientes...');
        const ticketsRes = await authorizedFetch('/api/tickets/pendientes');
        console.log('Status:', ticketsRes.status);
        
        if (!ticketsRes.ok) {
          throw new Error(`HTTP error! status: ${ticketsRes.status}`);
        }
        
        const ticketsJson = await ticketsRes.json();
        console.log('Tickets obtenidos:', ticketsJson);
        console.log('Primer ticket estructura:', JSON.stringify(ticketsJson[0], null, 2));
        
        // Obtiene solo tickets con estado 2 (pendiente)
        setTicketsData(ticketsJson);
        setTicketsFiltrados(ticketsJson);

        const elementosRes = await authorizedFetch('/api/elementos');
        const elementosJson = await elementosRes.json();
        console.log('Elementos obtenidos:', elementosJson);
        console.log('Primer elemento estructura completa:', JSON.stringify(elementosJson[0], null, 2));
        console.log('Keys del primer elemento:', elementosJson[0] ? Object.keys(elementosJson[0]) : 'sin datos');
        setElementos(elementosJson);

        // Extraer categorías únicas de los tickets
        const categoriasMap = ticketsJson
          .map((ticket, idx) => {
            // Primero intentar usar nom_cat si existe
            if (ticket.nom_cat) {
              console.log(`[Ticket Pendiente ${idx}] tiene nom_cat: ${ticket.nom_cat}`);
              return ticket.nom_cat;
            }
            
            // Si no, buscar por elemento
            console.log(`[Ticket Pendiente ${idx}] Buscando elemento con id_eleme: ${ticket.id_eleme}`);
            console.log(`[Ticket Pendiente ${idx}] IDs de elementos disponibles:`, elementosJson.map(e => e.id_elemen));
            const elemento = elementosJson.find(el => el.id_elemen === ticket.id_eleme);
            if (elemento) {
              console.log(`[Ticket Pendiente ${idx}] Elemento encontrado:`, elemento);
              return elemento.tip_catg || elemento.nom_cat || null;
            } else {
              console.log(`[Ticket Pendiente ${idx}] NO se encontró elemento para id_eleme: ${ticket.id_eleme}`);
              return null;
            }
          })
          .filter(cat => cat);
        const categoriasUnicas = [...new Set(categoriasMap)];
        console.log('Categorías extraídas:', categoriasUnicas);
        setCategorias(categoriasUnicas);

        // Extraer subcategorías únicas de los elementos
        const subcategoriasMap = elementosJson
          .map(elem => elem.sub_catg || elem.subcategoria || elem.nom_subc || null)
          .filter(subcat => subcat);
        const subcategoriasUnicas = [...new Set(subcategoriasMap)];
        console.log('Subcategorías extraídas:', subcategoriasUnicas);
        setSubcategorias(subcategoriasUnicas);
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
      <Header_soli_equi_tec title="Información de Equipos" />
      <div className='carrusel'>
        <div className="barra-filtros">
          <select value={categoriaSeleccionada} onChange={e => {
            setCategoriaSeleccionada(e.target.value);
            filtrarTickets(searchTerm, e.target.value, subcategoriaSeleccionada);
          }}>
            <option value="">Todos</option>
            {categorias.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
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
              {subcategorias.map((subcat, i) => (
                <Dropdown.Item key={i} onClick={() => { setSubcategoriaSeleccionada(subcat); filtrarTickets(searchTerm, categoriaSeleccionada, subcat); }} style={{ color: '#00AF00', fontWeight: 500, background: '#fff' }}>
                  {subcat}
                </Dropdown.Item>
              ))}
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
                <p style={{ margin: 'auto' }}>No se encontraron tickets.</p>
              </div>
            </Carousel.Item>
          ) : (
            slides.map((grupo) => (
              <Carousel.Item key={grupo[0]?.id_tickets || Math.random()}>
                <div className='carrusel_1'>
                  {grupo.map(ticket => {
                    const elemento = elementos.find(e => e.id_elemen === ticket.id_eleme);
                    const categoriaElem = elemento ? elemento.tip_catg : '';
                    
                    // Extraer imágenes del atributo imageness
                    const obtenerImagenes = () => {
                      if (!ticket.imageness) {
                        return [];
                      }
                      
                      try {
                        let imagenes = [];
                        
                        // Si es string
                        if (typeof ticket.imageness === 'string') {
                          // Si comienza con [ o {, es JSON
                          if (ticket.imageness.trim().startsWith('[') || ticket.imageness.trim().startsWith('{')) {
                            try {
                              imagenes = JSON.parse(ticket.imageness);
                            } catch (e) {
                              imagenes = [ticket.imageness];
                            }
                          } else {
                            // Es una URL o base64 directo
                            imagenes = [ticket.imageness];
                          }
                        } else if (Array.isArray(ticket.imageness)) {
                          imagenes = ticket.imageness;
                        } else if (typeof ticket.imageness === 'object') {
                          imagenes = [ticket.imageness];
                        }
                        
                        return imagenes;
                      } catch (e) {
                        console.error('Error al procesar imageness:', e);
                        return [];
                      }
                    };
                    
                    const imagenes = obtenerImagenes();
                    const imagenPrincipal = imagenes.length > 0 ? imagenes[0] : null;
                    
                    // Logging para debug
                    if (imagenPrincipal) {
                      const urlFinal = imagenPrincipal.startsWith('data:') 
                        ? 'data:...' 
                        : imagenPrincipal.startsWith('http')
                        ? imagenPrincipal
                        : `http://localhost:8081${imagenPrincipal}`;
                      console.log(`[${ticket.id_tickets}] imagenPrincipal original:`, imagenPrincipal);
                      console.log(`[${ticket.id_tickets}] URL final a cargar:`, urlFinal);
                    }
                    
                    return (
                      <div key={ticket.id_tickets} className='reportes'>
                        <h4 className='oter'>{ticket.nom_elem}</h4>
                        <div className='pcesito'>
                          {imagenPrincipal ? (
                            <img 
                              src={
                                imagenPrincipal.startsWith('data:') 
                                  ? imagenPrincipal 
                                  : imagenPrincipal.startsWith('http')
                                  ? imagenPrincipal
                                  : `http://localhost:8081${imagenPrincipal}`
                              } 
                              alt="ticket" 
                              className='comp'
                              onError={(e) => {
                                console.log(`[ERROR] Fallo al cargar imagen: ${e.target.src}`);
                                if (e.target.getAttribute('data-fallback') !== 'true') {
                                  console.log(`[INTENTO] Cargando placeholder...`);
                                  e.target.src = '/imagenes/ticket.png';
                                  e.target.setAttribute('data-fallback', 'true');
                                } else {
                                  console.log(`[FALLBACK] Mostrando texto "No hay imagen"`);
                                  // Reemplazar imagen con div de texto
                                  const container = e.target.parentElement;
                                  container.innerHTML = `
                                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 0.95rem; font-weight: 500;">
                                      No hay imagen
                                    </div>
                                  `;
                                }
                              }}
                            />
                          ) : (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              height: '100%',
                              color: '#999',
                              fontSize: '0.95rem',
                              fontWeight: '500'
                            }}>
                              No hay imagen
                            </div>
                          )}
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

        {/* Paginación visual del carrusel */}
        {slides.length > 1 && (
          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <span style={{ fontWeight: 500, fontSize: '1.1rem', color: '#00AF00' }}>
              Página {activeIndex + 1} de {slides.length}
            </span>
          </div>
        )}

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
