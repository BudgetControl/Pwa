# API Mocks per Cypress Tests

Questa guida spiega come utilizzare i mock API nei test Cypress per simulare le chiamate al backend senza dover avere un server reale attivo.

## Panoramica

Tutti i mock API sono definiti nel file `cypress/support/api-mocks.js` e vengono automaticamente importati in tutti i test e2e attraverso `cypress/support/e2e.js`.

## Comandi Disponibili

### Mock Completi

#### `cy.mockAuthAPIs()`
Configura tutti i mock per gli endpoint di autenticazione in una volta sola.

```javascript
beforeEach(() => {
  cy.mockAuthAPIs();
});
```

Questo comando mocka tutti i seguenti endpoint:
- POST `/api/auth/authenticate` - Login
- GET `/api/auth/logout` - Logout
- POST `/api/auth/verify-email` - Verifica email
- POST `/api/auth/sign-up` - Registrazione
- POST `/api/auth/reset-password` - Recupero password
- PUT `/api/auth/reset-password/*` - Reset password
- GET `/api/auth/check` - Controllo autenticazione
- GET `/api/auth/authenticate/*` - Provider OAuth URI
- GET `/api/auth/authenticate/token/**` - Provider OAuth token
- GET `/api/auth/confirm/*` - Conferma account
- DELETE `/api/auth/delete` - Elimina utente
- DELETE `/api/auth/data/delete` - Elimina dati utente
- GET `/api/user/settings` - Impostazioni utente
- GET `/api/auth/user-info` - Informazioni utente
- GET `/api/auth/user-info/by-email/*` - Info utente per email
- POST `/api/auth/*/finalize/sign-up` - Finalizza registrazione

### Mock Specifici

#### Login

```javascript
// Mock login con successo (status 200)
cy.mockLogin(200);

// Mock login con risposta personalizzata
cy.mockLogin(200, {
  token: 'custom-token',
  user: {
    id: 99,
    email: 'custom@example.com',
    name: 'Custom User'
  }
});

// Mock login con errore
cy.mockLoginFailure(401, 'Invalid credentials');
```

#### Sign-Up

```javascript
// Mock registrazione con successo (status 201)
cy.mockSignUp(201);

// Mock registrazione con risposta personalizzata
cy.mockSignUp(201, {
  token: 'new-user-token',
  user: {
    id: 2,
    email: 'newuser@example.com',
    name: 'New User'
  }
});

// Mock registrazione con errori di validazione
cy.mockSignUpFailure(422, {
  email: ['The email has already been taken.'],
  password: ['The password must be at least 8 characters.']
});
```

#### Logout

```javascript
// Mock logout con successo
cy.mockLogout(200);
```

#### Password Recovery

```javascript
// Mock recupero password
cy.mockPasswordRecovery(200);
```

#### User Info

```javascript
// Mock user info con successo
cy.mockUserInfo(200);

// Mock user info con dati personalizzati
cy.mockUserInfo(200, {
  token: 'custom-bc-token',
  userInfo: {
    id: 1,
    name: 'Custom Name',
    email: 'custom@example.com',
    workspace_settings: {
      data: {
        currency: 'EUR',
        payment_type_id: 2
      }
    }
  }
});
```

#### Check Auth

```javascript
// Mock check auth con successo
cy.mockCheckAuth(200, true);

// Mock check auth con token non valido
cy.mockCheckAuth(401, false);
```

### Mock per Testing Offline/Errori

#### API Failure

```javascript
// Simula fallimento di tutte le API (status 503)
cy.mockAPIFailure();
```

#### API Delay

```javascript
// Simula ritardo di 2 secondi nelle risposte API
cy.mockAPIDelay(2000);
```

## Esempi di Utilizzo

### Test di Login Completo

```javascript
describe('Login Flow', () => {
  beforeEach(() => {
    cy.mockAuthAPIs();
    cy.visit('/app/auth/login');
  });

  it('should successfully login with valid credentials', () => {
    cy.mockLogin(200);
    
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@loginAPI').its('response.statusCode').should('eq', 200);
    cy.url().should('not.include', '/app/auth/login');
  });

  it('should show error on invalid credentials', () => {
    cy.mockLoginFailure(401, 'Invalid email or password');
    
    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@loginFailureAPI').its('response.statusCode').should('eq', 401);
    cy.contains(/invalid|error/i).should('be.visible');
  });
});
```

### Test di Registrazione

```javascript
describe('Registration Flow', () => {
  beforeEach(() => {
    cy.mockAuthAPIs();
    cy.visit('/app/auth/register');
  });

  it('should successfully register a new user', () => {
    cy.mockSignUp(201);
    
    cy.get('input[type="text"]').type('New User');
    cy.get('input[type="email"]').type('newuser@example.com');
    cy.get('input[type="password"]').eq(0).type('Password123!');
    cy.get('input[type="password"]').eq(1).type('Password123!');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@signUpAPI').its('response.statusCode').should('eq', 201);
  });

  it('should show validation errors', () => {
    cy.mockSignUpFailure(422, {
      email: ['The email has already been taken.']
    });
    
    cy.get('input[type="text"]').type('Test');
    cy.get('input[type="email"]').type('existing@example.com');
    cy.get('input[type="password"]').eq(0).type('pass');
    cy.get('input[type="password"]').eq(1).type('pass');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@signUpFailureAPI').its('response.statusCode').should('eq', 422);
  });
});
```

### Test con Autenticazione Mock

```javascript
describe('Authenticated Pages', () => {
  beforeEach(() => {
    cy.mockAuthAPIs();
    cy.mockAuth(); // Imposta i token nel localStorage
    cy.mockUserInfo(200);
  });

  it('should access dashboard when authenticated', () => {
    cy.visit('/app/dashboard');
    
    cy.url().should('include', '/app/dashboard');
    cy.url().should('not.include', '/app/auth/login');
  });
});
```

### Test Offline

```javascript
describe('Offline Behavior', () => {
  beforeEach(() => {
    cy.visit('/app/auth/login');
  });

  it('should handle API failures gracefully', () => {
    cy.mockAPIFailure();
    
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Dovrebbe mostrare un messaggio di errore di rete
    cy.contains(/error|failed|unavailable/i).should('be.visible');
  });
});
```

### Test con Ritardi di Rete

```javascript
describe('Network Performance', () => {
  beforeEach(() => {
    cy.mockAuthAPIs();
    cy.visit('/app/auth/login');
  });

  it('should show loading state during API calls', () => {
    cy.mockAPIDelay(2000);
    
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Dovrebbe mostrare un indicatore di caricamento
    cy.get('.loading, .spinner').should('be.visible');
  });
});
```

## Verifica delle Chiamate API

Tutti i mock creano automaticamente degli alias che possono essere usati con `cy.wait()`:

```javascript
cy.wait('@loginAPI');
cy.wait('@signUpAPI');
cy.wait('@logoutAPI');
cy.wait('@userInfoAPI');
// etc...
```

Puoi anche verificare i dettagli della richiesta e della risposta:

```javascript
cy.wait('@loginAPI').then((interception) => {
  expect(interception.request.body.email).to.eq('test@example.com');
  expect(interception.response.statusCode).to.eq(200);
  expect(interception.response.body.token).to.exist;
});
```

## Best Practices

1. **Usa `cy.mockAuthAPIs()` come default**: Nella maggior parte dei test, è sufficiente usare questo comando per configurare tutti i mock necessari.

2. **Mock specifici per scenari particolari**: Usa i mock specifici (`cy.mockLogin()`, `cy.mockSignUp()`, etc.) solo quando hai bisogno di personalizzare le risposte.

3. **Testa sia successi che fallimenti**: Assicurati di testare sia i flussi di successo che quelli di errore.

4. **Verifica le chiamate API**: Usa sempre `cy.wait('@apiAlias')` per assicurarti che le chiamate API siano effettivamente fatte.

5. **Combina con `cy.mockAuth()`**: Per testare pagine che richiedono autenticazione, usa `cy.mockAuth()` insieme ai mock API.

## Troubleshooting

### Le API non vengono intercettate

Assicurati che:
- `cy.mockAuthAPIs()` o i mock specifici siano chiamati nel `beforeEach()` PRIMA di `cy.visit()`
- I pattern URL dei mock corrispondano agli endpoint effettivi della tua app
- Il file `api-mocks.js` sia importato in `e2e.js`

### I test falliscono con timeout

Se i test vanno in timeout aspettando `cy.wait('@apiAlias')`:
- Verifica che l'alias sia stato creato correttamente
- Controlla che la tua app stia effettivamente facendo la chiamata API
- Usa `cy.intercept()` con `{ log: true }` per debuggare

### I dati mockati non corrispondono

Assicurati che:
- La struttura dei dati mockati corrisponda a quella attesa dall'app
- I campi richiesti siano presenti nelle risposte mock
- Le risposte personalizzate mantengano la struttura base

## Estendere i Mock

Per aggiungere nuovi mock, modifica `cypress/support/api-mocks.js`:

```javascript
Cypress.Commands.add('mockNewEndpoint', (statusCode = 200, response = {}) => {
  const defaultResponse = {
    // struttura default
  };

  cy.intercept('POST', '**/api/new-endpoint', {
    statusCode: statusCode,
    body: { ...defaultResponse, ...response }
  }).as('newEndpointAPI');
});
```

Poi aggiungilo anche a `cy.mockAuthAPIs()` se fa parte del flusso di autenticazione standard.
