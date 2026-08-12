# Los Aromos – Pruebas E2E con Cypress

Suite de pruebas end-to-end para la aplicación de reserva de canchas del Complejo Deportivo Los Aromos.

## Requisitos cubiertos

- **R1:** Abrir y mirar (4 escenarios)
- **R2:** El acceso (5 escenarios)
- **R3:** La lista y el filtro (5 escenarios)
- **R4:** Cuando el servidor falla (5 escenarios)
- **R5:** Comandos propios y la regla de las dos reservas (3 escenarios)

Total: **24 escenarios** (incluyendo los 2 del ejemplo).

## Cómo ejecutar las pruebas

### 1. Instalar dependencias

```bash
npm install
```

### 2. Levantar el backend mock y la aplicación

Este proyecto incluye un **servidor mock** definido en `vite.config.js` que simula la API del backend (`/api/acceso`, `/api/canchas`, `/api/canchas/:id/reservar`, `/api/reset`). Este servidor **solo funciona en desarrollo local** y no está disponible en producción.

```bash
# En una terminal, levanta la aplicación con el servidor mock
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### 3. Ejecutar las pruebas de Cypress

```bash
# En otra terminal, abre Cypress en modo interactivo
npm run cy:open
```

O ejecuta todas las pruebas en modo headless:

```bash
npm run cy:run
```

### 4. Verificar que todo pase

Deberías ver **24 escenarios** pasando en verde:
- 2 del archivo `00-ejemplo.cy.js`
- 4 de `01-primeros-pasos.cy.js`
- 5 de `02-acceso.cy.js`
- 5 de `03-lista.cy.js`
- 5 de `04-servidor.cy.js`
- 3 de `05-reservas.cy.js`

## Notas importantes

### Backend mock

El servidor mock está definido en `vite.config.js` y guarda los datos en memoria. Esto significa que:
- Al reiniciar el servidor (`npm run dev`), los datos vuelven al estado inicial.
- El endpoint `/api/reset` permite dejar los datos como recién instalados (útil para las pruebas).

### Por qué no está en GitHub Pages

Este proyecto **no está desplegado en GitHub Pages** porque:
- GitHub Pages solo sirve archivos estáticos (HTML, CSS, JS).
- El servidor mock de `vite.config.js` requiere Node.js y no puede ejecutarse en GitHub Pages.
- Sin el backend, la aplicación no puede hacer login, cargar canchas ni reservar.

Para usar la aplicación, **es necesario levantar el backend local** con `npm run dev`.

### Comandos personalizados

- `cy.reiniciarDatos()` – Deja el servidor como recién instalado.
- `cy.entrar()` – Hace el acceso completo con las credenciales del socio.
- `cy.reservarCancha(id)` – Reserva una cancha específica por su data-id.

## Hallazgos

### 1. El defecto del R5 (regla de las dos reservas)

**Qué estaba mal:**  
En `src/vistas/VistaCanchas.vue`, la comparación del límite estaba mal planteada. La variable `limiteAlcanzado` usaba `>` en vez de `>=`:

```js
// Incorrecto
const limiteAlcanzado = computed(() => reservasDelDia.value > LIMITE_DIARIO)
```

**Qué provocaba en la vida real:**  
Un socio podía reservar **3 canchas** en lugar de 2, porque el límite solo se activaba cuando `reservasDelDia` era mayor que 2 (es decir, 3 o más). Esto permitía que tres personas se llevaran el recinto completo y el resto se quedara afuera.

**Cómo lo arreglé:**  
Cambié la comparación a `>=`:

```js
// Correcto
const limiteAlcanzado = computed(() => reservasDelDia.value >= LIMITE_DIARIO)
```

**Qué escenario lo delató:**  
El escenario 2 de `05-reservas.cy.js`: al reservar C-01 y C-02, el contador decía "2 de 2", pero el aviso del límite no aparecía y los botones "Reservar" seguían habilitados.

---

### 2. El estado vacío del R3

**Qué pasó:**  
Al filtrar por "Tenis" (un tipo que no existe en los datos), la aplicación debe mostrar un mensaje claro: «No hay canchas de ese tipo disponibles».

**Por qué una pantalla en blanco no es lo mismo:**  
Una pantalla que se queda en blanco parece caída o rota. El socio cierra la aplicación creyendo que no anda. En cambio, un mensaje explícito le dice que el sistema funciona, pero no hay resultados para ese filtro.

**Cómo se probó:**  
En `03-lista.cy.js`, el escenario 4 comprueba dos cosas:
- Que no haya ninguna tarjeta de cancha (`not.exist`).
- Que el mensaje de estado vacío esté visible (`be.visible`).

---

### 3. Un escenario que quise escribir y no pude

**Escenario:**  
Probar que el botón "Reservar" no permita hacer doble clic antes de que llegue la respuesta del servidor (para evitar reservar dos veces la misma cancha por error).

**Por qué no pude:**  
Para esto necesitaría simular un delay en la respuesta de `POST /api/canchas/*/reservar` y luego hacer dos clics rápidos. Sin embargo, el servidor de clase no tiene un endpoint para agregar delay solo en reservas, y modificar `vite.config.js` para agregar ese comportamiento excede el alcance de esta actividad.

**Qué documenté:**  
Si el socio hace clic dos veces muy rápido, podría haber un riesgo de que se cuenten dos reservas. Esto se debería resolver en el frontend deshabilitando el botón inmediatamente después del primer clic, o en el backend validando que no se reserve la misma cancha dos veces.

---

## Estructura del proyecto

```text
reservas-e2e/
  cypress/
    e2e/
      00-ejemplo.cy.js
      01-primeros-pasos.cy.js
      02-acceso.cy.js
      03-lista.cy.js
      04-servidor.cy.js
      05-reservas.cy.js
    fixtures/
      canchas-tarde.json
    support/
      e2e.js
      commands.js
  src/
    servicios/
      api.js
    vistas/
      VistaAcceso.vue
      VistaCanchas.vue
    main.js
    App.vue
    router.js
    sesion.js
  cypress.config.js
  package.json
  vite.config.js
  README.md
```

## Credenciales de acceso

- **Correo:** `vecino@losaromos.cl`
- **Clave:** `cancha2026`
- **Nombre que muestra:** `Rosa Miranda`

## Datos iniciales del servidor

| DATA-ID | NOMBRE     | TIPO      | HORA  | VALOR  |
|---------|------------|-----------|-------|--------|
| C-01    | Cancha 1   | futbolito | 19:00 | $24000 |
| C-02    | Cancha 2   | futbolito | 20:00 | $24000 |
| C-03    | Cancha 3   | padel     | 19:30 | $16000 |
| C-04    | Cancha 4   | padel     | 21:00 | $18000 |

---

## Para ver el resultado debes lanzar el backend en local, puedes ver el resultado parcial en:

https://zakkdruzer.github.io/m7-l4-d3-reservas-e2e
