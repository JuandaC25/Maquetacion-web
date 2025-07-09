import './Header_histo/Header_his.jsx';
import Dropdown from 'react-bootstrap/Dropdown';
import Header_his from './Header_histo/Header_his.jsx';
import './Histo_pedi.css';
import Stack from 'react-bootstrap/Stack';
import Footer from '../../Footer/Footer.jsx';
import Pagination from 'react-bootstrap/Pagination';
import Modal_ver from './Modal_ver/Modal_ver.jsx';
import Button from 'react-bootstrap/Button';

function Historial_ped() {
  return (
    <div className='Cont_historial'>
        <Header_his/>
    <Dropdown className='Drop_histo'>
      <Dropdown.Toggle variant='outline-dark' id="dropdown-basic">
        Portatiles
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Equipos escritorio</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Televisores</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Elementos</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <container className='Container_historial'>
    <Stack gap={1}>
      <div className="p-3">🖥️<button disabled className='let_histo' >Pendiente</button>Pedido 101 <div className='Btn_ver'><Modal_ver/></div></div>
      <div className="p-3">🖥️<button disabled className='let_histo' >Cancelado</button>Pedido 102 <div className='Btn_ver'><Modal_ver/></div></div>
       <div className="p-3">🖥️<button disabled className='let_histo' >Pendiente</button>Pedido 101 <div className='Btn_ver'><Modal_ver/></div></div>
      <div className="p-3">🖥️<button disabled className='let_histo' >Aceptado</button>Pedido 101 <div className='Btn_ver'><Modal_ver/></div></div>
      <div className="p-3">🖥️<button disabled className='let_histo' >Aceptado</button>Pedido 101 <div className='Btn_ver'><Modal_ver/></div></div>
    </Stack>
        </container>
        <div className='Pag_histo'>
     <Pagination>
      <Pagination.Prev />
      <Pagination.Item active>{1}</Pagination.Item>
      <Pagination.Item>{2}</Pagination.Item>
      <Pagination.Item>{3}</Pagination.Item>
      <Pagination.Ellipsis />
      <Pagination.Item>{10}</Pagination.Item>
      <Pagination.Next />
    </Pagination>
    </div>

    <div className='Footer_historial'>
        <Footer />
    </div>
    </div>
  );    
}

export default Historial_ped;
