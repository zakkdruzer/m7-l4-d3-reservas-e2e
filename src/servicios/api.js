const BASE = '/api'

export async function entrar(correo, clave) {
  const respuesta = await fetch(`${BASE}/acceso`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, clave })
  })
  const datos = await respuesta.json()
  if (!respuesta.ok) throw new Error(datos.mensaje || 'No pudimos validar tus datos')
  return datos
}

export async function obtenerCanchas() {
  const respuesta = await fetch(`${BASE}/canchas`)
  if (!respuesta.ok) throw new Error('No pudimos cargar las canchas')
  return respuesta.json()
}

export async function reservarCancha(id) {
  const respuesta = await fetch(`${BASE}/canchas/${id}/reservar`, { method: 'POST' })
  if (!respuesta.ok) throw new Error('No pudimos tomar la reserva')
  return respuesta.json()
}