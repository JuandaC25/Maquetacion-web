/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react';
import './Soli_port.css';
import Footer from '../../Footer/Footer.jsx';
import Header_port from './Header soli/Header.jsx';
import Modal_com_port from './Modal_comp_port.jsx';
import { Modal, Button, Pagination, Form, Carousel } from 'react-bootstrap';


const ConsultaItem = ({ onAddClick, equipoDetalles, equipoAnadido }) => {

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick(equipoDetalles);
    }
  };

  const Imagenes_portatiles = [
    'imagenes/imagenes_port/portatil1.png',
    'imagenes/imagenes_port/portatil2.png',
    'imagenes/imagenes_port/portatil3.png',
    'imagenes/imagenes_port/portatil4.png',
    'imagenes/imagenes_port/portatil5.png',
    'imagenes/imagenes_port/portatil6.png'
  ];

  return (
    <div className={`card_port ${equipoAnadido ? 'Card_agregado' : ''}`}>
      <div className='Cua_port'>
        <div>
          <Carousel indicators={false} controls={false} interval={3000}>
            {Imagenes_portatiles.map((imagen, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100 carrusel_img_port"
                  src={imagen}
                  alt={`Diapositiva ${index + 1}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
        <div className='espa_text_port'>
          <span className="title">{equipoDetalles.name}</span>
          <Modal_com_port />
          <Button
            variant="primary"
            className='Btn_añadir_port'
            onClick={handleAddClick}
            disabled={equipoAnadido}
          >
            Añadir equipo
          </Button>
        </div>
      </div>
    </div>
  );
};


const ListaConsultas = () => {
  // Estado para el modal de la lista de equipos
  const [showModal, setShowModal] = useState(false);
  // Estado para el modal de limite alcanzado
  const [showLimitModal, setShowLimitModal] = useState(false);
  // Estado para la lista de equipos añadido
  const [equiposAnadidos, setequiposAnadidos] = useState([]);
  // Funcion para abrir y cerrar el modal principal
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  // Funciones para abrir y cerar el modal de limite
  const handleShowLimitModal = () => setShowLimitModal(true);
  const handleCloseLimitModal = () => setShowLimitModal(false);

  // Añadir los equipos con el limte de 3 por solicitud
  const equiposPortAdd = (detallesEquipo) => {
    if (equiposAnadidos.length >= 3) {
      handleShowLimitModal();
      return;
    }

    //verificacion de si hay dos equipos duplicados en la lista de los pedidos
    const equipoYaAnadido = equiposAnadidos.some(team => team.id === detallesEquipo.id);
    if (!equipoYaAnadido) {
      setequiposAnadidos(prevTeams => [...prevTeams, detallesEquipo]);
    }
  };

  //eliminar equipo en el modal 
  const handleRemoveTeam = (teamId) => {
    setequiposAnadidos(prevTeams => prevTeams.filter(team => team.id !== teamId));
  };

  const equiposData = [
    { id: 1, name: 'Portátil HP 15.6" Pulgadas' },
    { id: 2, name: 'MacBook Air 13"' },
    { id: 3, name: 'Lenovo IdeaPad' },
    { id: 4, name: 'Dell XPS 13"' },
    { id: 5, name: 'Asus VivoBook' },
  ];

  return (
    <div className='cuer-inve'>
      <div className='Elementos_arriba'>
        <div className="Grupo_buscador">
          <input type="text" className="Cuadro_busc_port" placeholder="Buscar..."></input>
          <svg className="btn_buscar" aria-hidden="true" viewBox="0 0 24 24">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
        </div>
        <div className='Boton_campana'>
          <button className="Boton_campanita" onClick={handleShow}>
            <svg viewBox="0 0 448 512" className="Campanita"><path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></svg>
            {equiposAnadidos.length > 0 && (
              <span className="Noti_agregado">{equiposAnadidos.length}</span>
            )}
          </button>
        </div>
      </div>

      <div name="lista-inventario1">
        {equiposData.map((equipo) => (
          <ConsultaItem
            key={equipo.id}
            equipoDetalles={equipo}
            onAddClick={equiposPortAdd}
            equipoAnadido={equiposAnadidos.some(team => team.id === equipo.id)}
          />
        ))}
      </div>

    

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton className='Btn_cerrar_mdl_add'>
          <Modal.Title>Equipos agregados</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {equiposAnadidos.length > 0 ? (
            <ul>
              {equiposAnadidos.map(team => (
                <li key={team.id} className="Lista_equipos_add">
                  {team.name}
                  
                  <Button className='Eliminar_equipos_add' variant="danger" size="sm" onClick={() => handleRemoveTeam(team.id)}>
                    Eliminar
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay equipos agregados en tu lista.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showLimitModal} onHide={handleCloseLimitModal}>
        <Modal.Header closeButton>
          <Modal.Title>Límite de equipos alcanzado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Has alcanzado el límite máximo de 3 equipos añadidos. Debes eliminar uno para añadir otro.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLimitModal}>
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>

        <div className='Foo_port'>
        <div id="piepor">
          <Pagination>
            <Pagination.Prev />
            <Pagination.Item active id="font">{1}</Pagination.Item>
            <Pagination.Item id="font">{2}</Pagination.Item>
            <Pagination.Item id="font">{3}</Pagination.Item>
            <Pagination.Ellipsis />
            <Pagination.Item id="font">{10}</Pagination.Item>
            <Pagination.Next />
          </Pagination>
        </div>
      </div>
    </div>
  );
};


// Componente principal
function Soli_Port() {
  return (
    <div className="Usu-container1">
      <Header_port />
      <ListaConsultas />
      <div className='fotaj'>
        <div className='contenido_fotaj'></div>
        <Footer />
      </div>
    </div>
  );
}

export default Soli_Port;