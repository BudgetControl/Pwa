describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear storage before each test
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/app/auth/login');
    });

    it('should display login page correctly', () => {
      cy.url().should('include', '/app/auth/login');
      // Check for key elements instead of specific text
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should display Google sign-in button', () => {
      cy.contains('Google').should('be.visible');
      cy.get('img[alt*="Google"], img[src*="google"]').first().should('be.visible');
    });

    it('should show forgot password link', () => {
      // Check for link that navigates to recovery-password
      cy.get('a[href*="recovery-password"], a').contains(/forgot|password|recuper/i).should('exist');
    });

    it('should show create account link', () => {
      // Check for link that navigates to register
      cy.get('a[href*="register"], a').contains(/create|account|registr|sign up/i).should('exist');
    });

    it('should validate empty form submission', () => {
      cy.get('button[type="submit"]').click();
      // Form should not submit with empty fields
      cy.url().should('include', '/app/auth/login');
    });

    it('should validate email format', () => {
      cy.get('input[type="email"]').type('invalid-email');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      // Should show validation error or stay on login page
      cy.url().should('include', '/app/auth/login');
    });

    it('should navigate to forgot password page', () => {
      cy.get('a[href*="recovery-password"]').first().click();
      cy.url().should('include', '/app/auth/recovery-password');
    });

    it('should navigate to register page', () => {
      cy.get('a[href*="register"]').first().click();
      cy.url().should('include', '/app/auth/register');
    });
  });

  describe('Registration Page', () => {
    beforeEach(() => {
      cy.visit('/app/auth/register');
    });

    it('should display registration form', () => {
      cy.url().should('include', '/app/auth/register');
      cy.contains(/create|register|sign up/i).should('be.visible');
    });

    it('should have required form fields', () => {
      cy.get('input[type="text"]').should('exist'); // Name field
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('have.length.at.least', 2); // Password and confirm password
    });

    it('should navigate back to login', () => {
      cy.get('a[href*="login"]').first().click();
      cy.url().should('include', '/app/auth/login');
    });
  });

  describe('Password Recovery', () => {
    beforeEach(() => {
      cy.visit('/app/auth/recovery-password');
    });

    it('should display password recovery form', () => {
      cy.url().should('include', '/app/auth/recovery-password');
      cy.get('input[type="email"]').should('be.visible');
    });

    it('should have submit button', () => {
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should navigate back to login', () => {
      cy.get('a[href*="login"]').first().click();
      cy.url().should('include', '/app/auth/login');
    });
  });
});
