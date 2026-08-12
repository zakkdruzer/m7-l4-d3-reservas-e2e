import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // URL base de tu app local
    baseUrl: 'http://localhost:5173',
    // Dónde están tus specs
    specPattern: 'cypress/e2e/**/*.cy.js',
    // Archivo de soporte global
    supportFile: 'cypress/support/e2e.js',
    // Tamaño de ventana para pruebas
    viewportWidth: 1280,
    viewportHeight: 800,
    // Tiempo máximo para comandos
    defaultCommandTimeout: 4000,
    // Desactivar video para que sea más rápido
    video: false
  }
})