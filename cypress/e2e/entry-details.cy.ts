describe('Entry Details', () => {
  beforeEach(() => {
    // Mock the API call before visiting the page
    cy.fixture('entryDetails').then((mockData) => {
      cy.mockGetEntryDetails('123', mockData);
    });
  });

  it('should display entry details correctly', () => {
    cy.visit('/entry/123');
    
    // Wait for the API call to complete
    cy.wait('@getEntryDetails');
    
    // Test the UI with mocked data
    cy.contains('Test entry');
    cy.contains('$50.00');
    cy.contains('Food');
  });

  it('should handle API errors gracefully', () => {
    cy.mockApiError('**/api/entries/123', 404);
    cy.visit('/entry/123');
    
    cy.wait('@apiError');
    cy.contains('Entry not found');
  });
});
