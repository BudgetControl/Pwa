# Test Suite - Flusso di Autenticazione

Questa directory contiene i test unitari per il flusso di autenticazione dell'applicazione.

## Struttura Test

### Test del Service Layer (`src/services/__tests__/`)
Test completi per `AuthService` che includono:

- **Login**: Test con credenziali valide/invalide, gestione errori di rete
- **Registrazione**: Test registrazione utente, validazione password, email esistenti
- **Logout**: Test logout con gestione errori
- **Check**: Verifica autenticazione e aggiornamento token
- **UserInfo**: Recupero informazioni utente e setup store
- **Recovery Password**: Invio email di recupero password
- **Reset Password**: Reset password con token
- **Email Verification**: Invio e conferma email
- **OAuth**: Test provider Google e scambio token
- **Finalizzazione**: Completamento registrazione con workspace e wallet
- **Cancellazione**: Eliminazione utente e dati

### Test Component Layer (`src/views/auth/__tests__/`)
Test del componente `Login.vue`:

- Rendering form login
- Redirect se già autenticato
- Login con credenziali valide
- Gestione errori di login
- Login con Google OAuth
- Stati di loading
- Validazione input

### Test Store Layer (`src/storage/__tests__/`)
Test dello store `auth-token`:

- Inizializzazione store
- Set/get tokens
- Reset state
- Persistenza tokens
- Gestione timestamp

## Mock delle API

Tutti i test usano **mock completi delle chiamate API** tramite Vitest:

```typescript
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    }))
  }
}));
```

Questo approccio garantisce:
- ✅ Test isolati senza dipendenze esterne
- ✅ Test veloci e ripetibili
- ✅ Controllo completo su risposte e errori
- ✅ Nessuna chiamata reale alle API

## Esecuzione Test

```bash
# Esegui tutti i test
npm run test

# Esegui test in watch mode
npm run test:watch

# Esegui test con coverage
npm run test:coverage

# Esegui solo test auth
npm run test -- auth
```

## Comandi da Aggiungere a package.json

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## Dipendenze Necessarie

Assicurati di avere installato:

```bash
npm install -D vitest @vitest/ui @vue/test-utils jsdom
npm install -D @vitest/coverage-v8  # per coverage
```

## Best Practices

1. **Isolamento**: Ogni test è indipendente e non dipende da altri
2. **Mock completi**: Tutte le chiamate API sono mockate
3. **Coverage**: Obiettivo > 80% di copertura per codice critico
4. **Test Case Realistici**: Test con dati che riflettono scenari reali
5. **Error Handling**: Test espliciti per ogni tipo di errore

## Estensioni Future

Per aumentare ulteriormente la copertura, considera di aggiungere:

- Test per componente `Register.vue`
- Test per flusso password recovery
- Test per OAuth callback
- Test di integrazione tra componenti
- Test E2E con Cypress per flussi completi
