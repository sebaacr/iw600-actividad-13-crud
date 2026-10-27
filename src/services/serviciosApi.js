const URL = 'http://localhost:3001/servicios';

async function solicitud(ruta = '', opciones = {}) {
  const respuesta = await fetch(`${URL}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones
  });
  if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);
  if (respuesta.status === 204) return null;
  return respuesta.json();
}

export const obtenerServicios = () => solicitud();
export const obtenerServicio = (id) => solicitud(`/${id}`);
export const crearServicio = (datos) => solicitud('', {
  method: 'POST', body: JSON.stringify(datos)
});
export const actualizarServicio = (id, datos) => solicitud(`/${id}`, {
  method: 'PUT', body: JSON.stringify(datos)
});
export const eliminarServicio = (id) => solicitud(`/${id}`, {
  method: 'DELETE'
});
