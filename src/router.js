// src/router.js
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import VistaAcceso from '@/vistas/VistaAcceso.vue'
import VistaCanchas from '@/vistas/VistaCanchas.vue'
import { socio } from '@/sesion.js'

// Usar createWebHashHistory() para que funcione en GitHub Pages
// Las URLs se verán así: http://localhost:5173/#/acceso
const isProduction = import.meta.env.PROD

export const router = createRouter({
  // En producción usamos hash mode, en desarrollo history normal
  history: isProduction ? createWebHashHistory() : createWebHistory(),
  routes: [
    { path: '/', redirect: '/canchas' },
    { path: '/acceso', name: 'acceso', component: VistaAcceso },
    { path: '/canchas', name: 'canchas', component: VistaCanchas, meta: { privada: true } }
  ]
})

router.beforeEach((destino) => {
  if (destino.meta.privada && !socio.value) return { name: 'acceso' }
})