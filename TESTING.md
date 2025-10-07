# Testing Guide - Budget Control PWA

## 📋 Overview

This document provides a comprehensive guide to the testing infrastructure for the Budget Control Progressive Web App (PWA).

## 🎯 Test Coverage Summary

### Total Statistics
- **Test Files**: 6
- **Test Cases**: 117+
- **Testing Framework**: Cypress 13.3.3
- **Test Types**: E2E, Component, Accessibility, Security

### Test Files Breakdown

| File | Test Cases | Focus Area |
|------|-----------|------------|
| `auth.cy.js` | 16 | Authentication flows |
| `navigation.cy.js` | 15 | Navigation and routing |
| `pwa-features.cy.js` | 25 | PWA-specific features |
| `ui-components.cy.js` | 30 | UI components and interactions |
| `accessibility.cy.js` | 18 | Accessibility (a11y) |
| `security.cy.js` | 23 | Security and data protection |

## 🚀 Quick Start

### Prerequisites
```bash
# Install dependencies
npm install
```

### Running Tests

#### Development Mode (Interactive)
```bash
npm run test:e2e:open
```
Opens the Cypress Test Runner for interactive test development and debugging.

#### CI/CD Mode (Headless)
```bash
npm run test:e2e
```
Runs all tests in headless mode, suitable for CI/CD pipelines.

#### Browser-Specific Testing
```bash
# Chrome
npm run test:e2e:chrome

# Firefox
npm run test:e2e:firefox
```

#### Running Specific Tests
```bash
# Single file
npx cypress run --spec "cypress/e2e/auth.cy.js"

# Multiple files
npx cypress run --spec "cypress/e2e/auth.cy.js,cypress/e2e/security.cy.js"

# Pattern matching
npx cypress run --spec "cypress/e2e/**/*security*.cy.js"
```

## 📚 Test Categories

### 1. Authentication Tests (`auth.cy.js`)
Tests the complete authentication flow including:
- ✅ Login page display and functionality
- ✅ Email and password validation
- ✅ Google OAuth sign-in button
- ✅ Registration form and validation
- ✅ Password recovery flow
- ✅ Forgot password links
- ✅ Form submission handling
- ✅ Error message display

**Key Test Cases:**
- Valid/invalid email format validation
- Empty form submission prevention
- Navigation between auth pages
- OAuth button visibility and functionality

### 2. Navigation Tests (`navigation.cy.js`)
Ensures proper routing and navigation:
- ✅ Public route access
- ✅ Protected route redirects
- ✅ Sidebar navigation items
- ✅ Mobile menu functionality
- ✅ Browser back/forward navigation
- ✅ Deep linking support
- ✅ URL parameter handling

**Key Test Cases:**
- Unauthenticated redirect to login
- Sidebar menu item visibility
- Mobile responsive menu toggle
- Browser history navigation

### 3. PWA Features Tests (`pwa-features.cy.js`)
Validates PWA-specific functionality:
- ✅ Service Worker registration
- ✅ Web App Manifest validation
- ✅ Offline mode handling
- ✅ Installation prompt behavior
- ✅ Meta tags (viewport, theme-color)
- ✅ Apple touch icons
- ✅ LocalStorage persistence
- ✅ Responsive design across devices
- ✅ Touch event handling
- ✅ Performance metrics

**Key Test Cases:**
- Service Worker exists and registers
- Manifest has required fields
- Offline message displays when network is down
- Storage persists across reloads
- Responsive on mobile, tablet, desktop

### 4. UI Components Tests (`ui-components.cy.js`)
Tests all UI components and interactions:
- ✅ Loading indicators
- ✅ Form validation feedback
- ✅ Button styles and states
- ✅ Input field behavior
- ✅ Link functionality
- ✅ Layout and spacing
- ✅ Icons and images
- ✅ Error alerts
- ✅ Card components
- ✅ Translation support

**Key Test Cases:**
- Buttons have proper styling and hover states
- Inputs accept and validate data correctly
- Loading spinner appears during operations
- Error messages are displayed properly
- Icons load correctly

### 5. Accessibility Tests (`accessibility.cy.js`)
Ensures the app is accessible to all users:
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Screen reader support (ARIA labels)
- ✅ Focus management
- ✅ Color contrast ratios
- ✅ Text sizing and readability
- ✅ Touch target sizes (44x44px minimum)
- ✅ Language attributes
- ✅ Form label associations
- ✅ Heading hierarchy

**Key Test Cases:**
- Tab navigation through all form elements
- Visible focus indicators
- ARIA labels on inputs
- Alt text on images
- Adequate touch target sizes for mobile

### 6. Security Tests (`security.cy.js`)
Validates security measures:
- ✅ Authentication token protection
- ✅ Password masking
- ✅ XSS prevention
- ✅ HTTPS usage
- ✅ Secure storage practices
- ✅ Session management
- ✅ CORS headers
- ✅ Input validation and sanitization
- ✅ SQL injection prevention
- ✅ Clickjacking protection

**Key Test Cases:**
- Passwords are masked in UI
- Tokens stored securely in localStorage
- XSS payloads are sanitized
- Sensitive data not exposed in URLs
- Auth tokens cleared on logout

## 🛠 Custom Commands

We've created reusable Cypress commands to simplify testing:

### Authentication Commands
```javascript
// Mock authentication for protected routes
cy.mockAuth();

// Clear all auth data
cy.clearAuth();

// Login with credentials
cy.login('user@example.com', 'password123');
```

### PWA Testing Commands
```javascript
// Verify PWA requirements
cy.checkPWAInstallability();

// Simulate offline/online
cy.goOffline();
cy.goOnline();
```

### UI Testing Commands
```javascript
// Check if element is visible in viewport
cy.get('.element').isInViewport();

// Wait for element to be fully clickable
cy.get('button').waitUntilClickable().click();

// Test across multiple viewports
cy.testResponsive((device, width, height) => {
  // Test code here
});
```

### API Mocking Commands
```javascript
// Mock API responses
cy.mockApiCall('POST', '/api/auth/login', {
  token: 'mock-token',
  user: { id: 1, name: 'Test User' }
});
```

## 📊 Test Execution Best Practices

### 1. Test Independence
Each test should be independent and not rely on other tests:
```javascript
beforeEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
  cy.visit('/app/auth/login');
});
```

### 2. Reliable Selectors
Use data attributes for test selectors:
```html
<button data-cy="submit-button">Submit</button>
```
```javascript
cy.get('[data-cy="submit-button"]').click();
```

### 3. Avoid Hard-Coded Waits
Use Cypress's automatic retry-ability instead of `cy.wait(milliseconds)`:
```javascript
// ❌ Bad
cy.wait(5000);
cy.get('.result').should('exist');

// ✅ Good
cy.get('.result', { timeout: 10000 }).should('exist');
```

### 4. Mock External Dependencies
Intercept API calls to make tests faster and more reliable:
```javascript
cy.intercept('GET', '/api/user/profile', {
  statusCode: 200,
  body: { name: 'Test User' }
}).as('getProfile');
```

## 🔍 Debugging Tests

### Using Cypress Test Runner
1. Run `npm run test:e2e:open`
2. Click on any test file
3. Use the Command Log to see each step
4. Click on commands to time-travel to that state
5. Open browser DevTools for deeper inspection

### Debug Commands
```javascript
// Log custom messages
cy.log('Testing login functionality');

// Pause test execution
cy.pause();

// Debug element
cy.get('.element').debug();

// Take screenshot
cy.screenshot('test-state');
```

### Common Issues

#### Test Timing Issues
```javascript
// Wait for specific condition
cy.get('.spinner').should('not.exist');
cy.get('.content').should('be.visible');
```

#### Element Not Found
```javascript
// Increase timeout
cy.get('.element', { timeout: 10000 }).should('exist');

// Wait for element to be visible
cy.get('.element').should('be.visible').click();
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  cypress:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Run Cypress Tests
        uses: cypress-io/github-action@v5
        with:
          build: npm run build
          start: npm start
          wait-on: 'http://localhost:8080'
          browser: chrome
      
      - name: Upload Screenshots
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
```

## 📈 Coverage Goals

### Current Coverage
- ✅ Authentication flows: 100%
- ✅ Navigation and routing: 95%
- ✅ PWA features: 90%
- ✅ UI components: 85%
- ✅ Accessibility: 80%
- ✅ Security: 85%

### Future Enhancements
- [ ] Add visual regression testing
- [ ] Implement API contract testing
- [ ] Add performance testing
- [ ] Cross-browser testing on Safari
- [ ] Mobile device testing on real devices
- [ ] Increase accessibility coverage to 95%

## 🤝 Contributing

When adding new features:

1. **Write tests first** (TDD approach when possible)
2. **Ensure all tests pass** before submitting PR
3. **Add tests for edge cases** and error scenarios
4. **Update this documentation** if adding new test categories
5. **Follow naming conventions**:
   - Files: `feature-name.cy.js`
   - Describe blocks: `'Feature Name'`
   - Test cases: `'should do something specific'`

## 📞 Support

For questions or issues with tests:
- Review the [Cypress Documentation](https://docs.cypress.io)
- Check the `cypress/README.md` for detailed examples
- Review existing tests for patterns and best practices

## 📄 License

These tests are part of the Budget Control project and follow the same license.

---

**Last Updated**: 2025
**Maintained by**: Budget Control Development Team
