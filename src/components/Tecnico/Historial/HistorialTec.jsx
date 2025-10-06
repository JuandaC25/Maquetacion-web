import React, { useState, useEffect } from "react";
import "./HistorialTec.css";
import Header_HistorialTec from "../header_historialTec/Header_HistorialTec.jsx";
import Footer from "../../Footer/Footer";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { FaFilter } from "react-icons/fa";
import ModalTickets from "./ModalHistorial/ModalTickets.jsx";

const HistorialTec = () => {
  const [categoriaGeneral, setCategoriaGeneral] = useState("Tickets"); // Tickets o Préstamos
  const [categoriaEquipo, setCategoriaEquipo] = useState("Todos"); // Categoría de elemento
  const [searchTerm, setSearchTerm] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [historial, setHistorial] = useState([]);
  const [elementos, setElementos] = useState([]);
  const [error, setError] = useState("");
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        let dataHistorial = [];
        let dataElementos = [];

        if (categoriaGeneral === "Tickets") {
          const resTickets = await fetch("http://localhost:8081/api/tickets");
          if (!resTickets.ok) throw new Error(`Error ${resTickets.status}`);
          dataHistorial = await resTickets.json();
        } else {
          const resPrestamos = await fetch("http://localhost:8081/api/prestamos");
          if (!resPrestamos.ok) throw new Error(`Error ${resPrestamos.status}`);
          dataHistorial = await resPrestamos.json();
        }

        const resElementos = await fetch("http://localhost:8081/api/elementos");
        if (!resElementos.ok) throw new Error(`Error ${resElementos.status}`);
        dataElementos = await resElementos.json();

        setHistorial(dataHistorial);
        setElementos(dataElementos);
      } catch (err) {
        console.error("Error al obtener historial:", err);
        setError("No se pudo conectar con el backend. Verifica que esté corriendo y la URL sea correcta.");
      }
    };

    fetchData();
  }, [categoriaGeneral]);

  const historialConCategoria = historial.map((item) => {
    const elementoRelacionado = elementos.find(
      (el) => el.id_elemen === (categoriaGeneral === "Tickets" ? item.id_eleme : item.id_elem)
    );
    return {
      ...item,
      categoria: elementoRelacionado ? elementoRelacionado.tip_catg : "Sin categoría",
      numSerie: elementoRelacionado ? elementoRelacionado.num_seri : "No registrada",
    };
  });

  const filtrarHistorial = () => {
    return historialConCategoria.filter((item) => {
      const coincideCategoria =
        categoriaEquipo === "Todos" ||
        (item.categoria && item.categoria.toLowerCase() === categoriaEquipo.toLowerCase());

      const itemFecha =
        categoriaGeneral === "Tickets" ? item.fecha_in : item.fecha_entreg;

      const coincideBusqueda =
        searchTerm === "" ||
        (item.nom_elem && item.nom_elem.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.categoria && item.categoria.toLowerCase().includes(searchTerm.toLowerCase()));

      const coincideFecha =
        (!fechaInicio || itemFecha >= fechaInicio) &&
        (!fechaFin || itemFecha <= fechaFin);

      return coincideCategoria && coincideBusqueda && coincideFecha;
    });
  };

  const historialFiltrado = filtrarHistorial();

  const abrirModal = (ticket) => {
    setTicketSeleccionado(ticket);
    setMostrarModal(true);
  };

  const cerrarModal = () => setMostrarModal(false);

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
            <Dropdown.Item eventKey="Equipo de mesa">Equipo de mesa</Dropdown.Item>
            <Dropdown.Item eventKey="Accesorios">Accesorios</Dropdown.Item>
            <Dropdown.Item eventKey="Televisores">Televisores</Dropdown.Item>
          </DropdownButton>

          <input
            type="text"
            placeholder="Buscar por nombre..."
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

        {error && <p className="error-backend">{error}</p>}

        <div className="tecnico-historial__lista">
          {historialFiltrado.length > 0 ? (
            historialFiltrado.map((item) => {
              const itemFecha =
                categoriaGeneral === "Tickets" ? item.fecha_in : item.fecha_entreg;

              return (
                <div className="historial-item" key={item.id_tickets || item.id_prest}>
                  <div className="historial-item__contenido">
                    <span className="historial-item__fecha">
                      {new Date(itemFecha).toLocaleString()}
                    </span>
                    <h3 className="historial-item__titulo">
                      {categoriaGeneral === "Tickets"
                        ? `Ticket #${item.id_tickets}`
                        : `Préstamo #${item.id_prest}`}
                    </h3>
                    <p className="historial-item__descripcion">
                      {item.descripcion || item.tipo_pres || "Sin descripción"}
                    </p>
                    <p className="historial-item__detalle">
                      <strong>Elemento:</strong> {item.nom_elem || "Desconocido"} |{" "}
                      <strong>Categoría:</strong> {item.categoria} |{" "}
                      <strong>Número de serie:</strong> {item.numSerie}
                    </p>
                    <button
                      className="buttoninfo"
                      onClick={() => abrirModal(item)}
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="tecnico-historial__vacio">
              {categoriaGeneral === "Tickets"
                ? "No hay información disponible para Tickets."
                : "No hay resultados que coincidan con los filtros."}
            </p>
          )}
        </div>
      </section>

      {ticketSeleccionado && (
        <ModalTickets
          show={mostrarModal}
          onHide={cerrarModal}
          ticket={ticketSeleccionado}
          elementos={elementos}
          tipo={categoriaGeneral}
        />
      )}

      <Footer />
    </>
  );
};

export default HistorialTec;
