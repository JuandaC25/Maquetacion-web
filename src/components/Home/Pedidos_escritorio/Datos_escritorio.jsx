import Form from 'react-bootstrap/Form';
import './Pedidos_escritorio'; 
import Button from 'react-bootstrap/Button';

function Datos_escritorio() {
  return (
    <div className="form-grid">
      <div className="form-row">
        <div className="form-col">
          <Form.Label htmlFor="inputCantidad">Ingrese la cantidad</Form.Label>
          <Form.Control type="number" id="inputCantidad" className="form-input" />
        </div>

        <div className="form-col">
          <Form.Label htmlFor="inputMouse"># de mouse necesarios</Form.Label>
          <Form.Control type="number" id="inputMouse" className="form-input" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <Form.Label htmlFor="inputAmbiente">Ambiente</Form.Label>
          <Form.Control type="text" id="inputAmbiente" className="form-input" />
        </div>

        <div className="form-col">
          <Form.Label htmlFor="inputTeclados"># de teclados necesarios</Form.Label>
          <Form.Control type="number" id="inputTeclados" className="form-input" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <Form.Label htmlFor="inputFecha">Fecha de uso</Form.Label>
          <Form.Control type="date" id="inputFecha" className="form-input" />
        </div>
      </div>
      <Button type="submit" className="boton-personalizado1">
        Enviar solicitud
      </Button>
    </div>
  );
}

export default Datos_escritorio;
