import React from 'react';
import { Form } from 'react-bootstrap';

function Datos_escritorio() {
  return (
<>
<div className='acomodeichion'>
    <div className='decoracionredondeada'>
    <img src="/imagenes/EscritorioMesa.png" className="imagen-EscritorioMesa" alt="Portátil" />
    </div>

    <div className="form-grid1">
      <div className="form-row2">
        <div className="form-col">
          <Form.Label>Ingrese la cantidad</Form.Label>
          <Form.Control type="number" className="ajust-tamañoo" />
        </div>
      </div>

      <div className="form-row2">
        <div className="form-col">
          <Form.Label>Ambiente</Form.Label>
          <Form.Control type="text" className="ajust-tamañoo" />
        </div>
      </div>

      <div className="form-row2">
        <div className="form-col">
          <Form.Label>Fecha de uso</Form.Label>
          <Form.Control type="date" className="ajust-tamañoo" />
        </div>
      </div>

      <div className="form-row2">
        <div className="form-col">
          <Form.Label>Observaciones</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            className="ajust-tamañooo"
            placeholder="Escribe si necesita que el equipo o los equipos tenga una especificación única, de lo contrario no escribas nada"
          />
        </div>
      </div>

      <button className="bton-submit">Confirmar solicitud</button>
    </div>
</div>
</>
  );
}

export default Datos_escritorio;

