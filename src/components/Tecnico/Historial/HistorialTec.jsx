import React, { useState } from "react";
import "./HistorialTec.css";
import Header_HistorialTec from "../header_historialTec/Header_HistorialTec.jsx";
import Footer from "../../Footer/Footer";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { FaFilter } from "react-icons/fa";

const HistorialTec = () => {
  const [categoriaGeneral, setCategoriaGeneral] = useState("Tickets");
  const [categoriaEquipo, setCategoriaEquipo] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const historialData = [

    { id: 1, tipo: "Tickets", fecha: "2025-09-01", titulo: "Ticket #001", descripcion: "Revisión general del equipo HP.", marca: "HP", categoria: "Portátiles" },
    { id: 2, tipo: "Tickets", fecha: "2025-09-05", titulo: "Ticket #002", descripcion: "Cambio de ventilador.", marca: "Dell", categoria: "Escritorio" },
    { id: 3, tipo: "Tickets", fecha: "2025-09-10", titulo: "Ticket #003", descripcion: "Instalación de firmware.", marca: "Samsung", categoria: "Televisores" },
    { id: 7, tipo: "Tickets", fecha: "2025-09-18", titulo: "Ticket #004", descripcion: "Mantenimiento preventivo.", marca: "Lenovo", categoria: "Portátiles" },
    { id: 8, tipo: "Tickets", fecha: "2025-09-22", titulo: "Ticket #005", descripcion: "Actualización de BIOS.", marca: "Asus", categoria: "Escritorio" },


    { id: 4, tipo: "Préstamos", fecha: "2025-09-12", titulo: "Préstamo #004", descripcion: "Modelo: 29-8324156", marca: "HP", categoria: "Portátiles" },
    { id: 5, tipo: "Préstamos", fecha: "2025-09-15", titulo: "Préstamo #005", descripcion: "Modelo: 29-4251687", marca: "Lenovo", categoria: "Escritorio" },
    { id: 6, tipo: "Préstamos", fecha: "2025-09-20", titulo: "Préstamo #006", descripcion: "Modelo: 29-7543298", marca: "Logitech", categoria: "Accesorios" },
    { id: 9, tipo: "Préstamos", fecha: "2025-09-25", titulo: "Préstamo #007", descripcion: "Modelo: 29-8473610", marca: "Samsung", categoria: "Televisores" },
    { id: 10, tipo: "Préstamos", fecha: "2025-09-29", titulo: "Préstamo #008", descripcion: "Modelo: 29-9902741", marca: "HP", categoria: "Portátiles" },
  ];

  const filtrarHistorial = () => {
    return historialData.filter((item) => {
      const coincideTipo = item.tipo === categoriaGeneral;
      const coincideCategoria =
        categoriaEquipo === "Todos" || item.categoria === categoriaEquipo;
      const coincideBusqueda =
        searchTerm === "" ||
        item.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoria.toLowerCase().includes(searchTerm.toLowerCase());
      const coincideFecha =
        (!fechaInicio || item.fecha >= fechaInicio) &&
        (!fechaFin || item.fecha <= fechaFin);

      return coincideTipo && coincideCategoria && coincideBusqueda && coincideFecha;
    });
  };

  const historialFiltrado = filtrarHistorial();

  return (
    <>
      <Header_HistorialTec />
      <section className="tecnico-historial">
        <div className="barra-filtros">

          <DropdownButton
            as={ButtonGroup}
            title={categoriaGeneral}
            id="dropdown-general"
            className="filtro-btn"
            onSelect={(key) => setCategoriaGeneral(key)}
          >
            <Dropdown.Item eventKey="Tickets">Tickets</Dropdown.Item>
            <Dropdown.Item eventKey="Préstamos">Préstamos</Dropdown.Item>
          </DropdownButton>


          <DropdownButton
            title={<FaFilter />}
            className="filtro-icono"
            onSelect={(key) => setCategoriaEquipo(key)}
          >
            <Dropdown.Item eventKey="Todos">Todos</Dropdown.Item>
            <Dropdown.Item eventKey="Portátiles">Portátiles</Dropdown.Item>
            <Dropdown.Item eventKey="Escritorio">Equipos de escritorio</Dropdown.Item>
            <Dropdown.Item eventKey="Accesorios">Accesorios</Dropdown.Item>
            <Dropdown.Item eventKey="Televisores">Televisores</Dropdown.Item>
          </DropdownButton>


          <input
            type="text"
            placeholder="Buscar marca o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-busqueda-min"
          />


          <div className="rango-fechas-min">
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <span>—</span>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
        </div>


        <div className="tecnico-historial__lista">
          {historialFiltrado.length > 0 ? (
            historialFiltrado.map((item) => (
              <div className="historial-item" key={item.id}>
                <div className="historial-item__contenido">
                  <span className="historial-item__fecha">{item.fecha}</span>
                  <h3 className="historial-item__titulo">{item.titulo}</h3>
                  <p className="historial-item__descripcion">{item.descripcion}</p>
                  <p className="historial-item__detalle">
                    <strong>Marca:</strong> {item.marca} |{" "}
                    <strong>Categoría:</strong> {item.categoria}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="tecnico-historial__vacio">
              No hay resultados que coincidan con los filtros.
            </p>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default HistorialTec;
