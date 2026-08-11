// cypress/e2e/03-lista.cy.js
// Requisito 3: La lista y el filtro
// - Contamos canchas, revisamos sus datos y probamos el filtro.
// - Incluimos el estado vacío (filtro "tenis").

describe('Lista de canchas y filtro', () => {
  // Antes de cada test, reiniciamos datos y entramos
  beforeEach(() => {
    // Dejamos el servidor como recién instalado
    cy.request('POST', '/api/reset')

    // Entramos al sistema
    cy.visit('/acceso')
    cy.get('[data-cy="correo"]').type('vecino@losaromos.cl')
    cy.get('[data-cy="clave"]').type('cancha2026')
    cy.get('[data-cy="entrar"]').click()

    // Esperamos estar en /canchas
    cy.url().should('include', '/canchas')
  })

  // Escenario 1: Hay exactamente 4 canchas al entrar
  it('muestra 4 canchas disponibles al ingresar', () => {
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 4)
  })

  // Escenario 2: Cada cancha tiene nombre, tipo, hora y valor no vacíos
  it('muestra nombre, tipo, hora y valor en cada cancha', () => {
    // Obtenemos todas las canchas
    cy.get('[data-cy="lista"] [data-cy="cancha"]').each((fila) => {
      // "fila" es un elemento DOM plano, lo envolvemos para usar comandos Cypress
      cy.wrap(fila).within(() => {
        // Comprobamos que cada campo tenga texto
        cy.get('[data-cy="nombre"]').should('not.be.empty')
        cy.get('[data-cy="tipo"]').should('not.be.empty')
        cy.get('[data-cy="hora"]').should('not.be.empty')
        cy.get('[data-cy="valor"]').should('not.be.empty')

        // Y que el botón "Reservar" esté habilitado
        cy.get('[data-cy="reservar"]').should('be.enabled')
      })
    })
  })

  // Escenario 3: Filtrar por Padel deja solo 2 canchas (C-03 y C-04)
  it('filtra correctamente al seleccionar "Padel"', () => {
    // Elegimos la opción "padel" del select (el valor, no el texto visible)
    cy.get('[data-cy="filtro-tipo"]').select('padel')

    // Deben quedar 2 canchas
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 2)

    // Identificamos las canchas por data-id, no por posición
    cy.get('[data-cy="cancha"][data-id="C-03"]').should('exist')
    cy.get('[data-cy="cancha"][data-id="C-04"]').should('exist')
  })

  // Escenario 4: Filtrar por Tenis muestra estado vacío
  it('muestra estado vacío cuando no hay canchas del tipo seleccionado', () => {
    // Elegimos "tenis", que no existe en los datos
    cy.get('[data-cy="filtro-tipo"]').select('tenis')

    // No debe haber ninguna tarjeta de cancha
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('not.exist')

    // Y debe verse el mensaje de estado vacío
    cy.get('[data-cy="vacio"]').should('be.visible')
  })

  // Escenario 5: Volver a "Todas" restaura las 4 canchas
  it('vuelve a mostrar las 4 canchas al seleccionar "Todas"', () => {
    // Primero filtramos por algo
    cy.get('[data-cy="filtro-tipo"]').select('padel')
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 2)

    // Luego volvemos a "todas"
    cy.get('[data-cy="filtro-tipo"]').select('todas')

    // Deben aparecer de nuevo las 4 canchas
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 4)
  })
})