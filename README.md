# Gestión de Servicios Tecnológicos – Actividad 13 (IW600)

**Estudiante:** Sebastian Concha
**Asignatura:** Ingeniería Web IW600

## Objetivo

Aplicación web que permite registrar, consultar, editar y eliminar servicios tecnológicos
usando Vue 3, Vue Router, Fetch y una API REST local con JSON Server.

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

## Estructura

```
db.json                         Base de datos local
src/main.js                     Registra el router y monta la aplicación
src/App.vue                     Encabezado, navegación y RouterView
src/router/index.js             Rutas /, /nuevo y /editar/:id
src/services/serviciosApi.js    Todas las llamadas HTTP a la API
src/views/ListaServicios.vue    Listado, búsqueda, filtro y eliminación
src/views/FormularioServicio.vue Creación y edición con validación
src/style.css                   Estilos y diseño adaptable
```

## Funcionalidades

- Listado de servicios obtenido desde la API REST.
- Búsqueda por nombre y filtro por categoría.
- Cantidad total de servicios filtrados.
- Creación y edición con el mismo formulario (si la URL trae `id`, se cargan los datos).
- Validación: todos los campos obligatorios y precio mayor que cero.
- El botón Guardar se deshabilita mientras se envía la solicitud (evita doble envío).
- Eliminación con confirmación y mensajes de éxito y error.
- Diseño adaptable a pantallas pequeñas.
- Dos servicios propios agregados: *Respaldo de datos en la nube* y *Desarrollo de API REST*.

## Solicitudes HTTP utilizadas

| Método | Ruta | Uso en la aplicación |
|--------|------|----------------------|
| GET | `/servicios` | Obtener el listado completo |
| GET | `/servicios/:id` | Cargar un servicio para editarlo |
| POST | `/servicios` | Crear un servicio nuevo |
| PUT | `/servicios/:id` | Reemplazar los datos de un servicio existente |
| DELETE | `/servicios/:id` | Eliminar un servicio |

## Pruebas realizadas

| Prueba | Resultado |
|--------|-----------|
| El listado muestra los registros iniciales | OK |
| La búsqueda por nombre filtra correctamente | OK |
| Crear un servicio: aparece en el listado y en `db.json` | OK |
| Editar el precio: el cambio persiste al recargar | OK |
| Eliminar y cancelar una eliminación | OK |
| Con JSON Server detenido aparece "No fue posible cargar: Failed to fetch" | OK |
| Las rutas `/`, `/nuevo` y `/editar/:id` funcionan | OK |

## Error encontrado y solución

> Completar con el error que encontraste al desarrollar. Ejemplo:

Si JSON Server está detenido, `fetch` lanza una excepción y la vista quedaba sin información útil.
Se resolvió centralizando las llamadas en `serviciosApi.js`, lanzando un `Error` cuando la respuesta
no es correcta (`!respuesta.ok`) y capturándolo con `try/catch` en cada vista para mostrar un mensaje.

## Capturas

Agregar las imágenes en la carpeta `capturas/`:

- Listado: `capturas/listado.png`
- Creación: `capturas/creacion.png`
- Edición: `capturas/edicion.png`
- Eliminación: `capturas/eliminacion.png`

## Preguntas de cierre

1. **GET, POST, PUT y DELETE:** GET consulta datos, POST crea un registro, PUT reemplaza un registro existente y DELETE lo elimina.
2. **Separar `serviciosApi.js`:** centraliza la URL y el manejo de errores HTTP; las vistas solo llaman funciones y el código es más fácil de mantener.
3. **JSON Server detenido:** `fetch` falla, se captura el error en el `catch` y la vista muestra el mensaje de error sin romper la aplicación.
4. **`await` en una función `async`:** espera a que la promesa (la respuesta de la API) se resuelva antes de continuar.
5. **Evidencia del CRUD:** los cambios aparecen en `db.json` y se mantienen al recargar la página.
