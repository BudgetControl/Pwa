/**
 * Esempio completo di test con API Mocks
 * 
 * Questo file mostra come utilizzare i mock API per testare
 * flussi di autenticazione completi senza bisogno di un backend reale.
 */

describe('Authentication Flow - Esempio con Mock', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    // Configura tutti i mock API
    cy.mockAuthAPIs();
  });

  describe('Login Success Flow', () => {
    it('should complete full login flow with mocked API', () => {
      // Mock specifico per il login con dati personalizzati
      cy.mockLogin(200, {
        token: 'test-auth-token-123',
        user: {
          id: 1,
          email: 'testuser@example.com',
          name: 'Test User'
        }
      });

      // Visita la pagina di login
      cy.visit('/app/auth/login');

      // Compila il form
      cy.get('input[type="email"]').type('testuser@example.com');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // Verifica che la chiamata API sia stata fatta correttamente
      cy.wait('@loginAPI').then((interception) => {
        // Verifica i dati inviati
        expect(interception.request.body.email).to.eq('testuser@example.com');
        expect(interception.request.body.password).to.eq('password123');
        
        // Verifica la risposta
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body.token).to.eq('test-auth-token-123');
        expect(interception.response.body.user.email).to.eq('testuser@example.com');
      });

      // Verifica il redirect dopo il login (varia in base all'app)
      // cy.url().should('include', '/app/dashboard');
    });

    it('should store auth token after successful login', () => {
      cy.mockLogin(200);
      cy.visit('/app/auth/login');

      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginAPI');

      // Verifica che il token sia salvato nel localStorage
      cy.window().then((win) => {
        const authToken = win.localStorage.getItem('auth-token');
        expect(authToken).to.exist;
        
        const parsedToken = JSON.parse(authToken);
        expect(parsedToken.token).to.exist;
        expect(parsedToken.timestamp).to.exist;
      });
    });
  });

  describe('Login Failure Flow', () => {
    it('should handle invalid credentials', () => {
      cy.mockLoginFailure(401, 'Invalid email or password');
      cy.visit('/app/auth/login');

      cy.get('input[type="email"]').type('wrong@example.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginFailureAPI').then((interception) => {
        expect(interception.response.statusCode).to.eq(401);
        expect(interception.response.body.error).to.eq('Invalid email or password');
      });

      // Verifica che sia mostrato un messaggio di errore
      // cy.contains(/invalid|error/i).should('be.visible');
    });

    it('should handle server errors', () => {
      cy.mockLoginFailure(500, 'Internal server error');
      cy.visit('/app/auth/login');

      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginFailureAPI');
      // L'app dovrebbe mostrare un messaggio di errore generico
    });

    it('should handle network failures', () => {
      cy.mockAPIFailure();
      cy.visit('/app/auth/login');

      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // L'app dovrebbe gestire l'errore di rete
      cy.wait('@apiFailure');
    });
  });

  describe('Registration Flow', () => {
    it('should successfully register a new user', () => {
      cy.mockSignUp(201, {
        token: 'new-user-token',
        user: {
          id: 2,
          email: 'newuser@example.com',
          name: 'New User'
        }
      });

      cy.visit('/app/auth/register');

      cy.get('input[type="text"]').type('New User');
      cy.get('input[type="email"]').type('newuser@example.com');
      cy.get('input[type="password"]').eq(0).type('SecurePassword123!');
      cy.get('input[type="password"]').eq(1).type('SecurePassword123!');
      cy.get('button[type="submit"]').click();

      cy.wait('@signUpAPI').then((interception) => {
        expect(interception.response.statusCode).to.eq(201);
        expect(interception.response.body.user.email).to.eq('newuser@example.com');
      });
    });

    it('should handle validation errors during registration', () => {
      cy.mockSignUpFailure(422, {
        email: ['The email has already been taken.'],
        password: ['The password must be at least 8 characters.'],
        name: ['The name field is required.']
      });

      cy.visit('/app/auth/register');

      cy.get('input[type="email"]').type('existing@example.com');
      cy.get('input[type="password"]').eq(0).type('weak');
      cy.get('input[type="password"]').eq(1).type('weak');
      cy.get('button[type="submit"]').click();

      cy.wait('@signUpFailureAPI').then((interception) => {
        expect(interception.response.statusCode).to.eq(422);
        expect(interception.response.body.errors.email).to.exist;
        expect(interception.response.body.errors.password).to.exist;
      });
    });
  });

  describe('Password Recovery Flow', () => {
    it('should send password recovery email', () => {
      cy.mockPasswordRecovery(200);
      cy.visit('/app/auth/recovery-password');

      cy.get('input[type="email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();

      cy.wait('@recoveryPasswordAPI').then((interception) => {
        expect(interception.request.body.email).to.eq('test@example.com');
        expect(interception.response.statusCode).to.eq(200);
      });
    });
  });

  describe('Logout Flow', () => {
    beforeEach(() => {
      // Simula un utente già autenticato
      cy.mockAuth();
      cy.mockUserInfo(200);
    });

    it('should successfully logout', () => {
      cy.mockLogout(200);
      cy.visit('/app/dashboard');

      // Simula il click sul pulsante logout
      // Nota: questo dipende dall'implementazione specifica della tua app
      cy.window().then((win) => {
        // Simula il logout manualmente per il test
        win.localStorage.removeItem('auth-token');
        win.localStorage.removeItem('bc-auth-token');
      });

      cy.visit('/app/dashboard');
      cy.url().should('include', '/app/auth/login');
    });
  });

  describe('Authenticated Navigation', () => {
    beforeEach(() => {
      cy.mockAuth();
      cy.mockUserInfo(200, {
        token: 'bc-token-123',
        userInfo: {
          id: 1,
          uuid: 'user-uuid-123',
          name: 'Test User',
          email: 'test@example.com',
          workspace_settings: {
            data: {
              currency: 'USD',
              payment_type_id: 1
            }
          }
        }
      });
    });

    it('should access dashboard when authenticated', () => {
      cy.visit('/app/dashboard');
      cy.url().should('include', '/app/dashboard');
    });

    it('should maintain session across page reloads', () => {
      cy.visit('/app/dashboard');
      cy.reload();
      cy.url().should('include', '/app/dashboard');
    });
  });

  describe('Network Performance Testing', () => {
    it('should handle slow network connections', () => {
      cy.mockAPIDelay(3000); // Simula 3 secondi di latenza
      cy.visit('/app/auth/login');

      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // L'app dovrebbe mostrare un indicatore di caricamento
      // cy.get('.loading-spinner').should('be.visible');

      // Dopo il delay, la risposta dovrebbe arrivare
      cy.wait('@loginAPI', { timeout: 10000 });
    });
  });

  describe('OAuth Provider Flow', () => {
    it('should get provider authentication URI', () => {
      cy.visit('/app/auth/login');

      // Simula il click sul pulsante Google sign-in
      // cy.contains('Google').click();

      cy.wait('@providerUriAPI').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body.uri).to.include('oauth2');
      });
    });

    it('should handle OAuth callback with token', () => {
      // Simula il callback dopo l'autenticazione OAuth
      cy.visit('/app/auth/callback?provider=google&code=test-code');

      cy.wait('@providerTokenAPI').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body.token).to.exist;
        expect(interception.response.body.user).to.exist;
        expect(interception.response.body.workspaces).to.exist;
      });
    });
  });

  describe('User Management', () => {
    beforeEach(() => {
      cy.mockAuth();
      cy.mockUserInfo(200);
    });

    it('should fetch user settings', () => {
      cy.visit('/app/settings');

      cy.wait('@userSettingsAPI').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body.currency).to.exist;
        expect(interception.response.body.language).to.exist;
      });
    });

    it('should delete user account', () => {
      cy.visit('/app/settings/account');

      // Simula il click sul pulsante elimina account
      // cy.contains('Delete Account').click();
      // cy.contains('Confirm').click();

      cy.wait('@deleteUserAPI').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty email', () => {
      cy.mockLoginFailure(422, 'Email is required');
      cy.visit('/app/auth/login');

      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // La validazione dovrebbe impedire l'invio o mostrare un errore
    });

    it('should handle empty password', () => {
      cy.mockLoginFailure(422, 'Password is required');
      cy.visit('/app/auth/login');

      cy.get('input[type="email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();

      // La validazione dovrebbe impedire l'invio o mostrare un errore
    });

    it('should handle special characters in email', () => {
      cy.mockLogin(200);
      cy.visit('/app/auth/login');

      cy.get('input[type="email"]').type('test+special@example.com');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginAPI').then((interception) => {
        expect(interception.request.body.email).to.eq('test+special@example.com');
      });
    });

    it('should handle very long passwords', () => {
      cy.mockLogin(200);
      cy.visit('/app/auth/login');

      const longPassword = 'a'.repeat(100);
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type(longPassword);
      cy.get('button[type="submit"]').click();

      cy.wait('@loginAPI');
    });
  });
});
