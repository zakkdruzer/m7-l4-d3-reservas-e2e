// Requisito 4: Cuando el servidor falla
// - Usamos cy.intercept para simular respuestas del servidor.
// - Probamos estados que en la vida real son difíciles de provocar a mano:
//   * error 500
//   * lista vacía
//   * respuesta lenta
// - Importante: cy.intercept debe ir ANTES de cy.visit o de cualquier acción
//   que dispare la petición.

describe('Comportamiento cuando el servidor falla o demora', () => {
  // Antes de cada test, reiniciamos datos y entramos
  beforeEach(() => {
    // Dejamos el servidor como recién instalado
    cy.request('POST', '/api/reset')

    // Entramos al sistema
    cy.visit('/acceso')
    cy.get('[data-cy="correo"]').type('vecino@losaromos.cl')
    cy.get('[data-cy="clave"]').type('cancha2026')
    cy.get('[data-cy="entrar"]').click()

    cy.url().should('include', '/canchas')
  })

  // Escenario 1: Todo normal, pero escuchando la petición de canchas
  it('la petición de canchas responde 200 y se ven las 4 canchas', () => {
    // Escuchamos la petición GET a /api/canchas y le ponemos un alias
    cy.intercept('GET', '/api/canchas').as('cargar')

    // Recargamos la página de canchas para que se dispare la petición
    cy.visit('/canchas')

    // Esperamos a que la petición haya terminado
    cy.wait('@cargar')
      // Comprobamos que la respuesta tuvo status 200
      .its('response.statusCode')
      .should('eq', 200)

    // Y verificamos que se ven las 4 canchas
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 4)
  })

  // Escenario 2: El servidor se cae: contesta 500
  it('muestra mensaje de error y botón "Reintentar" cuando el servidor falla', () => {
    // Interceptamos la petición y forzamos un error 500
    cy.intercept('GET', '/api/canchas', {
      statusCode: 500
    }).as('cargar')

    // Recargamos la pantalla de canchas
    cy.visit('/canchas')

    // Esperamos a que la petición haya ocurrido
    cy.wait('@cargar')

    // Debe verse el mensaje de error
    cy.get('[data-cy="error-canchas"]').should('be.visible')

    // Debe haber botón "Reintentar"
    cy.get('[data-cy="reintentar"]').should('be.visible')

    // No debe haber ninguna cancha
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('not.exist')

    // El mensaje no debe contener el código técnico "500"
    cy.get('[data-cy="error-canchas"]').should('not.contain', '500')
  })

  // Escenario 3: Después de ese error, hago clic en "Reintentar" y ahora el servidor responde
  it('al reintentar después de un error, carga las canchas correctamente', () => {
    // Primera intercepción: simulamos un error 500
    cy.intercept('GET', '/api/canchas', {
      statusCode: 500
    }).as('cargarError')

    // Vamos a la pantalla de canchas
    cy.visit('/canchas')

    // Esperamos el error
    cy.wait('@cargarError')

    // Confirmamos que se ve el error
    cy.get('[data-cy="error-canchas"]').should('be.visible')

    // Segunda intercepción: ahora respondemos con datos válidos
    // Usamos el fixture canchas-tarde.json que creamos antes
    cy.intercept('GET', '/api/canchas', {
      fixture: 'canchas-tarde.json'
    }).as('cargarOk')

    // Hacemos clic en "Reintentar"
    cy.get('[data-cy="reintentar"]').click()

    // Esperamos la nueva petición
    cy.wait('@cargarOk')

    // El mensaje de error debe desaparecer
    cy.get('[data-cy="error-canchas"]').should('not.exist')

    // Y deben verse las 3 canchas del fixture
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 3)
  })

  // Escenario 4: El servidor responde bien, pero sin ninguna cancha libre
  it('muestra estado vacío cuando el servidor responde con lista vacía', () => {
    // Interceptamos y respondemos con una lista vacía
    // Importante: debe ser un objeto con "canchas" y "reservasDelDia", no un arreglo solo
    cy.intercept('GET', '/api/canchas', {
      body: {
        canchas: [],
        reservasDelDia: 0
      }
    }).as('cargar')

    cy.visit('/canchas')

    cy.wait('@cargar')

    // No debe haber ninguna tarjeta de cancha
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('not.exist')

    // Y debe verse el mensaje de estado vacío
    cy.get('[data-cy="vacio"]').should('be.visible')
  })

  // Escenario 5: El servidor se demora 1,5 segundos en contestar
  it('muestra "Cargando las canchas…" mientras el servidor demora en responder', () => {
    // Interceptamos la petición y agregamos un delay de 1500 ms
    cy.intercept('GET', '/api/canchas', {
      delay: 1500,
      body: {
        canchas: [
          { id: 'C-01', nombre: 'Cancha 1', tipo: 'futbolito', hora: '19:00', valor: 24000 },
          { id: 'C-02', nombre: 'Cancha 2', tipo: 'futbolito', hora: '20:00', valor: 24000 },
          { id: 'C-03', nombre: 'Cancha 3', tipo: 'padel', hora: '19:30', valor: 16000 },
          { id: 'C-04', nombre: 'Cancha 4', tipo: 'padel', hora: '21:00', valor: 18000 }
        ],
        reservasDelDia: 0
      }
    }).as('cargarLento')

    cy.visit('/canchas')

    // Antes de esperar, comprobamos que se ve el mensaje de carga
    cy.get('[data-cy="cargando"]').should('be.visible')

    // Esperamos a que termine la petición lenta
    cy.wait('@cargarLento')

    // Después de que responde, el mensaje de carga debe desaparecer
    cy.get('[data-cy="cargando"]').should('not.exist')

    // Y deben verse las 4 canchas
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 4)
  })
})