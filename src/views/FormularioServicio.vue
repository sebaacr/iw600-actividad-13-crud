<script setup>
import { reactive } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const editando = Boolean(route.params.id);
const formulario = reactive({ nombre: '', categoria: '', precio: 0, descripcion: '' });
</script>

<template>
  <section>
    <h2>{{ editando ? 'Editar servicio' : 'Nuevo servicio' }}</h2>
    <form @submit.prevent>
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
      <button type="submit">Guardar</button>
      <RouterLink to="/">Cancelar</RouterLink>
    </form>
  </section>
</template>
