// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './api-mocks'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Hide webpack-dev-server error overlay during tests
Cypress.on('window:before:load', (win) => {
  // Hide the webpack-dev-server overlay
  const hideOverlay = () => {
    const overlay = win.document.getElementById('webpack-dev-server-client-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  };
  
  hideOverlay();
  
  // Also observe for when overlay gets added
  if (win.MutationObserver) {
    const observer = new win.MutationObserver(() => {
      hideOverlay();
    });
    observer.observe(win.document.documentElement, {
      childList: true,
      subtree: true
    });
  }
});
