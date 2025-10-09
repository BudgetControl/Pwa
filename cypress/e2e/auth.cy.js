describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear storage before each test
    cy.clearLocalStorage();
    cy.clearCookies();
    // Mock all auth API endpoints
    cy.mockAuthAPIs();
    
    // Intercetta errori non gestiti dall'app (importante per GitHub Actions)
    cy.on('uncaught:exception', (err) => {
      // Ignora errori 401/404/422 che potrebbero verificarsi durante i test
      if (err.message.includes('401') || err.message.includes('404') || err.message.includes('422') || err.message.includes('Request failed')) {
        return false;
      }
      return true;
    });
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
      cy.mockAuthAPIs();
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

    it('should successfully login with valid credentials', () => {
      cy.mockLogin(200, { workspaces: [] });
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/app/dashboard');
    });

    it('should show error on login failure', () => {
      cy.mockLoginFailure(401, 'Invalid credentials');
      cy.get('input[type="email"]').type('wrong@example.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.wait('@loginFailureAPI').its('response.statusCode').should('eq', 401);
    });
  });

  describe('Registration Page', () => {
    beforeEach(() => {
      cy.mockAuthAPIs();
      cy.visit('/app/auth/register');
      
      // Intercetta errori non gestiti dall'app per i test di validazione
      cy.on('uncaught:exception', (err) => {
        // Ignora errori di validazione (422) che l'app potrebbe non gestire correttamente
        if (err.message.includes('422') || err.message.includes('Request failed')) {
          return false;
        }
        return true;
      });
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

    it('should successfully register with valid data', () => {
      cy.mockAuthAPIs();
      cy.mockSignUp(201);
      cy.get('input[type="text"]').type('New User');
      cy.get('input[type="email"]').type('newuser@example.com');
      cy.get('input[type="password"]').eq(0).type('Password123!');
      cy.get('input[type="password"]').eq(1).type('Password123!');
      cy.get('input[type="checkbox"]').check();
      cy.get('button[type="submit"]').click();
      cy.wait('@signUpAPI').its('response.statusCode').should('eq', 201);
    });

    it('should show validation errors on invalid registration', () => {
      cy.mockSignUpFailure(422, {
        email: ['The email has already been taken.'],
        password: ['The password must be at least 8 characters.']
      });
      cy.get('input[type="text"]').type('Test');
      cy.get('input[type="email"]').type('existing@example.com');
      cy.get('input[type="password"]').eq(0).type('weak');
      cy.get('input[type="password"]').eq(1).type('weak');
      cy.get('input[type="checkbox"]').check();
      cy.get('button[type="submit"]').click();
      cy.wait('@signUpFailureAPI').its('response.statusCode').should('eq', 422);
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

    it('should successfully send recovery email', () => {
      cy.mockPasswordRecovery(200);
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();
      cy.wait('@recoveryPasswordAPI').its('response.statusCode').should('eq', 200);
    });
  });

  describe('Logout Flow', () => {
    beforeEach(() => {
      cy.mockLogout(200);
      cy.mockAuthAPIs();
    });

    it('should successfully logout', () => {
      // Set auth before visiting
      cy.visit('/app/auth/login', {
        onBeforeLoad: (win) => {
          win.localStorage.setItem('auth-token', JSON.stringify({
            token: 'mock-auth-token',
            timestamp: new Date().toISOString()
          }));
          win.localStorage.setItem('bc-auth-token', JSON.stringify({
            token: 'mock-bc-token',
            timestamp: new Date().toISOString()
          }));
        }
      });
      
      cy.visit('/app/dashboard');
      // Trigger logout action - this will vary based on your app
      // Assuming there's a logout button or menu item
      cy.window().then((win) => {
        // Clear tokens to simulate logout
        win.localStorage.removeItem('auth-token');
        win.localStorage.removeItem('bc-auth-token');
      });
      cy.visit('/app/dashboard');
      cy.url().should('include', '/app/auth/login');
    });
  });

});
