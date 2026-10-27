<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <h1>Gestión de Servicios Tecnológicos</h1>
    <nav>
      <RouterLink to="/servicios">Servicios</RouterLink> |
      <RouterLink to="/servicios/nuevo">Nuevo servicio</RouterLink>
    </nav>
  </header>
  <main><RouterView /></main>
</template>
