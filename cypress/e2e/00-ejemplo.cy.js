describe('El complejo esta en pie', () => {
  it('la pantalla de acceso se abre en el navegador', () => {
    cy.visit('/acceso')
    cy.contains('h1', 'Complejo Los Aromos').should('be.visible')
  })

  it('el servidor de canchas responde', () => {
    // cy.request golpea el servidor directo, sin pasar por la pantalla.
    // Sirve para comprobar el backend y para preparar datos.
    cy.request('/api/canchas')
      .its('status')
      .should('eq', 200)
  })
})