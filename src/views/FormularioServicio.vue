<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { obtenerServicio, crearServicio, actualizarServicio } from '../services/serviciosApi';

const route = useRoute();
const router = useRouter();
const editando = Boolean(route.params.id);
const formulario = reactive({ nombre: '', categoria: '', precio: 0, descripcion: '' });
const error = ref('');

onMounted(async () => {
  if (!editando) return;
  try { Object.assign(formulario, await obtenerServicio(route.params.id)); }
  catch (e) { error.value = `No fue posible cargar: ${e.message}`; }
});

async function guardar() {
  error.value = '';
  const datos = {
    nombre: formulario.nombre,
    categoria: formulario.categoria,
    precio: Number(formulario.precio),
    descripcion: formulario.descripcion
  };
  try {
    if (editando) await actualizarServicio(route.params.id, datos);
    else await crearServicio(datos);
    router.push('/');
  } catch (e) { error.value = `No fue posible guardar: ${e.message}`; }
}
</script>

<template>
  <section>
    <h2>{{ editando ? 'Editar servicio' : 'Nuevo servicio' }}</h2>
    <form @submit.prevent="guardar">
      <label>Nombre <input v-model="formulario.nombre" /></label>
      <label>Categoría
        <select v-model="formulario.categoria">
          <option value="">Seleccione</option>
          <option>Soporte</option>
          <option>Desarrollo</option>
          <option>Redes</option>
        </select>
      </label>
      <label>Precio (CLP) <input v-model.number="formulario.precio" type="number" /></label>
      <label>Descripción <textarea v-model="formulario.descripcion" /></label>
      <p v-if="error" role="alert">{{ error }}</p>
      <button type="submit">Guardar</button>
      <RouterLink to="/">Cancelar</RouterLink>
    </form>
  </section>
</template>
