// Requisito 5: Comandos propios y la regla del negocio
// - Usamos los comandos personalizados para simplificar los tests.
// - Probamos la regla de máximo 2 reservas por socio.
// - Uno de estos tests debe fallar al principio: hay un defecto en la aplicación.

describe('Regla de las dos reservas por socio', () => {
  // Antes de cada test, reiniciamos datos y entramos
  beforeEach(() => {
    // Dejamos el servidor como recién instalado
    cy.reiniciarDatos()

    // Entramos al sistema usando el comando personalizado
    cy.entrar()
  })

  // Escenario 1: Reservo la cancha C-01
  it('al reservar C-01, desaparece de la lista y el contador dice "1 de 2"', () => {
    // Reservamos la cancha C-01 usando el comando personalizado
    cy.reservarCancha('C-01')

    // La cancha C-01 debe desaparecer de la lista
    cy.get('[data-cy="cancha"][data-id="C-01"]').should('not.exist')

    // Deben quedar 3 canchas
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 3)

    // El contador debe decir "1 de 2"
    cy.get('[data-cy="contador"]').should('contain', '1 de 2')
  })

  // Escenario 2: Reservo C-01 y después C-02
  it('al reservar C-01 y C-02, el contador dice "2 de 2" y se bloquean los botones', () => {
    // Reservamos la primera cancha
    cy.reservarCancha('C-01')

    // Reservamos la segunda cancha
    cy.reservarCancha('C-02')

    // Deben quedar 2 canchas
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 2)

    // El contador debe decir "2 de 2"
    cy.get('[data-cy="contador"]').should('contain', '2 de 2')

    // Debe aparecer el aviso del límite
    cy.get('[data-cy="aviso-limite"]').should('be.visible')

    // Todos los botones "Reservar" que quedan deben estar deshabilitados
    cy.get('[data-cy="lista"] [data-cy="reservar"]').each((boton) => {
      cy.wrap(boton).should('be.disabled')
    })
  })

  // Escenario 3: Reservo C-03 y recargo la pantalla
  it('al reservar C-03 y recargar, la cancha sigue reservada (no vuelve a aparecer)', () => {
    // Escuchamos la petición de reserva para asegurarnos de que el servidor la recibió
    cy.intercept('POST', '/api/canchas/*/reservar').as('reservar')

    // Reservamos la cancha C-03
    cy.reservarCancha('C-03')

    // Esperamos a que la petición de reserva haya terminado
    cy.wait('@reservar')

    // Recargamos la página de canchas
    cy.visit('/canchas')

    // La cancha C-03 debe seguir sin aparecer en la lista
    cy.get('[data-cy="cancha"][data-id="C-03"]').should('not.exist')

    // El contador debe decir "1 de 2" (la reserva se guardó en el servidor)
    cy.get('[data-cy="contador"]').should('contain', '1 de 2')
  })
})