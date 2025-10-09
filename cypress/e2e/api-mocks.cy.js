describe('API Mocks Tests', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Authentication API Mocks', () => {
    it('should mock login API successfully', () => {
      cy.mockLogin(200, {
        token: 'custom-token-123',
        user: {
          id: 99,
          email: 'custom@example.com',
          name: 'Custom User'
        }
      });
      
      cy.request('POST', '/api/auth/authenticate', {
        email: 'test@example.com',
        password: 'password123'
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.token).to.eq('custom-token-123');
        expect(response.body.user.email).to.eq('custom@example.com');
      });
    });

    it('should mock login failure', () => {
      cy.mockLoginFailure(401, 'Invalid credentials');
      
      cy.request({
        method: 'POST',
        url: '/api/auth/authenticate',
        body: {
          email: 'wrong@example.com',
          password: 'wrongpassword'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.error).to.eq('Invalid credentials');
      });
    });

    it('should mock logout API', () => {
      cy.mockLogout(200);
      
      cy.request('GET', '/api/auth/logout').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Logged out successfully');
      });
    });

    it('should mock sign-up API', () => {
      cy.mockSignUp(201);
      
      cy.request('POST', '/api/auth/sign-up', {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'Password123!',
        password_confirmation: 'Password123!'
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.token).to.exist;
        expect(response.body.user).to.exist;
      });
    });

    it('should mock sign-up failure with validation errors', () => {
      cy.mockSignUpFailure(422, {
        email: ['The email has already been taken.'],
        password: ['The password must be at least 8 characters.']
      });
      
      cy.request({
        method: 'POST',
        url: '/api/auth/sign-up',
        body: {
          name: 'Test',
          email: 'existing@example.com',
          password: 'weak',
          password_confirmation: 'weak'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(422);
        expect(response.body.errors).to.exist;
        expect(response.body.errors.email).to.exist;
      });
    });

    it('should mock password recovery API', () => {
      cy.mockPasswordRecovery(200);
      
      cy.request('POST', '/api/auth/reset-password', {
        email: 'test@example.com'
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Password reset email sent');
      });
    });

    it('should mock user info API', () => {
      cy.mockUserInfo(200);
      
      cy.request('GET', '/api/auth/user-info').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.token).to.exist;
        expect(response.body.userInfo).to.exist;
        expect(response.body.userInfo.email).to.eq('test@example.com');
      });
    });

    it('should mock check auth API', () => {
      cy.mockCheckAuth(200, true);
      
      cy.request('GET', '/api/auth/check').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.valid).to.be.true;
        expect(response.body.token).to.exist;
      });
    });

    it('should mock all auth APIs at once', () => {
      cy.mockAuthAPIs();
      
      // Test multiple endpoints
      cy.request('POST', '/api/auth/authenticate', {
        email: 'test@example.com',
        password: 'password123'
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
      
      cy.request('GET', '/api/auth/logout').then((response) => {
        expect(response.status).to.eq(200);
      });
      
      cy.request('GET', '/api/auth/user-info').then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  describe('API Error Handling', () => {
    it('should handle API failures', () => {
      cy.mockAPIFailure();
      
      cy.request({
        method: 'POST',
        url: '/api/auth/authenticate',
        body: {
          email: 'test@example.com',
          password: 'password123'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(503);
        expect(response.body.error).to.eq('Service unavailable');
      });
    });

    it('should simulate network delay', () => {
      cy.mockAPIDelay(1000);
      
      const startTime = Date.now();
      cy.request('POST', '/api/auth/authenticate', {
        email: 'test@example.com',
        password: 'password123'
      }).then(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        expect(duration).to.be.at.least(1000);
      });
    });
  });

  describe('Integration with Auth Flow', () => {
    beforeEach(() => {
      cy.mockAuthAPIs();
    });

    it('should complete full login flow with mocked APIs', () => {
      cy.visit('/app/auth/login');
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      
      cy.wait('@loginAPI').its('response.statusCode').should('eq', 200);
    });

    it('should handle registration flow with mocked APIs', () => {
      cy.visit('/app/auth/register');
      cy.get('input[type="text"]').type('Test User');
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').eq(0).type('Password123!');
      cy.get('input[type="password"]').eq(1).type('Password123!');
      cy.get('button[type="submit"]').click();
      
      cy.wait('@signUpAPI').its('response.statusCode').should('eq', 201);
    });

    it('should handle password recovery flow with mocked APIs', () => {
      cy.visit('/app/auth/recovery-password');
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();
      
      cy.wait('@recoveryPasswordAPI').its('response.statusCode').should('eq', 200);
    });

    it('should handle authenticated navigation with mocked APIs', () => {
      cy.mockAuth();
      cy.mockUserInfo(200);
      
      cy.visit('/app/dashboard');
      
      // Should not redirect to login
      cy.url().should('include', '/app/dashboard');
    });
  });

  describe('Custom Mock Responses', () => {
    it('should allow custom user data in login mock', () => {
      cy.mockLogin(200, {
        token: 'special-token',
        user: {
          id: 42,
          email: 'special@example.com',
          name: 'Special User',
          role: 'admin'
        }
      });
      
      cy.request('POST', '/api/auth/authenticate', {
        email: 'test@example.com',
        password: 'password123'
      }).then((response) => {
        expect(response.body.user.role).to.eq('admin');
        expect(response.body.user.id).to.eq(42);
      });
    });

    it('should allow custom error messages', () => {
      cy.mockLoginFailure(403, 'Account suspended');
      
      cy.request({
        method: 'POST',
        url: '/api/auth/authenticate',
        body: {
          email: 'suspended@example.com',
          password: 'password123'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body.error).to.eq('Account suspended');
      });
    });

    it('should allow custom validation errors', () => {
      cy.mockSignUpFailure(422, {
        email: ['Email is invalid'],
        password: ['Password too weak'],
        name: ['Name is required']
      });
      
      cy.request({
        method: 'POST',
        url: '/api/auth/sign-up',
        body: {},
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(422);
        expect(response.body.errors.email).to.exist;
        expect(response.body.errors.password).to.exist;
        expect(response.body.errors.name).to.exist;
      });
    });
  });

  describe('OAuth Provider Mocks', () => {
    beforeEach(() => {
      cy.mockAuthAPIs();
    });

    it('should mock provider URI endpoint', () => {
      cy.request('GET', '/api/auth/authenticate/google').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.uri).to.exist;
        expect(response.body.uri).to.include('oauth2');
      });
    });

    it('should mock provider token endpoint', () => {
      cy.request('GET', '/api/auth/authenticate/token/google?code=test-code').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.token).to.exist;
        expect(response.body.workspaces).to.exist;
        expect(response.body.user).to.exist;
      });
    });
  });

  describe('User Management Mocks', () => {
    beforeEach(() => {
      cy.mockAuthAPIs();
      cy.mockAuth();
    });

    it('should mock delete user endpoint', () => {
      cy.request('DELETE', '/api/auth/delete').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('User deleted successfully');
      });
    });

    it('should mock delete user data endpoint', () => {
      cy.request('DELETE', '/api/auth/data/delete').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('User data deleted successfully');
      });
    });

    it('should mock user settings endpoint', () => {
      cy.request('GET', '/api/user/settings').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.currency).to.exist;
        expect(response.body.language).to.exist;
      });
    });

    it('should mock user info by email endpoint', () => {
      cy.request('GET', '/api/auth/user-info/by-email/test@example.com').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.email).to.eq('test@example.com');
      });
    });

    it('should mock finalize registration endpoint', () => {
      cy.mockAuthAPIs();
      cy.request('POST', '/api/auth/user-uuid-123/finalize/sign-up', {
        workspace: {
          name: 'My Workspace',
          currency: 'USD',
          payment_type: 'monthly'
        },
        wallet: {
          name: 'Main Wallet',
          balance: 1000,
          type: 'cash',
          currency: 1,
          exclude_from_stats: 0,
          color: '#FF5733'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.token).to.exist;
        expect(response.body.userInfo).to.exist;
      });
    });
  });
});
