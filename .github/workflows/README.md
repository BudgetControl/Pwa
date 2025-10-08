# GitHub Actions Workflows

This directory contains the CI/CD workflows for the Budget Control PWA application.

## 📋 Available Workflows

### 1. E2E Tests (`e2e-tests.yml`)
**Triggers:**
- Push to `master` or `develop` branches
- Pull requests to `master` or `develop`
- Manual workflow dispatch

**Purpose:**
Runs comprehensive end-to-end tests using Cypress to ensure application quality.

**Features:**
- ✅ Tests on multiple browsers (Chrome and Firefox)
- ✅ Parallel test execution
- ✅ Automatic screenshot capture on failures
- ✅ Test result artifacts
- ✅ Test summary generation

**Matrix Strategy:**
- Chrome (headless)
- Firefox (headless)

### 2. Deploy to Production (`deploy.yml`)
**Triggers:**
- Push to `master` branch
- Manual workflow dispatch

**Flow:**
1. **E2E Tests** - Runs full test suite on Chrome
2. **Deploy** - Only proceeds if tests pass

**Deployment Steps:**
- Checkout code
- Install dependencies
- Build application
- Deploy to production server via SFTP
- Copy files to Docker container

**Environment:** `prod`

### 3. Deploy to Development (`deploy-dev.yml`)
**Triggers:**
- Push to `develop` branch
- Manual workflow dispatch

**Flow:**
1. **E2E Tests** - Runs full test suite on Chrome
2. **Deploy** - Only proceeds if tests pass

**Deployment Steps:**
- Checkout code
- Install dependencies
- Build application (dev mode)
- Deploy to AWS S3
- Invalidate CloudFront cache

**Environment:** `dev`

## 🔒 Security and Best Practices

### Dependencies Between Jobs
Both deployment workflows use `needs: e2e-tests` to ensure:
- Tests must pass before deployment
- Failed tests block deployment automatically
- No manual intervention required

### Secrets Required

#### For Production Deploy (`deploy.yml`):
- `SFTP_USER` - SFTP username
- `SFTP_HOST` - SFTP server hostname
- `SSH_PRIVATE_KEY` - SSH private key for authentication
- `SFTP_PASSWORD` - SFTP password

#### For Development Deploy (`deploy-dev.yml`):
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region
- `BUCKET_NAME` - S3 bucket name
- `DISTRIBUTION_ID` - CloudFront distribution ID
- `VUE_APP_API_PATH_V2` - API endpoint URL

## 🎯 Workflow Features

### Artifact Management
All workflows upload artifacts for debugging:

**On Test Failure:**
- Screenshots from failed tests
- Retention: 7 days

**Always:**
- Test results and reports
- Retention: 30 days

### Caching
- Node.js dependencies are cached using `actions/setup-node@v4`
- Speeds up subsequent builds

### Error Handling
- Tests run with `fail-fast: false` to see all failures
- Screenshots captured automatically on failure
- Detailed error logs in GitHub Actions UI

## 📊 Test Execution

### E2E Test Suite Includes:
1. **Authentication Tests** (14 tests)
   - Login flows
   - Registration
   - Password recovery

2. **Navigation Tests** (15 tests)
   - Route protection
   - Sidebar navigation
   - Mobile menu

3. **PWA Features Tests** (25 tests)
   - Service Worker
   - Manifest validation
   - Offline functionality

4. **UI Components Tests** (30 tests)
   - Form validation
   - Button interactions
   - Loading states

5. **Accessibility Tests** (18 tests)
   - Keyboard navigation
   - Screen reader support
   - ARIA labels

6. **Security Tests** (23 tests)
   - XSS protection
   - Authentication security
   - Input validation

**Total:** 117+ test cases

## 🚀 Usage

### Manual Workflow Dispatch
You can manually trigger any workflow from the GitHub Actions tab:

1. Go to **Actions** tab
2. Select the workflow
3. Click **Run workflow**
4. Choose the branch
5. Click **Run workflow** button

### Viewing Test Results
1. Navigate to the **Actions** tab
2. Click on the workflow run
3. View the test summary in the job summary
4. Download artifacts for detailed logs and screenshots

### Debugging Failed Tests
If tests fail:
1. Check the **E2E Tests** job logs
2. Download the **cypress-screenshots** artifact
3. View screenshots of failed tests
4. Fix issues and push changes

## 🔧 Customization

### Changing Test Browsers
Edit the matrix in `e2e-tests.yml`:
```yaml
strategy:
  matrix:
    browser: [chrome, firefox, edge]  # Add more browsers
```

### Adjusting Test Timeout
Modify the `wait-on-timeout` in workflow files:
```yaml
wait-on-timeout: 120  # Increase if needed
```

### Running Specific Tests
Change the `spec` parameter:
```yaml
spec: cypress/e2e/auth.cy.js  # Run only auth tests
```

### Disabling Video Recording
Already configured for performance:
```yaml
config: video=false
```

## 📈 Performance Optimization

### Current Optimizations:
- ✅ Dependency caching
- ✅ Parallel browser testing
- ✅ Video recording disabled
- ✅ `npm ci` instead of `npm install`
- ✅ Artifact retention limits

### Expected Execution Times:
- E2E Tests: ~5-10 minutes
- Build: ~3-5 minutes
- Deploy (prod): ~2-3 minutes
- Deploy (dev): ~2-3 minutes

**Total workflow time:** ~10-20 minutes

## 🔔 Notifications

### Build Status Badges
Add to your README.md:

```markdown
![E2E Tests](https://github.com/BudgetControl/Pwa/actions/workflows/e2e-tests.yml/badge.svg)
![Deploy to Production](https://github.com/BudgetControl/Pwa/actions/workflows/deploy.yml/badge.svg)
![Deploy to Development](https://github.com/BudgetControl/Pwa/actions/workflows/deploy-dev.yml/badge.svg)
```

### GitHub Notifications
By default, GitHub notifies:
- Workflow failures
- Deployment status changes
- Test failures blocking deployment

Configure in: **Settings** → **Notifications** → **Actions**

## 🐛 Troubleshooting

### Common Issues

#### Tests Timing Out
**Solution:** Increase `wait-on-timeout`:
```yaml
wait-on-timeout: 180
```

#### Dependencies Installation Failing
**Solution:** Check Node.js version compatibility:
```yaml
node-version: '18'  # Use LTS version
```

#### Deployment Blocked by Tests
**Solution:** 
1. Check test logs
2. Download screenshots
3. Fix failing tests
4. Push changes

#### Artifact Upload Failing
**Solution:** Check artifact paths exist:
```yaml
if-no-files-found: ignore  # Already configured
```

## 📝 Best Practices

1. **Always review test results** before merging PRs
2. **Don't skip tests** - They protect production
3. **Keep dependencies updated** - Run `npm update` regularly
4. **Monitor workflow execution times** - Optimize if needed
5. **Use semantic versioning** for tags
6. **Document workflow changes** in this README

## 🔄 Maintenance

### Regular Tasks:
- Review and update action versions quarterly
- Check for deprecated GitHub Actions
- Update Node.js version as needed
- Review artifact retention policies
- Monitor workflow execution costs

### Version Updates:
```yaml
# Keep these updated
uses: actions/checkout@v4
uses: actions/setup-node@v4
uses: cypress-io/github-action@v6
uses: actions/upload-artifact@v4
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cypress GitHub Action](https://github.com/cypress-io/github-action)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Cypress Documentation](https://docs.cypress.io)

## 🤝 Contributing

When modifying workflows:
1. Test changes in a feature branch first
2. Use `workflow_dispatch` for manual testing
3. Document changes in this README
4. Update version numbers if needed
5. Notify team of significant changes

---

**Last Updated:** 2025
**Maintained by:** Budget Control Development Team
