<script setup>
import { ref, onMounted, computed } from 'vue';
import { obtenerServicios, eliminarServicio } from '../services/serviciosApi';

const servicios = ref([]);
const busqueda = ref('');
const categoria = ref('');
const cargando = ref(false);
const error = ref('');
const mensaje = ref('');

const categorias = computed(() => [...new Set(servicios.value.map(s => s.categoria))]);

const filtrados = computed(() => servicios.value.filter(s =>
  s.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) &&
  (!categoria.value || s.categoria === categoria.value)
));

async function cargar() {
  cargando.value = true; error.value = '';
  try { servicios.value = await obtenerServicios(); }
  catch (e) { error.value = `No fue posible cargar: ${e.message}`; }
  finally { cargando.value = false; }
}

async function borrar(id) {
  if (!confirm('¿Eliminar este servicio?')) return;
  mensaje.value = '';
  try { await eliminarServicio(id); mensaje.value = 'Servicio eliminado'; await cargar(); }
  catch (e) { error.value = `No fue posible eliminar: ${e.message}`; }
}

onMounted(cargar);
</script>

<template>
  <section>
    <h2>Servicios disponibles</h2>
    <div class="filtros">
      <input v-model="busqueda" placeholder="Buscar por nombre" aria-label="Buscar por nombre" />
      <select v-model="categoria" aria-label="Filtrar por categoría">
        <option value="">Todas las categorías</option>
        <option v-for="c in categorias" :key="c">{{ c }}</option>
      </select>
    </div>
    <p v-if="cargando">Cargando servicios...</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <p v-if="mensaje" class="exito">{{ mensaje }}</p>
    <template v-if="!cargando && !error">
      <p class="total">Servicios encontrados: {{ filtrados.length }}</p>
      <p v-if="filtrados.length === 0">Sin resultados.</p>
    </template>
    <div class="grilla">
      <article v-for="s in filtrados" :key="s.id" class="tarjeta">
        <h3>{{ s.nombre }}</h3>
        <p class="categoria">{{ s.categoria }} · ${{ Number(s.precio).toLocaleString('es-CL') }}</p>
        <p>{{ s.descripcion }}</p>
        <div class="acciones">
          <RouterLink :to="`/editar/${s.id}`" class="boton">Editar</RouterLink>
          <button class="peligro" @click="borrar(s.id)">Eliminar</button>
        </div>
      </article>
    </div>
  </section>
</template>
