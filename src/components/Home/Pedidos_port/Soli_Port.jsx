import React, { useState, useEffect } from "react";
import { Card,Button,Carousel,Spinner,ButtonGroup,ToggleButton} from "react-bootstrap";
import "./Soli_port.css";
import ElementosService from "../../../api/ElementosApi";
import Footer from '../../Footer/Footer.jsx';
import Header_port from './Header soli/Header.jsx';



function Soli_Port() {
  const [equiposDisponibles, setEquiposDisponibles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState("computo");

  useEffect(() => {
    const fetchElementos = async () => {
      try {
        setIsLoading(true);
        const data = await ElementosService.obtenerElementos();
        let portatiles = [];
        if (categoriaFiltro === "computo") {
          portatiles = data.filter((item) =>
            (item.sub_catg === "Portatil" || item.nom_eleme === "Portátil") && item.est === 1
          );
        } else {
          portatiles = data.filter((item) =>
            (item.sub_catg === "Portatil de edición" || item.nom_eleme === "Portátil de edición") && item.est === 1
          );
        }
        setEquiposDisponibles(portatiles);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchElementos();
  }, [categoriaFiltro]);

  if (isLoading) {
    return (
      <div className="main-page-container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  const datosGenerales = equiposDisponibles[0] || {};

  return (
    <div className="port-main-page-container">
      <Header_port />
      <div className="mb-3 d-flex justify-content-center">
        <ButtonGroup>
          <ToggleButton
            id="filtro-computo"
            type="radio"
            variant={categoriaFiltro === "computo" ? "success" : "outline-success"}
            name="categoriaFiltro"
            value="computo"
            checked={categoriaFiltro === "computo"}
            onChange={() => setCategoriaFiltro("computo")}
          >
            Computo
          </ToggleButton>
          <ToggleButton
            id="filtro-multimedia"
            type="radio"
            variant={categoriaFiltro === "multimedia" ? "success" : "outline-success"}
            name="categoriaFiltro"
            value="multimedia"
            checked={categoriaFiltro === "multimedia"}
            onChange={() => setCategoriaFiltro("multimedia")}
          >
            Multimedia
          </ToggleButton>
        </ButtonGroup>
      </div>
      {equiposDisponibles.length > 0 ? (
        <Card className="port-ficha-visual">
          <div className="port-ficha-header">
            <div className="port-ficha-titulo">
              <h2>{categoriaFiltro === "computo" ? "Portátiles" : "Portátil de edición"}</h2>
              <p className="port-ficha-subtitulo">
                Visualiza aquí los detalles generales de los portátiles disponibles
              </p>
            </div>
          </div>

          <div className="port-ficha-body">
            <div className="port-ficha-descripcion">
              <h4>Descripción general</h4>
              <p>{datosGenerales.obse || "Sin observaciones disponibles."}</p>
              <div className="port-carrusel">
                <Carousel interval={2500} controls={true} indicators={true} fade>
                  {[1, 2, 3].map((num) => (
                    <Carousel.Item key={num}>
                      <img
                        className="d-block w-100 port-carrusel-imagen"
                        src={`/imagenes/imagenes_port/portatil${num}.png`}
                        alt={`Portátil ${num}`}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
            </div>

            <div className="port-ficha-especificaciones">
              <h4>Componentes principales</h4>
              <ul>
                {(datosGenerales.componen || "")
                  .split(",")
                  .map((esp, i) => esp.trim())
                  .filter((esp) => esp.length > 0)
                  .map((esp, i) => (
                    <li key={i}>{esp}</li>
                  ))}
              </ul>
            </div>

            {/* Contador de equipos disponibles como texto pequeño arriba a la derecha */}
            <div className="port-equipos-disponibles-notif">
              <span>
                Equipos actualmente disponibles: {equiposDisponibles.length}
              </span>
            </div>
          </div>

          <div className="port-ficha-footer">
            <Button className="port-boton-solicitar" disabled>
              <span>Realizar solicitud</span>
            </Button>
          </div>
        </Card>
      ) : (
        <p className="text-center mt-4">No hay equipos disponibles.</p>
      )}
      <Footer />
    </div>
  );
}

export default Soli_Port;