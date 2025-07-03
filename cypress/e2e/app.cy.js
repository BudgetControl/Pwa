describe('Budget Control App', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads the homepage', () => {
    cy.title().should('contain', 'Budget Control')
    cy.get('body').should('be.visible')
  })

  it('navigates through main sections', () => {
    // Testa la navigazione principale
    cy.get('[data-cy=dashboard-link]').should('exist')
    cy.get('[data-cy=expenses-link]').should('exist')
    cy.get('[data-cy=budget-link]').should('exist')
  })

  it('handles responsive design', () => {
    // Test su mobile
    cy.viewport('iphone-x')
    cy.get('body').should('be.visible')
    
    // Test su tablet
    cy.viewport('ipad-2')
    cy.get('body').should('be.visible')
    
    // Test su desktop
    cy.viewport(1280, 720)
    cy.get('body').should('be.visible')
  })
})
