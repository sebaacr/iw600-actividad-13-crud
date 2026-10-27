const URL = 'http://localhost:3001/servicios';

// El error se propaga para que cada vista pueda informar al usuario
async function solicitud(url, opciones = {}) {
  const respuesta = await fetch(url, opciones);
  if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);
  if (respuesta.status === 204) return null;
  const texto = await respuesta.text();
  return texto ? JSON.parse(texto) : null;
}

export const listarServicios = () => solicitud(URL);
export const obtenerServicio = (id) => solicitud(`${URL}/${id}`);
export const crearServicio = (datos) => solicitud(URL, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos)
});
export const actualizarServicio = (id, datos) => solicitud(`${URL}/${id}`, {
  method: 'PUT', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos)
});
export const eliminarServicio = (id) => solicitud(`${URL}/${id}`, {
  method: 'DELETE'
});
