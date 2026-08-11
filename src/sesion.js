import { ref } from 'vue'

export const socio = ref(JSON.parse(localStorage.getItem('sesion-aromos') || 'null'))

export function guardarSesion(datos) {
  socio.value = datos
  localStorage.setItem('sesion-aromos', JSON.stringify(datos))
}

export function cerrarSesion() {
  socio.value = null
  localStorage.removeItem('sesion-aromos')
}