import { createRouter, createWebHistory } from 'vue-router';
import ListaServicios from '../views/ListaServicios.vue';
import FormularioServicio from '../views/FormularioServicio.vue';

const rutas = [
  { path: '/', component: ListaServicios },
  { path: '/nuevo', component: FormularioServicio },
  { path: '/editar/:id', component: FormularioServicio }
];

export default createRouter({ history: createWebHistory(), routes: rutas });
