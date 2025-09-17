import React, { useState } from "react";
import "./HistorialTec.css";
import Header_HistorialTec from '../header_historialTec/Header_HistorialTec.jsx';
import Footer from '../../Footer/Footer';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const HistorialTec = () => {
  const [historial, setHistorial] = useState([
    {
      id: 1,
      fecha: "2025-09-01",
      titulo: "Ticket #001",
      descripcion: "Se hizo una revisión general del equipo.",
    },
    {
      id: 2,
      fecha: "2025-09-05",
      titulo: "Ticket #002",
      descripcion: "Se cambió el filtro de ventilación.",
    },
    {
      id: 3,
      fecha: "2025-09-10",
      titulo: "Ticket #003",
      descripcion: "Se instaló nueva versión del firmware.",
    },
  ]);

  const agregarHistorial = () => {
    const nuevoId = historial.length > 0 ? historial[historial.length - 1].id + 1 : 1;
    const nuevo = {
      id: nuevoId,
      fecha: new Date().toISOString().substring(0, 10),
      titulo: `Prestamo #00${nuevoId}`,
      descripcion: `detalles de la revision `,
      
    };
    setHistorial([...historial, nuevo]);
  };

  const eliminarHistorial = (id) => {
    setHistorial(historial.filter(item => item.id !== id));
  };

  return (
    <>
      <Header_HistorialTec />
      <section className="tecnico-historial">
       
        <div className="tecnico-historial__acciones">
          <DropdownButton
            as={ButtonGroup}
            title="Dropdown"
            id="bg-vertical-dropdown-2"
            className="butin"
          >
            <Dropdown.Item eventKey="1">Prestamos</Dropdown.Item>
            <Dropdown.Item eventKey="2">Elementos </Dropdown.Item>
          </DropdownButton>
        </div>
        <div className="tecnico-historial__lista">
          {historial.length > 0 ? (
            historial.map(item => (
              <div className="historial-item" key={item.id}>
                <div className="historial-item__contenido">
                  <span className="historial-item__fecha">{item.fecha}</span>
                  <h3 className="historial-item__titulo">{item.titulo}</h3>
                  <p className="historial-item__descripcion">{item.descripcion}</p>
                </div>
                <div className="historial-item__acciones">
                  <button
                    className="btn-eliminar"
                    onClick={() => eliminarHistorial(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="tecnico-historial__vacio">No hay eventos en el historial.</p>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default HistorialTec;
