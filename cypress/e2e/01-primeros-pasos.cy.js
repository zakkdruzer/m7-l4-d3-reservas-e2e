// Requisito 1: Abrir y mirar
// - No escribimos en ningún campo.
// - Solo comprobamos qué se ve en pantalla y la URL.

describe('Primeros pasos en Los Aromos', () => {
  // Escenario 1: Visito /acceso y veo el título
  it('muestra el título "Complejo Los Aromos" en la pantalla de acceso', () => {
    // Abrimos la pantalla de acceso
    cy.visit('/acceso')

    // Comprobamos que el <h1> con ese texto está visible
    cy.contains('h1', 'Complejo Los Aromos').should('be.visible')
  })

  // Escenario 2: Visito /acceso y veo el formulario vacío
  it('muestra el formulario de acceso con los campos vacíos', () => {
    cy.visit('/acceso')

    // El formulario debe estar visible
    cy.get('[data-cy="form-acceso"]').should('be.visible')

    // Los campos de correo y clave deben existir y estar vacíos
    cy.get('[data-cy="correo"]').should('have.value', '')
    cy.get('[data-cy="clave"]').should('have.value', '')
  })

  // Escenario 3: Visito /acceso y el botón dice "Entrar" y está habilitado
  it('muestra el botón "Entrar" habilitado en la pantalla de acceso', () => {
    cy.visit('/acceso')

    // El botón debe estar visible, con el texto "Entrar" y habilitado
    cy.get('[data-cy="entrar"]')
      .should('be.visible')
      .and('contain', 'Entrar')
      .and('be.enabled')
  })

  // Escenario 4: Visito /canchas sin haber entrado y me devuelve a /acceso
  it('redirige a /acceso cuando intento entrar a /canchas sin sesión', () => {
    // Intentamos ir directamente a la pantalla protegida
    cy.visit('/canchas')

    // La URL debe ser la de acceso
    cy.url().should('include', '/acceso')

    // Y el formulario de acceso debe verse
    cy.get('[data-cy="form-acceso"]').should('be.visible')
  })
})