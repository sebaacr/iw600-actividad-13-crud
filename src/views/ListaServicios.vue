<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { listarServicios, eliminarServicio } from '../services/serviciosApi';

const servicios = ref([]);
const buscando = ref('');
const categoria = ref('Todas');
const orden = ref('nombre-asc');
const pagina = ref(1);
const porPagina = 5;
const cargando = ref(false);
const error = ref('');
const mensaje = ref('');

async function cargar() {
  cargando.value = true;
  error.value = '';
  try { servicios.value = await listarServicios(); }
  catch { error.value = 'No se pudo conectar con la API.'; }
  finally { cargando.value = false; }
}
onMounted(cargar);

const categorias = computed(() => [
  'Todas', ...new Set(servicios.value.map(s => s.categoria))
]);
const filtrados = computed(() => {
  const texto = buscando.value.trim().toLowerCase();
  return servicios.value.filter(s => {
    const coincide = `${s.nombre} ${s.descripcion}`.toLowerCase().includes(texto);
    return coincide && (categoria.value === 'Todas' || s.categoria === categoria.value);
  }).sort((a, b) => {
    if (orden.value === 'precio-asc') return Number(a.precio) - Number(b.precio);
    if (orden.value === 'precio-desc') return Number(b.precio) - Number(a.precio);
    return String(a.nombre).localeCompare(String(b.nombre), 'es');
  });
});
const precioTotal = computed(() =>
  filtrados.value.reduce((suma, s) => suma + Number(s.precio), 0)
);
const totalPaginas = computed(() => Math.max(1, Math.ceil(filtrados.value.length / porPagina)));
const visibles = computed(() => filtrados.value.slice((pagina.value - 1) * porPagina, pagina.value * porPagina));
watch([buscando, categoria, orden], () => { pagina.value = 1; });

function limpiarFiltros() {
  buscando.value = '';
  categoria.value = 'Todas';
  orden.value = 'nombre-asc';
}

async function borrar(servicio) {
  if (!confirm(`¿Eliminar ${servicio.nombre}?`)) return;
  error.value = ''; mensaje.value = '';
  try {
    await eliminarServicio(servicio.id);
    mensaje.value = 'Servicio eliminado correctamente.';
    await cargar();
    pagina.value = Math.min(pagina.value, totalPaginas.value);
  } catch { error.value = 'No fue posible eliminar el servicio.'; }
}
</script>

<template>
  <section class="contenedor">
    <div class="encabezado-lista">
      <h2>Administración de servicios</h2>
      <RouterLink to="/servicios/nuevo" class="boton">Agregar servicio</RouterLink>
    </div>
    <div class="filtros">
      <input v-model="buscando" placeholder="Buscar nombre o descripción" aria-label="Buscar" />
      <select v-model="categoria" aria-label="Filtrar categoría">
        <option v-for="c in categorias" :key="c">{{ c }}</option>
      </select>
      <select v-model="orden" aria-label="Ordenar">
        <option value="nombre-asc">Nombre A-Z</option>
        <option value="precio-asc">Precio menor a mayor</option>
        <option value="precio-desc">Precio mayor a menor</option>
      </select>
      <button type="button" class="secundario" @click="limpiarFiltros">Limpiar filtros</button>
    </div>
    <p v-if="cargando">Cargando servicios...</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <p v-if="mensaje" role="status" class="exito">{{ mensaje }}</p>
    <template v-if="!cargando && !error">
      <p class="total">
        {{ filtrados.length }} servicio(s) encontrado(s) ·
        Total: ${{ precioTotal.toLocaleString('es-CL') }}
      </p>
      <p v-if="filtrados.length === 0">No hay resultados para los filtros seleccionados.</p>
      <table v-else>
        <thead><tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Acciones</th></tr></thead>
        <tbody>
          <tr v-for="s in visibles" :key="s.id">
            <td data-label="Nombre">{{ s.nombre }}</td>
            <td data-label="Categoría">{{ s.categoria }}</td>
            <td data-label="Precio">${{ Number(s.precio).toLocaleString('es-CL') }}</td>
            <td data-label="Acciones">
              <RouterLink :to="`/servicios/${s.id}/editar`" class="boton">Editar</RouterLink>
              <button class="peligro" @click="borrar(s)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav v-if="filtrados.length > porPagina" class="paginacion" aria-label="Páginas">
        <button :disabled="pagina === 1" @click="pagina--">Anterior</button>
        <span>Página {{ pagina }} de {{ totalPaginas }}</span>
        <button :disabled="pagina === totalPaginas" @click="pagina++">Siguiente</button>
      </nav>
    </template>
  </section>
</template>
