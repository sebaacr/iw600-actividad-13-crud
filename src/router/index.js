import { createRouter, createWebHistory } from 'vue-router';
import ListaServicios from '../views/ListaServicios.vue';
import FormularioServicio from '../views/FormularioServicio.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/servicios' },
    { path: '/servicios', component: ListaServicios },
    { path: '/servicios/nuevo', component: FormularioServicio },
    { path: '/servicios/:id/editar', component: FormularioServicio }
  ]
});
