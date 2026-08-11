<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerCanchas, reservarCancha } from '@/servicios/api.js'
import { cerrarSesion, socio } from '@/sesion.js'

const LIMITE_DIARIO = 2

const canchas = ref([])
const reservasDelDia = ref(0)
const cargando = ref(false)
const error = ref('')
const tipo = ref('todas')
const router = useRouter()

const visibles = computed(() =>
  tipo.value === 'todas'
    ? canchas.value
    : canchas.value.filter((c) => c.tipo === tipo.value)
)

// Regla del complejo: cada socio toma como maximo 2 canchas al dia.
const limiteAlcanzado = computed(() => reservasDelDia.value > LIMITE_DIARIO)

async function cargar() {
  cargando.value = true
  error.value = ''
  try {
    const datos = await obtenerCanchas()
    canchas.value = datos.canchas
    reservasDelDia.value = datos.reservasDelDia
  } catch {
    error.value = 'No pudimos cargar las canchas. Intenta nuevamente.'
  } finally {
    cargando.value = false
  }
}

async function reservar(id) {
  const datos = await reservarCancha(id)
  reservasDelDia.value = datos.reservasDelDia
  canchas.value = canchas.value.filter((c) => c.id !== id)
}

function salir() {
  cerrarSesion()
  router.push('/acceso')
}

onMounted(cargar)
</script>

<template>
  <main class="canchas">
    <header>
      <h1>Canchas disponibles hoy</h1>
      <p data-cy="socio">{{ socio?.nombre }}</p>
      <p data-cy="contador">Reservas de hoy: {{ reservasDelDia }} de {{ LIMITE_DIARIO }}</p>
      <button data-cy="salir" type="button" @click="salir">Salir</button>
    </header>

    <label for="tipo">Tipo de cancha</label>
    <select id="tipo" data-cy="filtro-tipo" v-model="tipo">
      <option value="todas">Todas</option>
      <option value="futbolito">Futbolito</option>
      <option value="padel">Padel</option>
      <option value="tenis">Tenis</option>
    </select>

    <p v-if="limiteAlcanzado" data-cy="aviso-limite">
      Ya tomaste tus {{ LIMITE_DIARIO }} canchas de hoy.
    </p>

    <p v-if="cargando" data-cy="cargando">Cargando las canchas…</p>

    <div v-else-if="error" data-cy="error-canchas" role="alert">
      <p>{{ error }}</p>
      <button data-cy="reintentar" type="button" @click="cargar">Reintentar</button>
    </div>

    <p v-else-if="visibles.length === 0" data-cy="vacio">
      No hay canchas de ese tipo disponibles.
    </p>

    <ul v-else data-cy="lista">
      <li v-for="c in visibles" :key="c.id" data-cy="cancha" :data-id="c.id">
        <span data-cy="nombre">{{ c.nombre }}</span>
        <span data-cy="tipo">{{ c.tipo }}</span>
        <span data-cy="hora">{{ c.hora }}</span>
        <span data-cy="valor">${{ c.valor }}</span>
        <button
          data-cy="reservar"
          type="button"
          :disabled="limiteAlcanzado"
          @click="reservar(c.id)"
        >Reservar</button>
      </li>
    </ul>
  </main>
</template>