describe('Navigation and Routing', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Public Routes', () => {
    it('should redirect to login when accessing root', () => {
      cy.visit('/');
      cy.url().should('include', '/app/auth/login');
    });

    it('should redirect to login when accessing /app', () => {
      cy.visit('/app');
      cy.url().should('include', '/app/auth/login');
    });

    it('should allow access to login page', () => {
      cy.visit('/app/auth/login');
      cy.url().should('include', '/app/auth/login');
      cy.get('input[type="email"]').should('be.visible');
    });

    it('should allow access to register page', () => {
      cy.visit('/app/auth/register');
      cy.url().should('include', '/app/auth/register');
    });

    it('should allow access to password recovery page', () => {
      cy.visit('/app/auth/recovery-password');
      cy.url().should('include', '/app/auth/recovery-password');
    });
  });

  describe('Sidebar Navigation (when authenticated)', () => {
    // Note: These tests assume authentication is mocked or handled
    // In a real scenario, you'd need to mock auth tokens or login first
    
    it('should have sidebar with navigation items', () => {
      cy.visit('/app/auth/login');
      // Mock authentication by setting tokens
      cy.window().then((win) => {
        win.localStorage.setItem('auth-token', JSON.stringify({
          token: 'mock-token',
          timestamp: new Date().toISOString()
        }));
        win.localStorage.setItem('bc-auth-token', JSON.stringify({
          token: 'mock-bc-token',
          timestamp: new Date().toISOString()
        }));
      });
      
      cy.visit('/app/dashboard');
      
      // Check for sidebar navigation items - case insensitive to handle translations
      cy.get('nav, aside, [role="navigation"]').should('exist');
      
      // Check for common navigation links (case-insensitive for translations)
      cy.get('body').then($body => {
        const text = $body.text().toLowerCase();
        const hasNavItems = text.includes('dashboard') || 
                           text.includes('entries') || 
                           text.includes('budget') ||
                           text.includes('stats') ||
                           text.includes('settings');
        expect(hasNavItems).to.be.true;
      });
    });
  });

  describe('Mobile Navigation', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
    });

    it('should show mobile menu toggle on small screens', () => {
      cy.visit('/app/auth/login');
      cy.window().then((win) => {
        win.localStorage.setItem('auth-token', JSON.stringify({
          token: 'mock-token',
          timestamp: new Date().toISOString()
        }));
        win.localStorage.setItem('bc-auth-token', JSON.stringify({
          token: 'mock-bc-token',
          timestamp: new Date().toISOString()
        }));
      });
      
      cy.visit('/app/dashboard');
      
      // Look for hamburger menu icon
      cy.get('button').find('.fa-bars, i[class*="fa-bars"]').should('exist');
    });
  });

  describe('Browser Back/Forward Navigation', () => {
    it('should navigate back and forward correctly', () => {
      cy.visit('/app/auth/login');
      cy.contains('Create new account').click();
      cy.url().should('include', '/app/auth/register');
      
      cy.go('back');
      cy.url().should('include', '/app/auth/login');
      
      cy.go('forward');
      cy.url().should('include', '/app/auth/register');
    });
  });

  describe('Deep Linking', () => {
    it('should handle direct URL access to specific pages', () => {
      cy.visit('/app/auth/register');
      cy.url().should('include', '/app/auth/register');
      
      cy.visit('/app/auth/recovery-password');
      cy.url().should('include', '/app/auth/recovery-password');
    });
  });
});
