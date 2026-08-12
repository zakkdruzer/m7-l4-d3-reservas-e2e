// Requisito 2: El acceso
// - Probamos login correcto, incorrecto, Enter y salir.
// - Usamos un beforeEach para dejar el sistema en estado conocido.

describe('Acceso al sistema Los Aromos', () => {
  // Antes de cada test, reiniciamos los datos del servidor
  beforeEach(() => {
    // Llamamos al endpoint que deja las canchas y el contador como al inicio
    cy.request('POST', '/api/reset')
  })

  // Escenario 1: Login correcto
  it('permite entrar con credenciales correctas y muestra las canchas', () => {
    // Abrimos la pantalla de acceso
    cy.visit('/acceso')

    // Escribimos correo y clave
    cy.get('[data-cy="correo"]').type('vecino@losaromos.cl')
    cy.get('[data-cy="clave"]').type('cancha2026')

    // Hacemos clic en "Entrar"
    cy.get('[data-cy="entrar"]').click()

    // Después de entrar, la URL debe ser /canchas
    cy.url().should('include', '/canchas')

    // Debe verse el nombre del socio
    cy.get('[data-cy="socio"]').should('contain', 'Rosa Miranda')

    // Y debe haber 4 canchas en la lista
    cy.get('[data-cy="lista"] [data-cy="cancha"]').should('have.length', 4)
  })

  // Escenario 2: Login incorrecto
  it('muestra mensaje de error cuando las credenciales son incorrectas', () => {
    cy.visit('/acceso')

    // Escribimos un correo que no existe y una clave cualquiera
    cy.get('[data-cy="correo"]').type('correo-falso@ejemplo.com')
    cy.get('[data-cy="clave"]').type('clave-falsa')

    // Hacemos clic en "Entrar"
    cy.get('[data-cy="entrar"]').click()

    // Debemos seguir en /acceso
    cy.url().should('include', '/acceso')

    // Y debe aparecer el mensaje de error
    cy.get('[data-cy="error-acceso"]')
      .should('be.visible')
      .and('contain', 'Correo o clave incorrectos')

    // El formulario debe seguir visible
    cy.get('[data-cy="form-acceso"]').should('be.visible')
  })

  // Escenario 3: El mensaje de error no muestra detalles técnicos
  it('no muestra el código 401 ni la palabra "error" en inglés en el mensaje', () => {
    cy.visit('/acceso')

    cy.get('[data-cy="correo"]').type('correo-falso@ejemplo.com')
    cy.get('[data-cy="clave"]').type('clave-falsa')
    cy.get('[data-cy="entrar"]').click()

    // El mensaje no debe contener "401" ni "error" en inglés
    cy.get('[data-cy="error-acceso"]')
      .should('be.visible')
      .and('not.contain', '401')
      .and('not.contain', 'error')
  })

  // Escenario 4: Entrar presionando Enter
  it('permite entrar presionando Enter en el campo de clave', () => {
    cy.visit('/acceso')

    cy.get('[data-cy="correo"]').type('vecino@losaromos.cl')
    // Escribimos la clave y luego presionamos Enter
    cy.get('[data-cy="clave"]').type('cancha2026{enter}')

    // La URL debe ser /canchas
    cy.url().should('include', '/canchas')

    // Y debe verse el nombre del socio
    cy.get('[data-cy="socio"]').should('contain', 'Rosa Miranda')
  })

  // Escenario 5: Salir y verificar que /canchas sigue protegida
  it('al salir vuelve a /acceso y protege nuevamente /canchas', () => {
    // Primero entramos normalmente
    cy.visit('/acceso')
    cy.get('[data-cy="correo"]').type('vecino@losaromos.cl')
    cy.get('[data-cy="clave"]').type('cancha2026')
    cy.get('[data-cy="entrar"]').click()

    // Confirmamos que estamos en /canchas
    cy.url().should('include', '/canchas')

    // Hacemos clic en "Salir"
    cy.get('[data-cy="salir"]').click()

    // Debe volver a /acceso
    cy.url().should('include', '/acceso')

    // Intentamos entrar de nuevo a /canchas directamente
    cy.visit('/canchas')

    // Debe redirigirnos otra vez a /acceso
    cy.url().should('include', '/acceso')
    cy.get('[data-cy="form-acceso"]').should('be.visible')
  })
})