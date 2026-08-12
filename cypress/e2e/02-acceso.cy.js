// cypress/e2e/02-acceso.cy.js
// Requisito 2: El acceso
// - Usamos cy.reiniciarDatos() y cy.entrar() para simplificar.

describe('Acceso al sistema Los Aromos', () => {
  beforeEach(() => {
    cy.reiniciarDatos()
  })

  it('permite entrar con credenciales correctas y muestra las canchas', () => {
    cy.entrar()

    cy.url().should('include', '/canchas')
    cy.get('[data-cy="socio"]').should('contain', 'Rosa Miranda')
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 4)
  })

  it('muestra mensaje de error cuando las credenciales son incorrectas', () => {
    cy.visit('/acceso')

    cy.get('[data-cy="correo"]').type('correo-falso@ejemplo.com')
    cy.get('[data-cy="clave"]').type('clave-falsa')
    cy.get('[data-cy="entrar"]').click()

    cy.url().should('include', '/acceso')

    cy.get('[data-cy="error-acceso"]')
      .should('be.visible')
      .and('contain', 'Correo o clave incorrectos')

    cy.get('[data-cy="form-acceso"]').should('be.visible')
  })

  it('no muestra el código 401 ni la palabra "error" en inglés en el mensaje', () => {
    cy.visit('/acceso')

    cy.get('[data-cy="correo"]').type('correo-falso@ejemplo.com')
    cy.get('[data-cy="clave"]').type('clave-falsa')
    cy.get('[data-cy="entrar"]').click()

    cy.get('[data-cy="error-acceso"]')
      .should('be.visible')
      .and('not.contain', '401')
      .and('not.contain', 'error')
  })

  it('permite entrar presionando Enter en el campo de clave', () => {
    cy.visit('/acceso')

    cy.get('[data-cy="correo"]').type('vecino@losaromos.cl')
    cy.get('[data-cy="clave"]').type('cancha2026{enter}')

    cy.url().should('include', '/canchas')
    cy.get('[data-cy="socio"]').should('contain', 'Rosa Miranda')
  })

  it('al salir vuelve a /acceso y protege nuevamente /canchas', () => {
    cy.entrar()

    cy.url().should('include', '/canchas')

    cy.get('[data-cy="salir"]').click()

    cy.url().should('include', '/acceso')

    cy.visit('/canchas')

    cy.url().should('include', '/acceso')
    cy.get('[data-cy="form-acceso"]').should('be.visible')
  })
})