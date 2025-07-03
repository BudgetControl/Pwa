// Mock API responses
Cypress.Commands.add('mockGetEntryDetails', (entryId: string, mockResponse: any) => {
  cy.intercept('GET', `**/api/entries/${entryId}`, {
    statusCode: 200,
    body: mockResponse
  }).as('getEntryDetails');
});

Cypress.Commands.add('mockApiError', (endpoint: string, statusCode: number = 500) => {
  cy.intercept('GET', endpoint, {
    statusCode,
    body: { error: 'Simulated API error' }
  }).as('apiError');
});