import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import './TrazabilidadTecnico.css';
import HeaderTecnicoUnificado from '../HeaderTecnicoUnificado';
import { obtenerCategoria } from '../../../api/CategoriaApi';
import { obtenerSubcategorias } from '../../../api/SubcategotiaApi';
import { authorizedFetch } from '../../../api/http';

function TrazabilidadTecnico() {
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [allSubcategorias, setAllSubcategorias] = useState([]);
  const [elementos, setElementos] = useState([]);
  const [trazas, setTrazas] = useState([]);
  const [filtros, setFiltros] = useState({
    categoria: "",
    subcategoria: "",
    nombre: "",
    fechaInicio: "",
    fechaFin: ""
  });


  useEffect(() => {
    // Cargar categorías y subcategorías al iniciar
    const fetchData = async () => {
      try {
        const [cats, subs, elems] = await Promise.all([
          obtenerCategoria(),
          obtenerSubcategorias(),
          authorizedFetch('/api/elementos').then(r => r.ok ? r.json() : [])
        ]);
        setCategorias(cats);
        setSubcategorias(subs);
        setAllSubcategorias(subs);
        setElementos(elems || []);
      } catch (error) {
        console.error('Error cargando categorías o subcategorías:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });

    // Si cambia la categoría, ajustar subcategorías disponibles
    if (name === 'categoria') {
      if (!value) {
        setSubcategorias(allSubcategorias || []);
        setFiltros(prev => ({ ...prev, subcategoria: '' }));
      } else {
        const filtradas = (allSubcategorias || []).filter(sub => {
          const scCatId = sub.id_cat ?? sub.id_categoria ?? sub.categoria_id ?? sub.categoria;
          return scCatId !== undefined && String(scCatId) === String(value);
        });
        setSubcategorias(filtradas);
        setFiltros(prev => ({ ...prev, subcategoria: '' }));
      }
    }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    try {
      // Usar authorizedFetch para enviar token
      const res = await authorizedFetch('/api/trasabilidad', { method: 'GET' });
      if (!res.ok) throw new Error('Error al obtener trazabilidad: ' + res.status);
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        const text = await res.text();
        throw new Error('Respuesta no es JSON: ' + text);
      }

      // Filtrar usando id_elemen: buscar elementos que pertenezcan a la categoría/subcategoría seleccionada
      const elementosList = elementos || [];
      if (filtros.categoria) {
        const matchingElementIds = elementosList
          .filter(el => String(el.id_categ ?? el.id_cat ?? el.id_categoria ?? el.id_catg) === String(filtros.categoria))
          .map(el => String(el.id_elemen ?? el.id ?? el.id_elemento));

        if (matchingElementIds.length > 0) {
          data = data.filter(t => matchingElementIds.includes(String(t.id_elemen ?? t.id_eleme ?? t.id_elemento)));
        } else {
          // fallback por si la traza trae id_categoria directamente
          data = data.filter(t => String(t.id_categoria ?? t.id_cat ?? t.categoria) === String(filtros.categoria));
        }
      }

      if (filtros.subcategoria) {
        const matchingElementIdsSub = elementosList
          .filter(el => String(el.id_subcat ?? el.id_subcategoria ?? el.sub_catg ?? el.subcat) === String(filtros.subcategoria))
          .map(el => String(el.id_elemen ?? el.id ?? el.id_elemento));

        if (matchingElementIdsSub.length > 0) {
          data = data.filter(t => matchingElementIdsSub.includes(String(t.id_elemen ?? t.id_eleme ?? t.id_elemento)));
        } else {
          // fallback por si la traza trae id_subcategoria directamente
          data = data.filter(t => {
            const traceHasId = String(t.id_subcategoria ?? t.id_subcat ?? t.subcategoria) === String(filtros.subcategoria);
            if (traceHasId) return true;
            // si la traza tiene el nombre de subcategoria (nom_subcat), compararlo con la subcategoria seleccionada
            const selectedSub = (allSubcategorias || []).find(s => String(s.id) === String(filtros.subcategoria) || String(s.id_subcat ?? s._id ?? '') === String(filtros.subcategoria));
            if (selectedSub) {
              const selectedName = (selectedSub.nom_subcateg || selectedSub.nombre || selectedSub.name || '').toLowerCase();
              const trazaName = String((t.nom_subcat ?? t.subcat ?? t.subcategoria) || '').toLowerCase();
              if (selectedName && trazaName && trazaName === selectedName) return true;
            }
            return false;
          });
        }
      }
      if (filtros.nombre) {
        const nombreFiltro = filtros.nombre.toLowerCase();
        data = data.filter(t => {
          // elemento relacionado (si existe)
          const elRelated = elementosList.find(e => String(e.id_elemen ?? e.id ?? e.id_elemento) === String(t.id_elemen ?? t.id_eleme ?? t.id_elemento));
          const campos = [
            t.nom_elemen,
            t.nom_us,
            t.nom_us_reporta,
            t.nom_problm,
            // posibles campos de número de serie en la traza o en el elemento
            t.num_seri,
            t.numero_serie,
            elRelated?.num_seri,
            elRelated?.numero_serie
          ];
          return campos.some(campo => (String(campo || '').toLowerCase()).includes(nombreFiltro));
        });
      }
      if (filtros.fechaInicio) {
        data = data.filter(t => t.fech && t.fech >= filtros.fechaInicio);
      }
      if (filtros.fechaFin) {
        data = data.filter(t => t.fech && t.fech <= filtros.fechaFin);
      }

      setTrazas(data);
    } catch (error) {
      console.error('Error al buscar trazabilidad:', error);
      setTrazas([]);
    }
  };

  return (
    <>
      <HeaderTecnicoUnificado title="Trazabilidad" />
      <div className="trazabilidad-container">
      <Form onSubmit={handleBuscar} className="trazabilidad-form">
        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Categoría</Form.Label>
              <Form.Control as="select" name="categoria" value={filtros.categoria} onChange={handleChange}>
                <option value="">Todas</option>
                {categorias.map((cat, i) => (
                  <option key={String(cat.id ?? cat.id_cat ?? cat._id ?? i)} value={cat.id ?? cat.id_cat ?? cat._id ?? i}>{cat.nom_cat || cat.nombre || cat.name || ''}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Subcategoría</Form.Label>
              <Form.Control as="select" name="subcategoria" value={filtros.subcategoria} onChange={handleChange}>
                <option value="">Todas</option>
                {subcategorias.map((sub, i) => (
                  <option key={String(sub.id ?? sub.id_subcat ?? sub._id ?? sub.id_cat ?? i)} value={sub.id ?? sub.id_subcat ?? sub._id ?? sub.id_cat ?? i}>{sub.nom_subcateg || sub.nom_subc || sub.nombre || sub.name || ''}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Nombre de elemento</Form.Label>
              <Form.Control type="text" name="nombre" value={filtros.nombre} onChange={handleChange} placeholder="Buscar por nombre..." />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Fecha inicio</Form.Label>
              <Form.Control type="date" name="fechaInicio" value={filtros.fechaInicio} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Fecha fin</Form.Label>
              <Form.Control type="date" name="fechaFin" value={filtros.fechaFin} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>
        <Button type="submit" className="mt-3" style={{backgroundColor:'#09b41a', border:'none', fontWeight:'600', fontSize:'1.1rem'}}>Buscar</Button>
      </Form>
      <div>
        {trazas.length === 0 ? (
          <p className="trazabilidad-no-tickets">No hay registros de trazabilidad para los filtros seleccionados.</p>
        ) : (
          <table className="table trazabilidad-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Elemento</th>
                <th>Categoría</th>
                <th>Subcategoría</th>
                <th>Fecha</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              {trazas.map((traza) => {
                const el = (elementos || []).find(e => String(e.id_elemen ?? e.id ?? e.id_elemento) === String(traza.id_elemen || traza.id_eleme || traza.id_elemento));
                const catObj = (categorias || []).find(c => String(c.id) === String(traza.id_categoria || traza.id_cat)) || (categorias || []).find(c => String(c.id) === String(el?.id_cat ?? el?.id_categoria ?? el?.categoria_id));
                const elCat = el ? (el.tip_catg || el.nom_cat || el.categoria || '') : '';
                const trazaCat = (traza.nom_cat || traza.tip_catg || traza.categoria) || '';
                const catObjName = catObj?.nom_cat || catObj?.nombre || '';
                const catName = elCat || trazaCat || catObjName || '';
                const subObj = (allSubcategorias || []).find(s => String(s.id) === String(traza.id_subcategoria || traza.id_subcat)) || (allSubcategorias || []).find(s => String(s.id) === String(el?.id_subcategoria ?? el?.sub_catg ?? el?.id_subcat));
                const elSub = el ? (el.nom_subcat || el.subcat || el.sub_catg || el.id_subcategoria || '') : '';
                const trazaSub = (traza.nom_subcat || traza.subcat || traza.subcategoria) || '';
                const subObjName = subObj?.nom_subcateg || subObj?.nombre || '';
                const subName = elSub || trazaSub || subObjName || '';
                return (
                  <tr key={traza.id_trsa}>
                    <td>{traza.id_trsa}</td>
                    <td>{traza.nom_elemen}</td>
                    <td>{catName}</td>
                    <td>{subName}</td>
                    <td>{traza.fech}</td>
                    <td>{traza.obser}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      </div>
    </>
  );
}

export default TrazabilidadTecnico;
