// cypress/support/commands.js
// Comandos personalizados para simplificar los tests de Los Aromos.
// Estos comandos encapsulan acciones repetitivas y dan nombres que reflejan
// la intención del usuario, no los detalles de implementación.

// cy.reiniciarDatos()
// - Llama al endpoint /api/reset para dejar el servidor como recién instalado.
// - Útil para que todos los tests partan desde el mismo estado.
Cypress.Commands.add('reiniciarDatos', () => {
  return cy.request('POST', '/api/reset')
})

// cy.entrar()
// - Hace el acceso completo con las credenciales del socio.
// - No retorna hasta estar en /canchas con la sesión iniciada.
Cypress.Commands.add('entrar', () => {
  // Vamos a la pantalla de acceso
  cy.visit('/acceso')

  // Escribimos las credenciales
  cy.get('[data-cy="correo"]').type('vecino@losaromos.cl')
  cy.get('[data-cy="clave"]').type('cancha2026')

  // Hacemos clic en "Entrar"
  cy.get('[data-cy="entrar"]').click()

  // Esperamos estar en /canchas
  cy.url().should('include', '/canchas')
})

// cy.reservarCancha(id)
// - Busca la cancha por su data-id y hace clic en su botón "Reservar".
// - El parámetro "id" es el data-id de la cancha (ej: 'C-01', 'C-02', etc.)
Cypress.Commands.add('reservarCancha', (id) => {
  // Buscamos la cancha específica por data-id y hacemos clic en reservar
  return cy.get(`[data-cy="cancha"][data-id="${id}"] [data-cy="reservar"]`).click()
})