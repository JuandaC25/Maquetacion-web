import Form from 'react-bootstrap/Form';
import "./Solicitud_espacios.css";
import Button from 'react-bootstrap/Button';
//aaaaaaaaaaaaaaaaaaaaaaaaaaa

function Datos_pedido() {
  return (
    <>
    <h3 className='titulo1'>Seleccione el espacio que desea apartar</h3>
    <div className='menuespa'>
    <Form.Select aria-label="Example">
      <option value="1">Auditorio</option>
      <option value="2">Cancha</option>
    </Form.Select>
    </div>
<div className='conteinercenter'>
    <Form.Label htmlFor="inputPassword5"><h3>Tiempo de uso</h3></Form.Label>
      <Form.Control
        type="password"
        id="inputPassword5"
        aria-describedby="passwordHelpBlock"
      />
  </div>
  <div className='conteinercenter2'>
    <Form.Label htmlFor="inputPassword5"><h3>Fecha de uso</h3></Form.Label>
      <Form.Control
        type="password"
        id="inputPassword5"
        aria-describedby="passwordHelpBlock"
      />
  </div>
  <div className="conteinercenter2">
  <Button type="submit" className="boton-personalizado">
    Enviar solicitud
  </Button>
</div>

    </>
  );
}
export default Datos_pedido;