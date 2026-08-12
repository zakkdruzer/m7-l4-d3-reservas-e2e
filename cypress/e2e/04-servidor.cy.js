// cypress/e2e/04-servidor.cy.js
// Requisito 4: Cuando el servidor falla
// - Usamos cy.reiniciarDatos() y cy.entrar() para simplificar.

describe('Comportamiento cuando el servidor falla o demora', () => {
  beforeEach(() => {
    cy.reiniciarDatos()
    cy.entrar()
  })

  it('la petición de canchas responde 200 y se ven las 4 canchas', () => {
    cy.intercept('GET', '/api/canchas').as('cargar')

    cy.visit('/canchas')

    cy.wait('@cargar')
      .its('response.statusCode')
      .should('eq', 200)

    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 4)
  })

  it('muestra mensaje de error y botón "Reintentar" cuando el servidor falla', () => {
    cy.intercept('GET', '/api/canchas', {
      statusCode: 500
    }).as('cargar')

    cy.visit('/canchas')

    cy.wait('@cargar')

    cy.get('[data-cy="error-canchas"]').should('be.visible')
    cy.get('[data-cy="reintentar"]').should('be.visible')
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('not.exist')
    cy.get('[data-cy="error-canchas"]').should('not.contain', '500')
  })

  it('al reintentar después de un error, carga las canchas correctamente', () => {
    cy.intercept('GET', '/api/canchas', {
      statusCode: 500
    }).as('cargarError')

    cy.visit('/canchas')

    cy.wait('@cargarError')

    cy.get('[data-cy="error-canchas"]').should('be.visible')

    cy.intercept('GET', '/api/canchas', {
      fixture: 'canchas-tarde.json'
    }).as('cargarOk')

    cy.get('[data-cy="reintentar"]').click()

    cy.wait('@cargarOk')

    cy.get('[data-cy="error-canchas"]').should('not.exist')
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 3)
  })

  it('muestra estado vacío cuando el servidor responde con lista vacía', () => {
    cy.intercept('GET', '/api/canchas', {
      body: {
        canchas: [],
        reservasDelDia: 0
      }
    }).as('cargar')

    cy.visit('/canchas')

    cy.wait('@cargar')

    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('not.exist')
    cy.get('[data-cy="vacio"]').should('be.visible')
  })

  it('muestra "Cargando las canchas…" mientras el servidor demora en responder', () => {
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

    cy.get('[data-cy="cargando"]').should('be.visible')

    cy.wait('@cargarLento')

    cy.get('[data-cy="cargando"]').should('not.exist')
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 4)
  })
})