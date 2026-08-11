import { createRouter, createWebHistory } from 'vue-router'
import VistaAcceso from '@/vistas/VistaAcceso.vue'
import VistaCanchas from '@/vistas/VistaCanchas.vue'
import { socio } from '@/sesion.js'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',        redirect: '/canchas' },
    { path: '/acceso',  name: 'acceso',  component: VistaAcceso },
    { path: '/canchas', name: 'canchas', component: VistaCanchas, meta: { privada: true } }
  ]
})

router.beforeEach((destino) => {
  if (destino.meta.privada && !socio.value) return { name: 'acceso' }
})