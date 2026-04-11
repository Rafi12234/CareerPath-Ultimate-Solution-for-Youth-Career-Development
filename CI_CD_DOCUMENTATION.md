# GitHub Actions CI/CD Pipeline Documentation

## Overview

This project has a comprehensive GitHub Actions CI/CD pipeline that automates testing, building, security scanning, and deployment processes.

## Workflow Files

### 1. **backend-tests.yml** - Laravel/PHP Backend Testing
**Triggers:** Push and PR on `main`, `Samanta`, `Rafi`, `dev` branches with changes in:
- `app/`, `routes/`, `tests/`, `config/`, `composer.json`

**Jobs:**
- **tests**: Runs PHPUnit test suite with MySQL service
  - PHP 8.4 setup
  - Composer dependency installation
  - Database migrations
  - PHPUnit testing
  - Coverage upload to Codecov

- **code-quality**: Checks code formatting with Laravel Pint
  - PHP code style validation

**Key Features:**
- MySQL 8.0 service container for database tests
- Caching for faster runs
- Code coverage tracking
- Automatic retry for network failures

---

### 2. **frontend-tests.yml** - React/Node.js Frontend Testing
**Triggers:** Push and PR on `main`, `Samanta`, `Rafi`, `dev` branches with changes in:
- `client/`, `package.json`, `package-lock.json`

**Jobs:**
- **install-and-lint**: Installs dependencies and runs ESLint
  - Node 18 setup
  - NPM dependency installation
  - ESLint validation (max 5 warnings allowed)

- **build**: Builds the React application
  - Vite production build
  - Artifact upload for 1 day retention

- **e2e-tests**: Runs Playwright E2E tests
  - Automatic browser installation
  - Test execution
  - Report upload for 30 days

**Key Features:**
- NPM caching for speed
- Build artifacts for debugging
- Playwright report archives

---

### 3. **docker-build.yml** - Docker Image Build & Push
**Triggers:**
- Push to `main`, `Rafi`, `dev` branches
- Git tags (`v*`)
- Manual trigger in PR context

**Jobs:**
- **build-and-push**: Builds and pushes Docker image to GHCR
  - Docker Buildx for multi-platform builds
  - GitHub Container Registry (GHCR) authentication
  - Automatic tag generation (branch, semver, commit SHA)
  - Layer caching for faster builds

- **security-scan**: Scans Docker image for vulnerabilities
  - Trivy security scanner integration
  - SARIF report upload to GitHub Security
  - Automatic coverage of CVEs

**Key Features:**
- Multi-platform support
- Efficient caching
- Security vulnerability detection
- SARIF format for GitHub integration

---

### 4. **ci.yml** - Full CI Pipeline
**Triggers:** Push and PR on all branches

**Jobs:**
- **code-quality**: Composer dependency security check
- **dependency-check**: Audits PHP and NPM dependencies
  - `composer audit` for PHP packages
  - `npm audit` for Node packages
- **documentation**: Validates README and workflows
  - Checks README.md exists
  - YAML validation for workflows

---

### 5. **deploy.yml** - Production Deployment
**Triggers:**
- Push to `main` branch
- Git tags (`v*`)
- Manual workflow dispatch

**Jobs:**
- **build**: Builds final production Docker image
  - Highest quality caching
  - Production image tagging

- **deploy**: Deployment orchestration
  - Outputs deployment status
  - Ready for custom deployment scripts
  - Commented examples for Docker Swarm, Kubernetes, AWS

- **sanity-check**: Post-deployment validation
  - Health check notification

---

## Configuration & Secrets

### Required GitHub Secrets

```bash
SONAR_TOKEN          # For SonarCloud code analysis (optional)
GITHUB_TOKEN         # Automatically provided by GitHub Actions
```

### Environment Variables

Workflows use standard environment variables:
- `DB_CONNECTION=mysql`
- `DB_HOST=127.0.0.1`
- `DB_DATABASE=careerpath_test`

---

## Local Testing

### Run Tests Locally

**Backend:**
```bash
# Install dependencies
composer install

# Run PHPUnit tests
composer run phpunit

# Run Laravel Pint formatting check
composer run pint
```

**Frontend:**
```bash
# Install dependencies
npm install

# Run ESLint
npm run lint

# Build
npm run build

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

---

## Branch Policies

### Recommended Branch Protection Rules

For `main` branch, enable:
- ✅ Require pull request reviews before merging (1-2 reviewers)
- ✅ Require status checks to pass before merging:
  - Backend Tests
  - Frontend Tests
  - Docker Build
  - CI Full Pipeline
- ✅ Require branches to be up to date before merging
- ✅ Include administrators in restrictions

### Branch Workflow

```
develop/feature branches
    ↓ (make changes)
    ↓ (push to origin)
    ↓ (create PR)
    ↓ (GitHub Actions runs)
    ↓ (code review)
    ↓ (merge to Rafi/Samanta)
    ↓ (integration testing)
    ↓ (merge to main)
    ↓ (GitHub Actions deploys)
    ↓ Production
```

---

## Useful Commands

### View Workflow Runs
```bash
# List recent workflow runs
gh run list --repo Rafi12234/CareerPath-Ultimate-Solution-for-Youth-Career-Development

# View specific workflow run
gh run view <run-id> --repo Rafi12234/CareerPath-Ultimate-Solution-for-Youth-Career-Development
```

### Re-run Failed Workflow
```bash
gh run rerun <run-id>
```

### Create and Push Tags for Deployment
```bash
# Create a version tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tag (triggers deploy.yml)
git push origin v1.0.0

# List all tags
git tag -l
```

---

## Deployment Configuration

### For Docker Swarm
Uncomment and configure in `deploy.yml`:
```yaml
- name: Deploy to Docker Swarm
  run: |
    docker pull ${{ needs.build.outputs.image-tag }}
    docker service update --image ${{ needs.build.outputs.image-tag }} careerpath-backend
```

### For Kubernetes
```yaml
- name: Deploy to Kubernetes
  uses: actions-hub/kubectl@master
  env:
    KUBE_CONFIG: ${{ secrets.KUBE_CONFIG }}
  with:
    args: set image deployment/careerpath-backend backend=${{ needs.build.outputs.image-tag }}
```

### For AWS ECS
```yaml
- name: Deploy to AWS ECS
  uses: aws-actions/amazon-ecs-deploy-task-definition@v1
```

---

## Troubleshooting

### Workflow Not Triggering
- Check branch name in trigger conditions
- Verify file path filters match your changes
- Check `.gitignore` isn't excluding workflow files
- Ensure `.github/workflows/` directory exists

### Test Failures

**Backend Tests:**
```bash
# Check database connection
mysql -h 127.0.0.1 -u careerpath_user -p careerpath_pass

# Run migrations locally
php artisan migrate:fresh --seed
```

**Frontend Tests:**
```bash
# Clear npm cache if issues persist
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Docker Image Build Issues
```bash
# Build locally to debug
docker build -t careerpath:test .

# Run container
docker run -p 8000:8000 careerpath:test
```

---

## Best Practices

1. **Keep workflows simple** - Use reusable actions when possible
2. **Cache dependencies** - Speeds up workflow runs significantly
3. **Use concurrency groups** - Cancel previous runs when new push happens
4. **Set timeouts** - Prevent hanging workflows
5. **Monitor costs** - Large matrices and frequent runs consume minutes
6. **Review logs** - Always check workflow logs for optimization opportunities
7. **Security** - Never commit secrets; use GitHub Secrets
8. **Version actions** - Pin actions to specific versions for stability

---

## GitHub Actions Marketplace

Useful actions already integrated:
- `actions/checkout@v4` - Clone repository
- `actions/setup-php@v2` - PHP environment setup
- `actions/setup-node@v4` - Node.js environment setup
- `docker/setup-buildx-action@v2` - Docker build support
- `docker/login-action@v2` - Docker registry authentication
- `codecov/codecov-action@v3` - Coverage reporting
- `aquasecurity/trivy-action@master` - Security scanning

---

## Next Steps

1. ✅ Navigate to GitHub repository Settings → Branches
2. ✅ Set up branch protection rules for `main`
3. ✅ Add required secrets (SONAR_TOKEN if using SonarCloud)
4. ✅ Create a PR to test the pipeline
5. ✅ Monitor workflow runs in "Actions" tab
6. ✅ Configure deployment platform in `deploy.yml`

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Laravel Testing](https://laravel.com/docs/testing)
- [Playwright Documentation](https://playwright.dev)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Last Updated:** April 11, 2026
**By:** Rafi12234 (GitHub Actions Configuration)
