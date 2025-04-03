import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home.jsx';
import Admin from './components/admin/Admin';
import Tecnico from './components/Tecnico/Tecnico';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path='/Home' element={<Home></Home>}></Route>
      <Route path='/Admin' element={<Admin></Admin>}></Route>
      <Route path='/Tecnico' element={<Tecnico></Tecnico>}></Route>
    </Routes>
    </BrowserRouter>
  );
}
export default App;
