<script setup>
import { ref, onMounted, computed } from 'vue';
import { obtenerServicios, eliminarServicio } from '../services/serviciosApi';

const servicios = ref([]);
const busqueda = ref('');
const cargando = ref(false);
const error = ref('');
const mensaje = ref('');

const filtrados = computed(() => servicios.value.filter(s =>
  s.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
));

async function cargar() {
  cargando.value = true; error.value = '';
  try { servicios.value = await obtenerServicios(); }
  catch (e) { error.value = `No fue posible cargar: ${e.message}`; }
  finally { cargando.value = false; }
}

async function borrar(id) {
  if (!confirm('¿Eliminar este servicio?')) return;
  try { await eliminarServicio(id); mensaje.value = 'Servicio eliminado'; await cargar(); }
  catch (e) { error.value = `No fue posible eliminar: ${e.message}`; }
}

onMounted(cargar);
</script>

<template>
  <section>
    <h2>Servicios disponibles</h2>
    <input v-model="busqueda" placeholder="Buscar por nombre" />
    <p v-if="cargando">Cargando servicios...</p>
    <p v-if="error" role="alert">{{ error }}</p>
    <p v-if="mensaje">{{ mensaje }}</p>
    <p v-if="!cargando && !error && filtrados.length === 0">Sin resultados.</p>
    <article v-for="s in filtrados" :key="s.id" class="tarjeta">
      <h3>{{ s.nombre }}</h3>
      <p>{{ s.categoria }} · ${{ Number(s.precio).toLocaleString('es-CL') }}</p>
      <p>{{ s.descripcion }}</p>
      <RouterLink :to="`/editar/${s.id}`">Editar</RouterLink>
      <button @click="borrar(s.id)">Eliminar</button>
    </article>
  </section>
</template>
