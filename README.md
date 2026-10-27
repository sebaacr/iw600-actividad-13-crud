# Gestión de Servicios Tecnológicos – Actividades 13 y 14 (IW600)

**Estudiante:** Sebastian Concha
**Asignatura:** Ingeniería Web IW600

## Nombre y propósito

Panel de administración de servicios tecnológicos que permite registrar, consultar, editar y
eliminar servicios a través de una API REST local.

- **Actividad 13:** CRUD base con Vue 3, Vue Router, Fetch y JSON Server.
- **Actividad 14:** mejoras del CRUD: búsqueda, filtros, ordenamiento, paginación, validaciones y manejo de errores.

## Tecnologías utilizadas

- Vue 3 (Composition API con `<script setup>`)
- Vue Router
- Fetch API
- JSON Server (API REST local sobre `db.json`)
- Vite

## Requisitos

- Node.js y npm (comprobar con `node -v` y `npm -v`)
- Git
- Navegador web y Visual Studio Code

## Instalación

```bash
git clone URL_DEL_REPOSITORIO
cd iw600-actividad-13-crud
npm install
```

> En Windows, si PowerShell bloquea `npm`, usar `npm.cmd`.

## Ejecución (dos terminales)

**Terminal 1 – API REST (JSON Server):**

```bash
npm run api
```

Equivale a `npx json-server db.json --port 3001`. Verificar en http://localhost:3001/servicios

**Terminal 2 – Aplicación Vue:**

```bash
npm run dev
```

Abrir la URL que indica Vite (por defecto http://localhost:5173).

> La guía de la Actividad 14 usa el puerto 3000; en este proyecto se mantuvo el puerto 3001 de la
> Actividad 13. Si se cambia, actualizar la constante `URL` en `src/services/serviciosApi.js`.

## Estructura y archivos

| Archivo | Descripción | Cambios en la Actividad 14 |
|---------|-------------|----------------------------|
| `db.json` | Base de datos local | 8 servicios y cuarta categoría *Seguridad* |
| `src/main.js` | Registra el router y monta la app | Sin cambios |
| `src/App.vue` | Encabezado, navegación y `RouterView` | Enlaces a las nuevas rutas |
| `src/router/index.js` | Rutas de la aplicación | `/` redirige a `/servicios`; `/servicios/nuevo` y `/servicios/:id/editar` |
| `src/services/serviciosApi.js` | Todas las llamadas HTTP | `solicitud()` común; respuestas vacías no rompen el `JSON.parse` |
| `src/views/ListaServicios.vue` | Listado de servicios | Tabla, búsqueda, filtro, orden, paginación, limpiar filtros y total |
| `src/views/FormularioServicio.vue` | Crear y editar servicios | Validación por campo y mensajes de error |
| `src/style.css` | Estilos | Tabla, filtros, paginación, formulario y tabla adaptable a teléfonos |

> La guía de la Actividad 14 nombra las vistas `ServiciosView.vue` y `ServicioFormView.vue`; aquí se
> adaptaron los nombres de la Actividad 13 (`ListaServicios.vue` y `FormularioServicio.vue`) sin duplicar componentes.

## Funcionalidades

### Actividad 13
- Listado obtenido desde la API REST (no desde un arreglo fijo).
- Creación y edición con el mismo formulario.
- Eliminación con confirmación y mensajes de éxito y error.
- Navegación con Vue Router.
- Filtro por categoría, cantidad de servicios filtrados y bloqueo de doble envío.
- Diseño adaptable y dos servicios propios agregados.

### Actividad 14
- Tabla con búsqueda por **nombre o descripción**.
- **Filtro por categoría** (las categorías se calculan a partir de los datos).
- **Ordenamiento** por nombre A-Z o por precio ascendente/descendente.
- **Paginación** de 5 registros por página.
- Botón **Limpiar filtros** que restablece búsqueda, categoría y orden.
- **Precio total** de los servicios filtrados.
- **Validación** de nombre (mín. 3 caracteres), categoría, precio (> 0) y descripción (mín. 10 caracteres).
- Mensajes de carga, error, lista vacía y confirmación de eliminación.
- Cuarta categoría *Seguridad* con dos servicios nuevos.
- Tabla adaptada a teléfonos: cada fila se muestra como tarjeta con etiquetas.

## Cómo se aplicaron computed, watch, fetch y validaciones

- **computed:** `filtrados` aplica búsqueda, categoría y orden sobre `servicios`; `visibles` toma la
  página actual con `slice`; `totalPaginas`, `categorias` y `precioTotal` también son `computed`.
  Vue los recalcula solo cuando cambian sus dependencias, sin volver a consultar la API.
- **watch:** observa `buscando`, `categoria` y `orden`; cuando cambia alguno, vuelve a la página 1
  para no quedar en una página que ya no existe.
- **fetch:** `serviciosApi.js` concentra las solicitudes GET, POST, PUT y DELETE. Si la respuesta no es
  correcta lanza un `Error`, que cada vista captura con `try/catch` para mostrar un mensaje.
- **Validaciones:** `validar()` revisa cada campo antes de enviar y guarda los mensajes en `errores`,
  que se muestran bajo el campo correspondiente. El formulario usa `novalidate` para que los mensajes
  sean los de la aplicación y no los del navegador.

## Solicitudes HTTP utilizadas

| Método | Ruta | Uso en la aplicación |
|--------|------|----------------------|
| GET | `/servicios` | Obtener el listado completo |
| GET | `/servicios/:id` | Cargar un servicio para editarlo |
| POST | `/servicios` | Crear un servicio nuevo |
| PUT | `/servicios/:id` | Reemplazar los datos de un servicio existente |
| DELETE | `/servicios/:id` | Eliminar un servicio |

## Pruebas realizadas

### Actividad 13

| Prueba | Resultado |
|--------|-----------|
| El listado muestra los registros iniciales | OK |
| La búsqueda por nombre filtra correctamente | OK |
| Crear un servicio: aparece en el listado y en `db.json` | OK |
| Editar el precio: el cambio persiste al recargar | OK |
| Eliminar y cancelar una eliminación | OK |
| Con JSON Server detenido aparece un mensaje de error | OK |
| Las rutas de listado, creación y edición funcionan | OK |

### Actividad 14

| Prueba | Acción | Resultado esperado | Resultado |
|--------|--------|--------------------|-----------|
| P1 | Buscar "red" | Aparecen los servicios que coinciden en nombre o descripción | OK (Auditoría de red, Instalación de red) |
| P2 | Filtrar por Soporte | Solo aparecen servicios de esa categoría | OK |
| P3 | Ordenar por precio descendente | Los precios se muestran de mayor a menor | OK |
| P4 | Cambiar de página | 5 registros en la primera página y el resto en la segunda | OK (8 registros: 5 + 3) |
| P5 | Crear servicio con nombre de dos letras | Se impide guardar y aparece el mensaje | OK |
| P6 | Ingresar precio 0 | Se impide guardar | OK |
| P7 | Crear un servicio válido | Aparece en el listado y en `db.json` | OK |
| P8 | Editar el precio de un servicio | El valor permanece tras recargar | OK |
| P9 | Cancelar una eliminación | El servicio permanece | OK |
| P10 | Apagar JSON Server y recargar | Mensaje "No se pudo conectar con la API." sin bloquear la interfaz | OK |

## Error encontrado y solución

> Completar con el error que encontraste al desarrollar. Ejemplo:

Si JSON Server está detenido, `fetch` lanza una excepción y la vista quedaba sin información útil.
Se resolvió centralizando las llamadas en `serviciosApi.js`, lanzando un `Error` cuando la respuesta
no es correcta (`!respuesta.ok`) y capturándolo con `try/catch` en cada vista para mostrar un mensaje.

## Capturas

Agregar las imágenes en la carpeta `capturas/`:

- Actividad 13: listado, creación, edición y eliminación.
- Actividad 14: listado, filtros, segunda página, validación y formulario editado.

## Preguntas de cierre

### Actividad 13

1. **GET, POST, PUT y DELETE:** GET consulta datos, POST crea un registro, PUT reemplaza un registro existente y DELETE lo elimina.
2. **Separar `serviciosApi.js`:** centraliza la URL y el manejo de errores HTTP; las vistas solo llaman funciones y el código es más fácil de mantener.
3. **JSON Server detenido:** `fetch` falla, se captura el error en el `catch` y la vista muestra el mensaje de error sin romper la aplicación.
4. **`await` en una función `async`:** espera a que la promesa (la respuesta de la API) se resuelva antes de continuar.
5. **Evidencia del CRUD:** los cambios aparecen en `db.json` y se mantienen al recargar la página.

### Actividad 14

1. **¿Por qué usar computed para los filtrados?** Porque guarda en caché el resultado y se recalcula automáticamente solo cuando cambian los datos o los filtros, sin código extra.
2. **Filtrar en el cliente vs. en el servidor:** en el cliente se descargan todos los datos y se filtran en el navegador (rápido con pocos registros); en el servidor solo viajan los resultados, lo que escala mejor con muchos datos.
3. **¿Por qué validar también en el backend?** Porque la validación del frontend se puede saltar (por ejemplo, enviando solicitudes directas a la API); el servidor es quien protege la integridad de los datos.
4. **Si la API no responde al guardar:** la solicitud lanza un error, el `catch` muestra "No fue posible guardar. Verifique la API." y el formulario conserva los datos para reintentar.
5. **Comprobar que una edición persiste:** recargar la página (F5) y verificar el nuevo valor en el listado y en `db.json`.
