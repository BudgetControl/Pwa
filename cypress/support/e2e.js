import './commands'

// Configurazioni globali per i test E2E
Cypress.on('uncaught:exception', (err, runnable) => {
  // Previeni il fallimento dei test per errori non gestiti dell'app
  return false
})
