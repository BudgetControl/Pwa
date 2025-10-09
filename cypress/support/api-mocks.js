// ***********************************************
// API Mocks for Cypress Tests
// This file contains all API mock interceptors
// ***********************************************

/**
 * Setup all API mocks for authentication endpoints
 */
Cypress.Commands.add('mockAuthAPIs', () => {
  // Mock login endpoint
  cy.intercept('POST', '**/api/auth/authenticate', {
    statusCode: 200,
    body: {
      token: 'mock-auth-token-123',
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
      },
      workspaces: [
        { id: 1, name: 'Default Workspace' }
      ]
    }
  }).as('loginAPI');

  cy.intercept('POST', '**/api/auth/authenticate', {
    statusCode: 200,
    body: {
      token: 'mock-auth-token-123',
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
      },
      workspaces: []
    }
  }).as('firstTimeLoginAPI');

  // Mock logout endpoint
  cy.intercept('GET', '**/api/auth/logout', {
    statusCode: 200,
    body: {
      message: 'Logged out successfully'
    }
  }).as('logoutAPI');

  // Mock verify email endpoint
  cy.intercept('POST', '**/api/auth/verify-email', {
    statusCode: 200,
    body: {
      message: 'Verification email sent'
    }
  }).as('verifyEmailAPI');

  // Mock sign-up endpoint
  cy.intercept('POST', '**/api/auth/sign-up', {
    statusCode: 201,
    body: {
      token: 'mock-signup-token',
      user: {
        id: 2,
        email: 'newuser@example.com',
        name: 'New User'
      }
    }
  }).as('signUpAPI');

  // Mock password recovery endpoint
  cy.intercept('POST', '**/api/auth/reset-password', {
    statusCode: 200,
    body: {
      message: 'Password reset email sent'
    }
  }).as('recoveryPasswordAPI');

  // Mock password reset endpoint
  cy.intercept('PUT', '**/api/auth/reset-password/*', {
    statusCode: 200,
    body: {
      message: 'Password reset successfully'
    }
  }).as('resetPasswordAPI');

  // Mock check auth endpoint
  cy.intercept('GET', '**/api/auth/check', {
    statusCode: 200,
    body: {
      token: 'refreshed-auth-token',
      valid: true
    }
  }).as('checkAuthAPI');

  // Mock provider URI endpoint
  cy.intercept('GET', '**/api/auth/authenticate/*', {
    statusCode: 200,
    body: {
      uri: 'https://accounts.google.com/o/oauth2/auth?...'
    }
  }).as('providerUriAPI');

  // Mock provider token endpoint
  cy.intercept('GET', '**/api/auth/authenticate/token/**', {
    statusCode: 200,
    body: {
      token: 'mock-provider-token',
      workspaces: [
        { id: 1, name: 'Default Workspace' }
      ],
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
      }
    }
  }).as('providerTokenAPI');

  // Mock confirm endpoint
  cy.intercept('GET', '**/api/auth/confirm/*', {
    statusCode: 200,
    body: {
      message: 'Account confirmed'
    }
  }).as('confirmAPI');

  // Mock delete user endpoint
  cy.intercept('DELETE', '**/api/auth/delete', {
    statusCode: 200,
    body: {
      message: 'User deleted successfully'
    }
  }).as('deleteUserAPI');

  // Mock delete user data endpoint
  cy.intercept('DELETE', '**/api/auth/data/delete', {
    statusCode: 200,
    body: {
      message: 'User data deleted successfully'
    }
  }).as('deleteUserDataAPI');

  // Mock user settings endpoint
  cy.intercept('GET', '**/api/user/settings', {
    statusCode: 200,
    body: {
      theme: 'light',
      language: 'en',
      currency: 'USD',
      notifications: true
    }
  }).as('userSettingsAPI');

  // Mock user info endpoint
  cy.intercept('GET', '**/api/auth/user-info', {
    statusCode: 200,
    body: {
      token: 'mock-bc-token-123',
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
    }
  }).as('userInfoAPI');

  // Mock user info by email endpoint
  cy.intercept('GET', '**/api/auth/user-info/by-email/*', {
    statusCode: 200,
    body: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com'
    }
  }).as('userInfoByEmailAPI');

  // Mock finalize registration endpoint
  cy.intercept('POST', '**/api/auth/*/finalize/sign-up', {
    statusCode: 200,
    body: {
      token: 'mock-finalized-token',
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
    }
  }).as('finalizeRegistrationAPI');
});

/**
 * Mock login endpoint with custom response
 */
Cypress.Commands.add('mockLogin', (statusCode = 200, response = {}) => {
  const defaultResponse = {
    token: 'mock-auth-token-123',
    user: {
      id: 1,
      email: 'test@example.com',
      name: 'Test User'
    }
  };

  cy.intercept('POST', '**/api/auth/authenticate', {
    statusCode: statusCode,
    body: { ...defaultResponse, ...response }
  }).as('loginAPI');
});

/**
 * Mock login failure
 */
Cypress.Commands.add('mockLoginFailure', (statusCode = 401, message = 'Invalid credentials') => {
  cy.intercept('POST', '**/api/auth/authenticate', {
    statusCode: statusCode,
    body: {
      error: message
    }
  }).as('loginFailureAPI');
});

/**
 * Mock logout endpoint
 */
Cypress.Commands.add('mockLogout', (statusCode = 200) => {
  cy.intercept('GET', '**/api/auth/logout', {
    statusCode: statusCode,
    body: {
      message: 'Logged out successfully'
    }
  }).as('logoutAPI');
});

/**
 * Mock sign-up endpoint with custom response
 */
Cypress.Commands.add('mockSignUp', (statusCode = 201, response = {}) => {
  const defaultResponse = {
    token: 'mock-signup-token',
    user: {
      id: 2,
      email: 'newuser@example.com',
      name: 'New User'
    }
  };

  cy.intercept('POST', '**/api/auth/sign-up', {
    statusCode: statusCode,
    body: { ...defaultResponse, ...response }
  }).as('signUpAPI');
});

/**
 * Mock sign-up failure
 */
Cypress.Commands.add('mockSignUpFailure', (statusCode = 422, errors = {}) => {
  cy.intercept('POST', '**/api/auth/sign-up', {
    statusCode: statusCode,
    body: {
      errors: errors
    }
  }).as('signUpFailureAPI');
});

/**
 * Mock password recovery endpoint
 */
Cypress.Commands.add('mockPasswordRecovery', (statusCode = 200) => {
  cy.intercept('POST', '**/api/auth/reset-password', {
    statusCode: statusCode,
    body: {
      message: 'Password reset email sent'
    }
  }).as('recoveryPasswordAPI');
});

/**
 * Mock user info endpoint
 */
Cypress.Commands.add('mockUserInfo', (statusCode = 200, userInfo = {}) => {
  const defaultUserInfo = {
    token: 'mock-bc-token-123',
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
  };

  cy.intercept('GET', '**/api/auth/user-info', {
    statusCode: statusCode,
    body: { ...defaultUserInfo, ...userInfo }
  }).as('userInfoAPI');
});

/**
 * Mock check auth endpoint
 */
Cypress.Commands.add('mockCheckAuth', (statusCode = 200, valid = true) => {
  cy.intercept('GET', '**/api/auth/check', {
    statusCode: statusCode,
    body: {
      token: 'refreshed-auth-token',
      valid: valid
    }
  }).as('checkAuthAPI');
});

/**
 * Mock all API calls to fail (for offline testing)
 */
Cypress.Commands.add('mockAPIFailure', () => {
  cy.intercept('**/api/**', {
    statusCode: 503,
    body: {
      error: 'Service unavailable'
    }
  }).as('apiFailure');
});

/**
 * Mock network delay for API calls
 */
Cypress.Commands.add('mockAPIDelay', (delay = 2000) => {
  cy.intercept('**/api/**', (req) => {
    req.reply((res) => {
      res.delay = delay;
    });
  }).as('apiDelay');
});
