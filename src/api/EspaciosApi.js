import { authorizedFetch, getJson } from './http';

const BASE_PATH = '/api/espacios';

export async function subirImagenesEspacio(base64Images) {
  const res = await authorizedFetch(`${BASE_PATH}/upload-images`, {
    method: 'POST',
    body: JSON.stringify({ images: base64Images })
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Error ${res.status}`);
  }
  return res.json();
}

export async function crearEspacio(data) {
  const res = await authorizedFetch(BASE_PATH, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Error ${res.status}`);
  }
  return res.json();
}

export async function actualizarEspacio(id, data) {
  const res = await authorizedFetch(`${BASE_PATH}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Error ${res.status}`);
  }
  return res.json();
}

export async function eliminarEspacio(id) {
  const res = await authorizedFetch(`${BASE_PATH}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(await res.text());
  return res.status === 204;
}

export async function obtenerEspacio(id) {
  return getJson(`${BASE_PATH}/${id}`);
}

export async function listarEspacios() {
  return getJson(BASE_PATH);
}
