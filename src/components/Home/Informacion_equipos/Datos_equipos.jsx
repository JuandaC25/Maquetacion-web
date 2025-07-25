import React from 'react';
import './informacion_equipos.css';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

// MODAL DE REPORTE
function MyVerticallyCenteredModal({ show, onHide, abrirConfirmacion }) {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header className="Header1" closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1 className="Titul1">
            Seleccione los problemas que presenta su dispositivo
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="Cuerpovent">
        {/* Listas de problemas */}
        <div className="Conteiner01">
          {['Problemas con el office', 'Problemas con credenciales', 'Sobrecalentamiento'].map((texto, i) => (
            <div className="Cuadrito1" key={i}>
              <h6 className="Text1">{texto}</h6>
              <Form.Group className="mb-3">
                <Form.Check type="checkbox" />
              </Form.Group>
            </div>
          ))}
        </div>

        <div className="Conteiner02">
          {['Se apaga solo', 'Demasiado tiempo cargando', 'No enciende'].map((texto, i) => (
            <div className="Cuadrito1" key={i}>
              <h6 className="Text1">{texto}</h6>
              <Form.Group className="mb-3">
                <Form.Check type="checkbox" />
              </Form.Group>
            </div>
          ))}
        </div>

        <div className="Conteiner03">
          {['Sin internet', 'Puertos dañados', 'Bloqueado'].map((texto, i) => (
            <div className="Cuadrito1" key={i}>
              <h6 className="Text1">{texto}</h6>
              <Form.Group className="mb-3">
                <Form.Check type="checkbox" />
              </Form.Group>
            </div>
          ))}
        </div>

        <InputGroup className="Text2">
          <Form.Control className="Text3" placeholder="Observaciones (Opcional)" />
        </InputGroup>

        <Button className="botoon" onClick={abrirConfirmacion}>
          <h6>Confirmar reporte</h6>
        </Button>
      </Modal.Body>
    </Modal>
  );
}

// MODAL DE CONFIRMACIÓN
function ModalConfirmacion({ show, onHide, confirmar }) {
  return (
    <Modal show={show} onHide={onHide} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>¿Estás seguro de que quieres reportar este equipo como dañado?Si lo haces sera irrevesible </p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmar}>
            Sí, reportar
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

// MODAL COMPONENTES (DINÁMICO)
function ModalComponentes({ show, onHide, componentes }) {
  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton className="Header1">
        <Modal.Title>
          <h5 className="Titul1">Componentes del equipo</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="tabla-componentes">
          {componentes.map((item, index) => (
            <p key={index}>
              <strong>{item.label}:</strong> {item.value}
            </p>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
}

// COMPONENTE PRINCIPAL DE EQUIPO
function Datos_equipos({ nombre, numeroSerie, observaciones, componentes }) {
  const [modalShowComponentes, setModalShowComponentes] = React.useState(false);
  const [modalShowReporte, setModalShowReporte] = React.useState(false);
  const [modalShowConfirmacion, setModalShowConfirmacion] = React.useState(false);
  const [estadoEquipo, setEstadoEquipo] = React.useState('activo');

  const confirmarReporte = () => {
    setEstadoEquipo('fuera_de_servicio');
    setModalShowConfirmacion(false);
    setModalShowReporte(false);
  };

  return (
    <>
      <div className={`card-detalles ${estadoEquipo === 'fuera_de_servicio' ? 'fuera-servicio' : ''}`}>
        <h4>Detalles del equipo</h4>
        <img src="/imagenes/portatil.png" className="imagen-animada-portt" alt="Portátil" />
        <p><strong>Nombre:</strong> {nombre}</p>
        <p><strong>Número de serie:</strong> {numeroSerie}</p>
        <p><strong>Observaciones:</strong> {observaciones}</p>

        {estadoEquipo === 'fuera_de_servicio' && (
          <div className="stamp">EQUIPO REPORTADO</div>
        )}

        <Button className="boton-detalles2" onClick={() => setModalShowComponentes(true)}>
          Ver componentes
        </Button>

        <Button
          className="boton-detalles1"
          onClick={() => setModalShowReporte(true)}
          disabled={estadoEquipo === 'fuera_de_servicio'}
        >
          {estadoEquipo === 'activo' ? 'Reportar como dañado' : 'Equipo fuera de servicio'}
        </Button>
      </div>

      {/* Modales */}
      <ModalComponentes
        show={modalShowComponentes}
        onHide={() => setModalShowComponentes(false)}
        componentes={componentes}
      />
      <MyVerticallyCenteredModal
        show={modalShowReporte}
        onHide={() => setModalShowReporte(false)}
        abrirConfirmacion={() => setModalShowConfirmacion(true)}
      />
      <ModalConfirmacion
        show={modalShowConfirmacion}
        onHide={() => setModalShowConfirmacion(false)}
        confirmar={confirmarReporte}
      />
    </>
  );
}

export default Datos_equipos;




