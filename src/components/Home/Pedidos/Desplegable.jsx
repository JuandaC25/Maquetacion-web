import React, { useState } from 'react';

function Desplegable() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };
  return (
    <div className="navbar">
      <div className="Menu" onClick={toggleMenu}>
        &#9776; 
      </div>
      {menuAbierto && (
        <div className="menu-desplegable">
          <ul>
            <li>Solicitar equipo</li>
            <li>Informacion de equipos</li>
            <li>Solicitar espacios</li>
          </ul>
        </div>
      )
      }
    </div>
  );
}

export default Desplegable;
