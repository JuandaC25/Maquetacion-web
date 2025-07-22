import Navbar from 'react-bootstrap/Navbar';
import './Footer.css';
import logoSena from '../../assets/senaaa.png';

function Footer() {
  return (
    <footer className="footer-container-1501 w-100 mt-auto">
      <Navbar expand="lg" className="justify-content-between px-4 align-items-center">
        <Navbar.Brand className="d-flex align-items-center m-0"> 
          <div className="text-loader-1502">
            <span className="fixed-text-1503">SENA</span>
            <div className="rotating-words-1504">
              <span className="word-1505">tech</span>
              <span className="word-1505">inventory</span>
            </div>
          </div>
        </Navbar.Brand>
        <div className="schedule-text-1506">
          <div>Horarios de atención:</div>
          <div>7:00 am a 6:00 pm - Lunes a Viernes</div>
          <div>9:00 am a 3:00 pm - Sábados</div>
        </div>
        <button className="sena-btn-1507">
          <img
            src={logoSena}
            height="50"
            width="50"
            alt="Logo Sena"
            className="sena-logo-1508"
          />
        </button>
      </Navbar>
    </footer>
  );
}

export default Footer;