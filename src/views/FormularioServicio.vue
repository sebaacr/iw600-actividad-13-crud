<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { obtenerServicio, crearServicio, actualizarServicio } from '../services/serviciosApi';

const route = useRoute();
const router = useRouter();
const editando = Boolean(route.params.id);
const formulario = reactive({ nombre: '', categoria: '', precio: 0, descripcion: '' });
const error = ref('');
const guardando = ref(false);

onMounted(async () => {
  if (!editando) return;
  try { Object.assign(formulario, await obtenerServicio(route.params.id)); }
  catch (e) { error.value = `No fue posible cargar: ${e.message}`; }
});

async function guardar() {
  // Evita un segundo envío mientras la solicitud anterior sigue en curso
  if (guardando.value) return;
  error.value = '';
  if (!formulario.nombre.trim() || !formulario.categoria.trim() ||
      !formulario.descripcion.trim() || Number(formulario.precio) <= 0) {
    error.value = 'Complete todos los campos y escriba un precio mayor que cero.';
    return;
  }
  guardando.value = true;
  const datos = {
    nombre: formulario.nombre.trim(),
    categoria: formulario.categoria.trim(),
    precio: Number(formulario.precio),
    descripcion: formulario.descripcion.trim()
  };
  try {
    if (editando) await actualizarServicio(route.params.id, datos);
    else await crearServicio(datos);
    router.push('/servicios');
  } catch (e) { error.value = `No fue posible guardar: ${e.message}`; }
  finally { guardando.value = false; }
}
</script>

<template>
  <section>
    <h2>{{ editando ? 'Editar servicio' : 'Nuevo servicio' }}</h2>
    <form @submit.prevent="guardar">
      <label>Nombre <input v-model="formulario.nombre" required /></label>
      <label>Categoría
        <select v-model="formulario.categoria" required>
          <option value="">Seleccione</option>
          <option>Soporte</option>
          <option>Desarrollo</option>
          <option>Redes</option>
          <option>Seguridad</option>
        </select>
      </label>
      <label>Precio (CLP) <input v-model.number="formulario.precio" type="number" min="1" required /></label>
      <label>Descripción <textarea v-model="formulario.descripcion" required /></label>
      <p v-if="error" role="alert" class="error">{{ error }}</p>
      <button type="submit" :disabled="guardando">{{ guardando ? 'Guardando...' : 'Guardar' }}</button>
      <RouterLink to="/servicios">Cancelar</RouterLink>
    </form>
  </section>
</template>
