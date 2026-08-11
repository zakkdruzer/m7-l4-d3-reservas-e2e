import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// ── SERVIDOR DE DATOS DE LA CLASE ─────────────────────────────────
// Cuatro canchas libres y un contador de reservas del dia.
// Todo en memoria: al apagar el servidor se olvida.
const SEMILLA = () => ([
  { id: 'C-01', nombre: 'Cancha 1', tipo: 'futbolito', hora: '19:00', valor: 24000 },
  { id: 'C-02', nombre: 'Cancha 2', tipo: 'futbolito', hora: '20:00', valor: 24000 },
  { id: 'C-03', nombre: 'Cancha 3', tipo: 'padel',     hora: '19:30', valor: 16000 },
  { id: 'C-04', nombre: 'Cancha 4', tipo: 'padel',     hora: '21:00', valor: 18000 }
])

function apiDeClase() {
  let canchas = SEMILLA()
  let reservasDelDia = 0

  const leerCuerpo = (req) => new Promise((listo) => {
    let crudo = ''
    req.on('data', (trozo) => { crudo += trozo })
    req.on('end', () => listo(crudo ? JSON.parse(crudo) : {}))
  })

  return {
    name: 'api-de-clase',
    configureServer(server) {
      // Al montar en '/api' el prefijo se recorta:
      // /api/canchas llega aca como /canchas.
      server.middlewares.use('/api', async (req, res, next) => {
        const ruta = req.url.split('?')[0]
        res.setHeader('Content-Type', 'application/json')

        if (req.method === 'POST' && ruta === '/acceso') {
          const { correo, clave } = await leerCuerpo(req)
          const ok = correo === 'vecino@losaromos.cl' && clave === 'cancha2026'
          res.statusCode = ok ? 200 : 401
          return res.end(JSON.stringify(
            ok ? { token: 'token-de-clase', nombre: 'Rosa Miranda' }
               : { mensaje: 'Correo o clave incorrectos' }
          ))
        }

        if (req.method === 'GET' && ruta === '/canchas') {
          return res.end(JSON.stringify({ canchas, reservasDelDia }))
        }

        if (req.method === 'POST' && /^\/canchas\/[^/]+\/reservar$/.test(ruta)) {
          const id = ruta.split('/')[2]
          canchas = canchas.filter((c) => c.id !== id)
          reservasDelDia = reservasDelDia + 1
          return res.end(JSON.stringify({ ok: true, reservasDelDia }))
        }

        // Deja todo como recien instalado.
        if (req.method === 'POST' && ruta === '/reset') {
          canchas = SEMILLA()
          reservasDelDia = 0
          return res.end(JSON.stringify({ ok: true }))
        }

        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [vue(), apiDeClase()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  // Puerto fijo: si Vite se cambia solo al 5174, la baseUrl de Cypress
  // apunta a ninguna parte y todos tus tests fallan igual.
  server: { port: 5173, strictPort: true }
})