// cypress/e2e/03-lista.cy.js
// Requisito 3: La lista y el filtro
// - Usamos cy.reiniciarDatos() y cy.entrar() para simplificar.

describe('Lista de canchas y filtro', () => {
  beforeEach(() => {
    cy.reiniciarDatos()
    cy.entrar()
  })

  it('muestra 4 canchas disponibles al ingresar', () => {
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 4)
  })

  it('muestra nombre, tipo, hora y valor en cada cancha', () => {
    cy.get('[data-cy="lista"] [data-cy="cancha"]').each((fila) => {
      cy.wrap(fila).within(() => {
        cy.get('[data-cy="nombre"]').should('not.be.empty')
        cy.get('[data-cy="tipo"]').should('not.be.empty')
        cy.get('[data-cy="hora"]').should('not.be.empty')
        cy.get('[data-cy="valor"]').should('not.be.empty')
        cy.get('[data-cy="reservar"]').should('be.enabled')
      })
    })
  })

  it('filtra correctamente al seleccionar "Padel"', () => {
    cy.get('[data-cy="filtro-tipo"]').select('padel')

    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 2)

    cy.get('[data-cy="cancha"][data-id="C-03"]').should('exist')
    cy.get('[data-cy="cancha"][data-id="C-04"]').should('exist')
  })

  it('muestra estado vacío cuando no hay canchas del tipo seleccionado', () => {
    cy.get('[data-cy="filtro-tipo"]').select('tenis')

    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('not.exist')
    cy.get('[data-cy="vacio"]').should('be.visible')
  })

  it('vuelve a mostrar las 4 canchas al seleccionar "Todas"', () => {
    cy.get('[data-cy="filtro-tipo"]').select('padel')
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 2)

    cy.get('[data-cy="filtro-tipo"]').select('todas')

    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 4)
  })
})