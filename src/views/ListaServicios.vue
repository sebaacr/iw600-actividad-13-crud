<script setup>
import { ref, onMounted } from 'vue';
import { obtenerServicios } from '../services/serviciosApi';

const servicios = ref([]);
const cargando = ref(false);
const error = ref('');

async function cargar() {
  cargando.value = true; error.value = '';
  try { servicios.value = await obtenerServicios(); }
  catch (e) { error.value = `No fue posible cargar: ${e.message}`; }
  finally { cargando.value = false; }
}

onMounted(cargar);
</script>

<template>
  <section>
    <h2>Servicios disponibles</h2>
    <p v-if="cargando">Cargando servicios...</p>
    <p v-if="error" role="alert">{{ error }}</p>
    <article v-for="s in servicios" :key="s.id" class="tarjeta">
      <h3>{{ s.nombre }}</h3>
      <p>{{ s.categoria }} · ${{ Number(s.precio).toLocaleString('es-CL') }}</p>
      <p>{{ s.descripcion }}</p>
      <RouterLink :to="`/editar/${s.id}`">Editar</RouterLink>
    </article>
  </section>
</template>
