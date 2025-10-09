// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to login
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/app/auth/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/app/auth/login');
  });
});

// Custom command to mock authentication
Cypress.Commands.add('mockAuth', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('auth-token', JSON.stringify({
      token: 'mock-auth-token',
      timestamp: new Date().toISOString()
    }));
    win.localStorage.setItem('bc-auth-token', JSON.stringify({
      token: 'mock-bc-token',
      timestamp: new Date().toISOString()
    }));
  });
});

// Custom command to clear authentication
Cypress.Commands.add('clearAuth', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

// Custom command to check if element is in viewport
Cypress.Commands.add('isInViewport', { prevSubject: true }, (subject) => {
  const rect = subject[0].getBoundingClientRect();
  
  expect(rect.top).to.be.at.least(0);
  expect(rect.left).to.be.at.least(0);
  expect(rect.bottom).to.be.at.most(Cypress.config('viewportHeight'));
  expect(rect.right).to.be.at.most(Cypress.config('viewportWidth'));
  
  return subject;
});

// Custom command to wait for element to be clickable
Cypress.Commands.add('waitUntilClickable', { prevSubject: true }, (subject) => {
  cy.wrap(subject)
    .should('be.visible')
    .should('not.be.disabled')
    .should('have.css', 'pointer-events', 'auto');
  
  return subject;
});

// Custom command to simulate offline mode
Cypress.Commands.add('goOffline', () => {
  cy.log('**Going offline**');
  cy.window().then((win) => {
    cy.stub(win.navigator, 'onLine').value(false);
    win.dispatchEvent(new Event('offline'));
  });
});

// Custom command to simulate online mode
Cypress.Commands.add('goOnline', () => {
  cy.log('**Going online**');
  cy.window().then((win) => {
    cy.stub(win.navigator, 'onLine').value(true);
    win.dispatchEvent(new Event('online'));
  });
});

// Custom command to check PWA installability
Cypress.Commands.add('checkPWAInstallability', () => {
  cy.window().then((win) => {
    // Check for manifest
    const manifest = win.document.querySelector('link[rel="manifest"]');
    expect(manifest, 'Manifest link').to.exist;
    
    // Check for service worker
    expect(win.navigator.serviceWorker, 'Service Worker API').to.exist;
    
    // Check for HTTPS or localhost
    const isSecure = win.location.protocol === 'https:' || 
                     win.location.hostname === 'localhost' ||
                     win.location.hostname === '127.0.0.1';
    expect(isSecure, 'Secure context (HTTPS or localhost)').to.be.true;
  });
});

// Custom command to intercept and mock API calls
Cypress.Commands.add('mockApiCall', (method, url, response, statusCode = 200) => {
  cy.intercept(method, url, {
    statusCode: statusCode,
    body: response,
  }).as(`api${method}${url.replace(/\//g, '_')}`);
});

// Custom command to check responsive design
Cypress.Commands.add('testResponsive', (callback) => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
  ];
  
  viewports.forEach(({ name, width, height }) => {
    cy.viewport(width, height);
    cy.log(`Testing on ${name} (${width}x${height})`);
    callback(name, width, height);
  });
});

// Custom command to simulate tab key navigation
Cypress.Commands.add('tab', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject).trigger('keydown', { key: 'Tab', code: 'Tab', keyCode: 9 });
  } else {
    cy.focused().trigger('keydown', { key: 'Tab', code: 'Tab', keyCode: 9 });
  }
  return cy.focused();
});
