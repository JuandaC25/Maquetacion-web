import React, { useState, useEffect } from "react";
import { Card, ListGroup, Button, Modal, Form, Pagination } from "react-bootstrap";
import "./Soli_televisor.css";
import Footer from "../../Footer/Footer";
import Headertele from "./Header tele/Header";
import ElementosService from "../../../api/ElementosApi";
import { crearSolicitud } from "../../../api/solicitudesApi";

function Solitelevisores() {
  const [televisoresApi, setTelevisoresApi] = useState([]);
  const [filteredTelevisores, setFilteredTelevisores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [televisoresPerPage] = useState(6);
  const categoryName = "Televisor";

  const [form, setForm] = useState({
    fecha_ini: "",
    hora_ini: "",
    fecha_fn: "",
    hora_fn: "",
    ambient: "",
    num_fich: "",
    estadosoli: 1,
    id_usu: 1,
  });

  const [subcategoriaFiltro, setSubcategoriaFiltro] = useState("Todos");
  const [subcategoriasDisponibles, setSubcategoriasDisponibles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (seleccionados.length === 0) {
      alert("Por favor, selecciona al menos un elemento para la solicitud.");
      return;
    }

    const fechaInicio = new Date(`${form.fecha_ini}T${form.hora_ini}:00`);
    const fechaFin = new Date(`${form.fecha_fn}T${form.hora_fn}:00`);

    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      alert("El formato de fecha o hora es inválido.");
      return;
    }

    const dto = {
      fecha_ini: fechaInicio.toISOString(),
      fecha_fn: fechaFin.toISOString(),
      ambient: form.ambient,
      estadosoli: form.estadosoli,
      id_usu: form.id_usu,
      num_fich: form.num_fich,
      id_elemen: seleccionados,
    };

    try {
      const resultado = await crearSolicitud(dto);
      console.log("Solicitud realizada:", resultado);
      alert("Solicitud realizada correctamente ✅");
      setShowModal(false);
      setSeleccionados([]);
      setForm({
        fecha_ini: "",
        hora_ini: "",
        fecha_fn: "",
        hora_fn: "",
        ambient: "",
        num_fich: "",
        estadosoli: "Pendiente",
        id_usu: 1,
      });
    } catch (err) {
      console.error("Error en la solicitud:", err);
      alert(`Hubo un problema al realizar la solicitud: ${err.message || "Error desconocido"}`);
    }
  };

  useEffect(() => {
    const fetchElementos = async () => {
      try {
        setIsLoading(true);
        const data = await ElementosService.obtenerElementos();
        const subcategoriasPermitidas = [
          "Microfono",
          "Audifonos",
          "tabletas graficas",
          "Pantallas verdes",
          "Reflectores",
          "Traje de cromas"
        ];
        const filtrados = data.filter(
          (item) => subcategoriasPermitidas.includes(item.sub_catg)
        );
        // Obtener subcategorías únicas
        const subcats = [
          ...new Set(filtrados.map((item) => item.sub_catg))
        ];
        setSubcategoriasDisponibles(subcats);

        const transformedData = filtrados.map((item) => ({
          id: item.id_elemen,
          nombre: item.nom_eleme,
          modelo: item.num_serie,
          descripcion: item.obse,
          especificaciones: (item.componen || "").split(",").map((s) => s.trim()),
          sub_catg: item.sub_catg,
          imagen: "/imagenes/Televisorr-solicitud.png",
        }));
        setTelevisoresApi(transformedData);
        setFilteredTelevisores(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchElementos();
  }, []);

  // Nuevo filtrado por subcategoría
  useEffect(() => {
    let results = televisoresApi;
    if (subcategoriaFiltro !== "Todos") {
      results = results.filter(e => e.sub_catg === subcategoriaFiltro);
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    results = results.filter((elemento) =>
      (elemento.nombre || "").toLowerCase().includes(lowerSearchTerm) ||
      (elemento.modelo || "").toLowerCase().includes(lowerSearchTerm) ||
      (elemento.descripcion || "").toLowerCase().includes(lowerSearchTerm) ||
      (elemento.especificaciones || []).some((esp) => (esp || "").toLowerCase().includes(lowerSearchTerm))
    );
    setFilteredTelevisores(results);
    setCurrentPage(1);
  }, [searchTerm, televisoresApi, subcategoriaFiltro]);

  const toggleSelect = (id) => {
    setSeleccionados((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const selectedElementosDetails = seleccionados.map((id) =>
    televisoresApi.find((elemento) => elemento.id === id)
  );

  const indexOfLastElemento = currentPage * televisoresPerPage;
  const indexOfFirstElemento = indexOfLastElemento - televisoresPerPage;
  const currentTelevisores = filteredTelevisores.slice(indexOfFirstElemento, indexOfLastElemento);
  const totalPages = Math.ceil(filteredTelevisores.length / televisoresPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationItems = () => {
    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  return (
    <div className="main-page-container">
      <Headertele />

      {/* Filtro de subcategoría */}
      <div className="mb-3 d-flex justify-content-center">
        <select
          className="form-select"
          style={{ maxWidth: 300 }}
          value={subcategoriaFiltro}
          onChange={e => setSubcategoriaFiltro(e.target.value)}
        >
          <option value="Todos">Todas las subcategorías</option>
          {subcategoriasDisponibles.map(subcat => (
            <option key={subcat} value={subcat}>{subcat}</option>
          ))}
        </select>
      </div>

      <div className="Ajust-debusquedas">
        <div className="group-busqueda">
          <input
            className="input"
            type="text"
            placeholder={`Buscar ${categoryName.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {seleccionados.length > 0 && (
          <div className="cartt-container">
            <Button variant="info" onClick={() => setShowCartModal(true)} className="me-2">
              🛒 Televisores ({seleccionados.length})
            </Button>
          </div>
        )}
      </div>

      {/* Cards de televisores */}
      <div className="equipos-container">
        {isLoading ? (
          <p className="loading-message">Cargando {categoryName.toLowerCase()}...</p>
        ) : error ? (
          <div className="alert alert-danger mt-3">{error}</div>
        ) : currentTelevisores.length > 0 ? (
          currentTelevisores.map((elemento) => (
            <Card
              key={elemento.id}
              className={`ficha-horizontal ${seleccionados.includes(elemento.id) ? "seleccionado" : ""}`}
            >
              <div className="ficha-img">
                <Card.Img src={elemento.imagen} alt={elemento.nombre} />
              </div>
              <div className="ficha-info">
                <Card.Body>
                  <Card.Title>{elemento.nombre}</Card.Title>
                  {elemento.modelo && (
                    <Card.Subtitle className="mb-2 text-muted">
                      Modelo: {elemento.modelo}
                    </Card.Subtitle>
                  )}
                  <Card.Text>{elemento.descripcion}</Card.Text>
                  <Card className="Cuadro_especificacioness">
                    <Card.Header>Especificaciones</Card.Header>
                    <ListGroup variant="flush">
                      {elemento.especificaciones.map((esp, i) => (
                        <ListGroup.Item key={i}>{esp}</ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card>
                  <Button
                    className="boton_equiposescritorio"
                    variant={seleccionados.includes(elemento.id) ? "danger" : "primary"}
                    onClick={() => toggleSelect(elemento.id)}
                  >
                    {seleccionados.includes(elemento.id) ? "Quitar" : "Seleccionar"}
                  </Button>
                </Card.Body>
              </div>
            </Card>
          ))
        ) : (
          <p className="no-results-message">No se encontraron {categoryName.toLowerCase()}s.</p>
        )}
      </div>

      {/* ✅ Botón final de confirmación */}
      {seleccionados.length > 0 && (
        <div className="text-center mt-4 mb-5">
          <Button variant="success" size="lg" onClick={() => setShowModal(true)}>
            Confirmar Solicitud
          </Button>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {renderPaginationItems()}
            <Pagination.Next
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      {/* Modal de formulario */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Realizar Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-form">
          <Form onSubmit={handleFormSubmit}>
            <div className="form-section-title">Detalles de la solicitud</div>

            <Form.Group className="mb-3">
              <Form.Label>Fecha y Hora de Inicio</Form.Label>
              <div className="row g-2">
                <div className="col-md-6">
                  <Form.Control
                    type="date"
                    name="fecha_ini"
                    value={form.fecha_ini}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <Form.Control
                    type="time"
                    name="hora_ini"
                    value={form.hora_ini}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha y Hora de Fin</Form.Label>
              <div className="row g-2">
                <div className="col-md-6">
                  <Form.Control
                    type="date"
                    name="fecha_fn"
                    value={form.fecha_fn}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <Form.Control
                    type="time"
                    name="hora_fn"
                    value={form.hora_fn}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <div className="row g-2">
                <div className="col-md-6">
                  <Form.Label>Ambiente</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: Ambiente 301"
                    name="ambient"
                    value={form.ambient}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <Form.Label>Número de ficha</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: 2560014"
                    name="num_ficha"
                    value={form.num_ficha}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </Form.Group>

            <div className="text-center mt-4">
              <Button variant="primary" type="submit" className="px-4">
                Enviar Solicitud
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal del carrito */}
      <Modal show={showCartModal} onHide={() => setShowCartModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Equipos seleccionados</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup className="equipos-seleccionados-list">
            {selectedElementosDetails.length > 0 ? (
              selectedElementosDetails.map((elemento, index) => (
                <ListGroup.Item key={elemento ? elemento.id : index} className="equipo-item">
                  {elemento ? elemento.nombre : "Equipo no encontrado"}
                </ListGroup.Item>
              ))
            ) : (
              <p>No hay equipos en el carrito.</p>
            )}
          </ListGroup>
        </Modal.Body>
      </Modal>

      <Footer />
    </div>
  );
}

export default Solitelevisores;
