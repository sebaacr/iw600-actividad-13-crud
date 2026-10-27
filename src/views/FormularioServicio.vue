<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { obtenerServicio, crearServicio, actualizarServicio } from '../services/serviciosApi';

const CATEGORIAS = ['Soporte', 'Desarrollo', 'Redes', 'Seguridad'];

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const editando = computed(() => Boolean(id));
const formulario = ref({ nombre: '', categoria: '', precio: '', descripcion: '' });
const errores = ref({});
const mensajeError = ref('');
const cargando = ref(false);
const guardando = ref(false);

onMounted(async () => {
  if (!id) return;
  cargando.value = true;
  try {
    const datos = await obtenerServicio(id);
    formulario.value = { nombre: datos.nombre, categoria: datos.categoria,
      precio: datos.precio, descripcion: datos.descripcion };
  } catch { mensajeError.value = 'No fue posible cargar el servicio.'; }
  finally { cargando.value = false; }
});

function validar() {
  const f = formulario.value;
  const e = {};
  if (f.nombre.trim().length < 3) e.nombre = 'Ingrese al menos 3 caracteres.';
  if (!CATEGORIAS.includes(f.categoria)) e.categoria = 'Seleccione una categoría.';
  if (f.precio === '' || !Number.isFinite(Number(f.precio)) || Number(f.precio) <= 0)
    e.precio = 'Ingrese un precio mayor que cero.';
  if (f.descripcion.trim().length < 10) e.descripcion = 'Ingrese al menos 10 caracteres.';
  errores.value = e;
  return Object.keys(e).length === 0;
}

async function guardar() {
  // Evita un segundo envío mientras la solicitud anterior sigue en curso
  if (guardando.value) return;
  mensajeError.value = '';
  if (!validar()) return;
  guardando.value = true;
  const datos = {
    nombre: formulario.value.nombre.trim(),
    categoria: formulario.value.categoria,
    precio: Number(formulario.value.precio),
    descripcion: formulario.value.descripcion.trim()
  };
  try {
    if (editando.value) await actualizarServicio(id, { id, ...datos });
    else await crearServicio(datos);
    router.push('/servicios');
  } catch { mensajeError.value = 'No fue posible guardar. Verifique la API.'; }
  finally { guardando.value = false; }
}
</script>

<template>
  <section class="contenedor">
    <h2>{{ editando ? 'Editar servicio' : 'Nuevo servicio' }}</h2>
    <p v-if="cargando">Cargando servicio...</p>
    <form @submit.prevent="guardar" novalidate>
      <label>Nombre <input v-model="formulario.nombre" maxlength="80" /></label>
      <small v-if="errores.nombre" class="error">{{ errores.nombre }}</small>
      <label>Categoría
        <select v-model="formulario.categoria">
          <option value="">Seleccione</option>
          <option v-for="c in CATEGORIAS" :key="c">{{ c }}</option>
        </select>
      </label>
      <small v-if="errores.categoria" class="error">{{ errores.categoria }}</small>
      <label>Precio (CLP) <input v-model="formulario.precio" type="number" min="1" step="1" /></label>
      <small v-if="errores.precio" class="error">{{ errores.precio }}</small>
      <label>Descripción <textarea v-model="formulario.descripcion" rows="4" /></label>
      <small v-if="errores.descripcion" class="error">{{ errores.descripcion }}</small>
      <p v-if="mensajeError" class="error" role="alert">{{ mensajeError }}</p>
      <div class="acciones">
        <button type="submit" :disabled="guardando || cargando">{{ guardando ? 'Guardando...' : 'Guardar' }}</button>
        <RouterLink to="/servicios" class="boton secundario">Cancelar</RouterLink>
      </div>
    </form>
  </section>
</template>
