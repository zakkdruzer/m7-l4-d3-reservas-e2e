<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { entrar } from '@/servicios/api.js'
import { guardarSesion } from '@/sesion.js'

const correo = ref('')
const clave = ref('')
const error = ref('')
const enviando = ref(false)
const router = useRouter()

async function enviar() {
  error.value = ''
  enviando.value = true
  try {
    guardarSesion(await entrar(correo.value, clave.value))
    router.push('/canchas')
  } catch (e) {
    error.value = e.message
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <main class="acceso">
    <h1>Complejo Los Aromos</h1>
    <p>Reserva tu cancha del dia</p>

    <form data-cy="form-acceso" @submit.prevent="enviar">
      <label for="correo">Correo</label>
      <input id="correo" data-cy="correo" v-model="correo" type="email" required>

      <label for="clave">Clave</label>
      <input id="clave" data-cy="clave" v-model="clave" type="password" required>

      <button data-cy="entrar" type="submit" :disabled="enviando">
        {{ enviando ? 'Entrando…' : 'Entrar' }}
      </button>
    </form>

    <p v-if="error" data-cy="error-acceso" role="alert">{{ error }}</p>
  </main>
</template>