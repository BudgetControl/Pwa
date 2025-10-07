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
      cy.contains('Sign in with').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should display Google sign-in button', () => {
      cy.contains('Google').should('be.visible');
      cy.get('img[alt="SignIn with Google"]').should('be.visible');
    });

    it('should show forgot password link', () => {
      cy.contains('Forgot password').should('be.visible');
    });

    it('should show create account link', () => {
      cy.contains('Create new account').should('be.visible');
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
      cy.contains('Forgot password').click();
      cy.url().should('include', '/app/auth/recovery-password');
    });

    it('should navigate to register page', () => {
      cy.contains('Create new account').click();
      cy.url().should('include', '/app/auth/register');
    });
  });

  describe('Registration Page', () => {
    beforeEach(() => {
      cy.visit('/app/auth/register');
    });

    it('should display registration form', () => {
      cy.url().should('include', '/app/auth/register');
      cy.contains('Create Account').should('be.visible');
    });

    it('should have required form fields', () => {
      cy.get('input[type="text"]').should('exist'); // Name field
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('have.length.at.least', 2); // Password and confirm password
    });

    it('should navigate back to login', () => {
      cy.contains('Sign in').click();
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
      cy.contains('Back to login').click();
      cy.url().should('include', '/app/auth/login');
    });
  });
});
