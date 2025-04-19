import Navbar from 'react-bootstrap/Navbar';
import './Footer.css';
import logoSena from '../../assets/Logosena.png';

function Footer() {
  return (
    <footer className="bg-mi-color-especifico w-100 mt-auto">
      <Navbar expand="lg" className="justify-content-center">
        <Navbar.Brand className="d-flex align-items-center gap-2"> 
          <img
            src={logoSena}
            height="50"
            alt="Logo Sena"
            className="d-inline-block align-top"
          />
          <h3 className="mb-0">Sena, tech.inventory</h3>
        </Navbar.Brand>
      </Navbar>
    </footer>
  );
}

export default Footer;
