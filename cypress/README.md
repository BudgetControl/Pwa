# Cypress E2E Tests for Budget Control PWA

This directory contains end-to-end tests for the Budget Control Progressive Web App using Cypress.

## 📁 Test Structure

```
cypress/
├── e2e/                    # E2E test specs
│   ├── auth.cy.js         # Authentication flow tests
│   ├── navigation.cy.js   # Navigation and routing tests
│   ├── pwa-features.cy.js # PWA-specific features tests
│   ├── ui-components.cy.js # UI components tests
│   ├── accessibility.cy.js # Accessibility (a11y) tests
│   └── security.cy.js     # Security tests
├── fixtures/              # Test data
├── support/               # Support files and custom commands
│   ├── commands.js        # Custom Cypress commands
│   ├── e2e.js            # E2E support file
│   └── component.js       # Component testing support
└── README.md             # This file
```

## 🧪 Test Categories

### 1. Authentication Tests (`auth.cy.js`)
- Login page functionality
- Registration flow
- Password recovery
- Form validation
- OAuth integration (Google Sign-In)

### 2. Navigation Tests (`navigation.cy.js`)
- Public and protected routes
- Sidebar navigation
- Mobile navigation
- Browser back/forward navigation
- Deep linking

### 3. PWA Features Tests (`pwa-features.cy.js`)
- Service Worker registration
- Web App Manifest validation
- Offline functionality
- Installation prompts
- Meta tags for PWA
- Storage APIs
- Responsive design
- Touch interactions

### 4. UI Components Tests (`ui-components.cy.js`)
- Loading indicators
- Form validation UI
- Buttons and input fields
- Links and navigation
- Icons and images
- Error messages
- Cards and layouts
- Translation support

### 5. Accessibility Tests (`accessibility.cy.js`)
- Keyboard navigation
- Screen reader support
- Focus management
- Color contrast
- Text sizing
- Error announcements
- Touch target sizes
- ARIA labels and roles

### 6. Security Tests (`security.cy.js`)
- Authentication security
- Password masking and storage
- XSS protection
- HTTPS usage
- Secure data storage
- Session management
- CORS and API security
- Input validation

## 🚀 Running Tests

### Prerequisites
```bash
npm install
```

### Run all E2E tests (headless)
```bash
npm run test:e2e
```

### Open Cypress Test Runner (interactive)
```bash
npm run test:e2e:open
```

### Run tests in specific browser
```bash
npm run test:e2e:chrome
npm run test:e2e:firefox
```

### Run specific test file
```bash
npx cypress run --spec "cypress/e2e/auth.cy.js"
```

### Run tests with specific viewport
```bash
npx cypress run --config viewportWidth=375,viewportHeight=667
```

## 🛠 Custom Commands

We've created several custom Cypress commands to make testing easier:

### Authentication Commands
```javascript
// Mock authentication
cy.mockAuth();

// Clear authentication
cy.clearAuth();

// Login with credentials
cy.login('email@example.com', 'password');
```

### PWA Testing Commands
```javascript
// Check PWA installability
cy.checkPWAInstallability();

// Simulate offline mode
cy.goOffline();

// Simulate online mode
cy.goOnline();
```

### Utility Commands
```javascript
// Check if element is in viewport
cy.get('.element').isInViewport();

// Wait until element is clickable
cy.get('button').waitUntilClickable();

// Mock API calls
cy.mockApiCall('POST', '/api/auth/login', { token: 'mock-token' });

// Test responsive design
cy.testResponsive((device, width, height) => {
  // Your test code here
});
```

## 📊 Test Configuration

The tests are configured in `cypress.config.js`:

```javascript
{
  e2e: {
    baseUrl: 'http://localhost:8080',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000
  }
}
```

## 🔧 Environment Variables

You can set environment variables for testing:

```bash
# Run tests with custom base URL
CYPRESS_baseUrl=https://staging.budgetcontrol.com npm run test:e2e

# Set API endpoint
CYPRESS_apiUrl=https://api.budgetcontrol.com npm run test:e2e
```

## 📝 Writing New Tests

### Basic Test Structure
```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/app/feature');
  });

  it('should do something', () => {
    // Arrange
    cy.get('.element').should('exist');
    
    // Act
    cy.get('button').click();
    
    // Assert
    cy.url().should('include', '/expected-path');
  });
});
```

### Best Practices
1. **Clear state before each test**: Use `beforeEach` to reset localStorage and cookies
2. **Use data attributes**: Add `data-cy` attributes for reliable selectors
3. **Avoid hard-coded waits**: Use Cypress's built-in retry-ability
4. **Mock external dependencies**: Intercept API calls when appropriate
5. **Test user flows, not implementation**: Focus on what users do, not how code works
6. **Keep tests independent**: Each test should run successfully in isolation
7. **Use custom commands**: Reuse common actions through custom commands

## 🐛 Debugging Tests

### Open Cypress DevTools
When running `npm run test:e2e:open`, you can use the browser's DevTools to inspect elements and debug.

### Take screenshots on failure
Screenshots are automatically taken when tests fail (when running headless).

### Time travel debugging
In the Cypress Test Runner, click on any command to see the state of the app at that moment.

### Console logs
```javascript
cy.log('Custom message');
cy.get('.element').then(console.log);
```

## 🎯 CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: cypress-io/github-action@v5
        with:
          build: npm run build
          start: npm start
          wait-on: 'http://localhost:8080'
```

## 📚 Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [PWA Testing Guide](https://web.dev/pwa-checklist/)
- [Accessibility Testing](https://www.w3.org/WAI/test-evaluate/)

## 🤝 Contributing

When adding new features, please:
1. Write E2E tests covering the new functionality
2. Ensure all existing tests pass
3. Update this README if you add new test categories
4. Follow the existing test structure and naming conventions

## 📄 License

These tests are part of the Budget Control project and follow the same license.
