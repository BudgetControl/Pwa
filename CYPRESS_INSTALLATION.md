# Cypress Installation Guide

## Problem
Cypress may not install correctly with `npm install --legacy-peer-deps` due to peer dependency conflicts.

## Solution

### Step 1: Install dependencies with legacy-peer-deps
```bash
npm install --legacy-peer-deps
```

### Step 2: Force install Cypress separately
```bash
npm install cypress@13.17.0 eslint-plugin-cypress@3.3.0 --save-dev --force
```

### Step 3: Verify installation
```bash
npx cypress --version
```

Should output: `Cypress package version: 13.17.0`

## Why is this needed?

The project has a peer dependency conflict:
- `@capacitor-firebase/messaging@7.3.0` requires `@capacitor/core@>=7.0.0`
- But the project uses `@capacitor/core@6.2.1`

Using `--force` allows Cypress to install despite these conflicts, which is safe since Cypress doesn't directly interact with Capacitor.

## Running Tests

After installation, you can run:

```bash
# Run all E2E tests headless
npm run test:e2e

# Open Cypress Test Runner (interactive)
npm run test:e2e:open

# Run tests in specific browser
npm run test:e2e:chrome
npm run test:e2e:firefox
```

## CI/CD

In GitHub Actions, use:
```yaml
- name: Install Dependencies
  run: npm install --legacy-peer-deps

- name: Install Cypress
  run: npm install cypress --save-dev --force
```

## Troubleshooting

### "cypress: command not found"
- Make sure you're using `npx cypress` instead of just `cypress`
- All npm scripts use `npx` by default

### "Cannot find module 'cypress'"
- Run the force install command again
- Check if `node_modules/cypress` directory exists

### Tests fail to start
- Clear Cypress cache: `npx cypress cache clear`
- Reinstall: `npm install cypress --save-dev --force`
- Verify: `npx cypress verify`

## Alternative: Docker

If installation continues to fail, consider using Docker:

```dockerfile
FROM cypress/included:13.17.0
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
CMD ["npx", "cypress", "run"]
```

---

**Last Updated:** October 8, 2025
