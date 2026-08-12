// Escenario de ejemplo que viene en la práctica.
// Sirve para comprobar que:
// - Cypress está bien instalado.
// - La aplicación corre en http://localhost:5173
// - El servidor mock de /api responde correctamente.

describe('El complejo está en pie', () => {
  // Escenario 1: la pantalla de acceso se abre en el navegador
  it('la pantalla de acceso se abre en el navegador', () => {
    // Abrimos la ruta de acceso
    cy.visit('/acceso')

    // Comprobamos que el <h1> con el título está visible
    cy.contains('h1', 'Complejo Los Aromos').should('be.visible')
  })

  // Escenario 2: el servidor de canchas responde
  it('el servidor de canchas responde', () => {
    // cy.request golpea el servidor directamente, sin pasar por la interfaz.
    // Lo usamos para comprobar que el backend está funcionando.
    cy.request('/api/canchas')
      // Verificamos que la respuesta tenga status 200
      .its('status')
      .should('eq', 200)
  })
})