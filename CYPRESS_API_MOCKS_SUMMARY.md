# Riepilogo: Implementazione API Mocks per Cypress

## Cosa è stato fatto

È stato implementato un sistema completo di mock per tutte le chiamate API del servizio di autenticazione (`src/services/auth.service.ts`). Questo permette di testare l'applicazione senza bisogno di un backend reale attivo.

## File Creati/Modificati

### File Nuovi

1. **`cypress/support/api-mocks.js`**
   - Contiene tutti i comandi Cypress personalizzati per il mock delle API
   - Include mock per tutti gli endpoint di autenticazione
   - Fornisce comandi di utilità per scenari di errore e test offline

2. **`cypress/support/API_MOCKS_README.md`**
   - Documentazione completa su come utilizzare i mock API
   - Esempi pratici per ogni tipo di mock
   - Best practices e troubleshooting

3. **`cypress/e2e/api-mocks.cy.js`**
   - Suite di test dedicata per verificare il funzionamento dei mock
   - Test per ogni endpoint mockato
   - Esempi di integrazione con i flussi di autenticazione

4. **`cypress/e2e/auth-with-mocks-example.cy.js`**
   - Esempio completo di utilizzo dei mock in test reali
   - Copre tutti i flussi di autenticazione
   - Include edge cases e test di performance

### File Modificati

1. **`cypress/support/e2e.js`**
   - Aggiunto import di `api-mocks.js`

2. **`cypress/e2e/auth.cy.js`**
   - Aggiornato per utilizzare i mock API
   - Aggiunti test per login, registrazione e logout con mock

3. **`cypress/e2e/navigation.cy.js`**
   - Aggiornato per utilizzare i mock API nelle sezioni con autenticazione

4. **`cypress/e2e/security.cy.js`**
   - Aggiornato per utilizzare i mock API nei test di sicurezza

## Endpoint API Mockati

Tutti gli endpoint definiti in `src/services/auth.service.ts`:

### Autenticazione Base
- ✅ `POST /api/auth/authenticate` - Login
- ✅ `GET /api/auth/logout` - Logout
- ✅ `POST /api/auth/verify-email` - Verifica email
- ✅ `POST /api/auth/sign-up` - Registrazione
- ✅ `POST /api/auth/reset-password` - Richiesta reset password
- ✅ `PUT /api/auth/reset-password/{token}` - Conferma reset password
- ✅ `GET /api/auth/check` - Controllo validità token
- ✅ `GET /api/auth/confirm/{token}` - Conferma account

### OAuth Providers
- ✅ `GET /api/auth/authenticate/{provider}` - URI provider OAuth
- ✅ `GET /api/auth/authenticate/token/{provider}` - Token da provider OAuth

### User Management
- ✅ `GET /api/auth/user-info` - Informazioni utente
- ✅ `GET /api/auth/user-info/by-email/{email}` - Info utente per email
- ✅ `GET /api/user/settings` - Impostazioni utente
- ✅ `DELETE /api/auth/delete` - Elimina account utente
- ✅ `DELETE /api/auth/data/delete` - Elimina dati utente
- ✅ `POST /api/auth/{useruuid}/finalize/sign-up` - Finalizza registrazione

## Comandi Cypress Disponibili

### Comandi Principali

```javascript
// Mock tutti gli endpoint di autenticazione
cy.mockAuthAPIs()

// Mock login con risposta personalizzata
cy.mockLogin(statusCode, responseData)
cy.mockLoginFailure(statusCode, errorMessage)

// Mock registrazione
cy.mockSignUp(statusCode, responseData)
cy.mockSignUpFailure(statusCode, validationErrors)

// Mock logout
cy.mockLogout(statusCode)

// Mock recupero password
cy.mockPasswordRecovery(statusCode)

// Mock info utente
cy.mockUserInfo(statusCode, userInfoData)

// Mock controllo autenticazione
cy.mockCheckAuth(statusCode, isValid)

// Mock errori generici
cy.mockAPIFailure()
cy.mockAPIDelay(milliseconds)
```

## Come Utilizzare i Mock

### Setup Base

```javascript
describe('Il mio test', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.mockAuthAPIs(); // Configura tutti i mock
  });

  it('dovrebbe fare qualcosa', () => {
    cy.visit('/app/auth/login');
    // ... il tuo test
  });
});
```

### Test con Mock Personalizzati

```javascript
it('dovrebbe gestire login con successo', () => {
  cy.mockLogin(200, {
    token: 'mio-token-custom',
    user: {
      id: 1,
      email: 'test@example.com',
      name: 'Test User'
    }
  });

  cy.visit('/app/auth/login');
  cy.get('input[type="email"]').type('test@example.com');
  cy.get('input[type="password"]').type('password123');
  cy.get('button[type="submit"]').click();

  cy.wait('@loginAPI').its('response.statusCode').should('eq', 200);
});
```

### Test con Errori

```javascript
it('dovrebbe gestire errore di login', () => {
  cy.mockLoginFailure(401, 'Credenziali non valide');

  cy.visit('/app/auth/login');
  cy.get('input[type="email"]').type('wrong@example.com');
  cy.get('input[type="password"]').type('wrongpassword');
  cy.get('button[type="submit"]').click();

  cy.wait('@loginFailureAPI').its('response.statusCode').should('eq', 401);
});
```

### Test Offline

```javascript
it('dovrebbe gestire errori di rete', () => {
  cy.mockAPIFailure();

  cy.visit('/app/auth/login');
  cy.get('input[type="email"]').type('test@example.com');
  cy.get('input[type="password"]').type('password123');
  cy.get('button[type="submit"]').click();

  cy.wait('@apiFailure');
  // Verifica che l'app mostri un messaggio di errore appropriato
});
```

## Verifica delle Chiamate API

Ogni mock crea automaticamente un alias utilizzabile con `cy.wait()`:

```javascript
cy.wait('@loginAPI')           // Aspetta il login
cy.wait('@signUpAPI')          // Aspetta la registrazione
cy.wait('@logoutAPI')          // Aspetta il logout
cy.wait('@userInfoAPI')        // Aspetta user info
// etc...
```

Puoi anche ispezionare i dettagli della chiamata:

```javascript
cy.wait('@loginAPI').then((interception) => {
  // Verifica la richiesta
  expect(interception.request.body.email).to.eq('test@example.com');
  
  // Verifica la risposta
  expect(interception.response.statusCode).to.eq(200);
  expect(interception.response.body.token).to.exist;
});
```

## Vantaggi

1. **Test più veloci**: Non serve un backend reale in esecuzione
2. **Test affidabili**: Risposte consistenti e prevedibili
3. **Test isolati**: Ogni test è indipendente dallo stato del database
4. **Scenari di errore**: Facile testare tutti i casi limite e gli errori
5. **Performance testing**: Simulazione di latenza di rete
6. **Offline testing**: Test del comportamento offline dell'app

## Esempi di Test Aggiornati

Tutti i test nei seguenti file sono stati aggiornati per utilizzare i mock:

- `cypress/e2e/auth.cy.js` - Test autenticazione completi
- `cypress/e2e/navigation.cy.js` - Test navigazione con autenticazione
- `cypress/e2e/security.cy.js` - Test sicurezza con mock degli errori

## Come Eseguire i Test

```bash
# Esegui tutti i test E2E
npm run test:e2e

# Apri Cypress in modalità interattiva
npm run test:e2e:open

# Esegui test in headless mode
npm run test:e2e:headless

# Esegui test su browser specifico
npm run test:e2e:chrome
npm run test:e2e:firefox
```

## Next Steps

1. **Espandere i mock**: Aggiungere mock per altri servizi API oltre all'autenticazione
2. **Fixtures**: Creare file JSON con dati di test riutilizzabili
3. **Custom Commands**: Aggiungere comandi specifici per flussi complessi
4. **Visual Testing**: Integrare screenshot comparison
5. **CI/CD**: Configurare l'esecuzione automatica dei test

## Documentazione

Per maggiori dettagli sull'utilizzo dei mock, consulta:
- `cypress/support/API_MOCKS_README.md` - Guida completa all'utilizzo
- `cypress/e2e/auth-with-mocks-example.cy.js` - Esempi pratici
- `cypress/e2e/api-mocks.cy.js` - Test dei mock stessi

## Note Tecniche

- I mock utilizzano `cy.intercept()` per intercettare le chiamate HTTP
- I pattern URL utilizzano wildcards (`**`) per catturare diverse varianti
- Tutti i mock supportano personalizzazione tramite parametri
- I mock sono automaticamente disponibili in tutti i test e2e
- Gli alias creati seguono la convenzione `@{metodo}{endpoint}API`

## Troubleshooting

Se i test non funzionano come previsto:

1. Verifica che `cy.mockAuthAPIs()` sia chiamato nel `beforeEach()`
2. Assicurati che i mock siano configurati PRIMA di `cy.visit()`
3. Controlla che i pattern URL corrispondano agli endpoint effettivi
4. Usa `cy.wait('@apiAlias')` per debug delle chiamate API
5. Controlla la console Cypress per messaggi di errore

## Contribuire

Per aggiungere nuovi mock:

1. Aggiungi il comando in `cypress/support/api-mocks.js`
2. Aggiungi test in `cypress/e2e/api-mocks.cy.js`
3. Documenta l'uso in `API_MOCKS_README.md`
4. Aggiungi esempi in `auth-with-mocks-example.cy.js`
