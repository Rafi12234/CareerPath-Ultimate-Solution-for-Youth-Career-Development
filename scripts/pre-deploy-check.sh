#!/bin/bash
# Pre-Deployment Validation Script
# Run this before deploying to Azure, Vercel, and Render

echo "🔍 CareerPath Pre-Deployment Validation"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check 1: Git Status
echo "1️⃣ Checking Git Status..."
if git status > /dev/null 2>&1; then
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${GREEN}✓${NC} Git repository clean"
    else
        echo -e "${YELLOW}⚠${NC} Uncommitted changes found:"
        git status --short
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗${NC} Not a git repository"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 2: Node.js Version
echo "2️⃣ Checking Node.js Version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 20 ]; then
        echo -e "${GREEN}✓${NC} Node.js $NODE_VERSION (compatible with Vite)"
    else
        echo -e "${RED}✗${NC} Node.js $NODE_VERSION (need 20.9+ for Vite)"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗${NC} Node.js not installed"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 3: PHP Version
echo "3️⃣ Checking PHP Version..."
if command -v php &> /dev/null; then
    PHP_VERSION=$(php -v | head -n 1)
    if [[ $PHP_VERSION == *"8.1"* ]] || [[ $PHP_VERSION == *"8.2"* ]] || [[ $PHP_VERSION == *"8.3"* ]] || [[ $PHP_VERSION == *"8.4"* ]]; then
        echo -e "${GREEN}✓${NC} $PHP_VERSION (compatible)"
    else
        echo -e "${YELLOW}⚠${NC} $PHP_VERSION (Laravel 10 requires 8.1+)"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗${NC} PHP not installed (needed for local testing)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check 4: Docker
echo "4️⃣ Checking Docker..."
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker installed ($(docker --version))"
else
    echo -e "${RED}✗${NC} Docker not installed (needed for Render)"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 5: Environment Files
echo "5️⃣ Checking Environment Files..."
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓${NC} .env.example exists"
else
    echo -e "${RED}✗${NC} .env.example missing"
    ERRORS=$((ERRORS + 1))
fi

if [ -f ".env.render" ]; then
    echo -e "${GREEN}✓${NC} .env.render exists"
else
    echo -e "${YELLOW}⚠${NC} .env.render not found (created in deployment guide)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check 6: Dockerfile
echo "6️⃣ Checking Dockerfile..."
if [ -f "Dockerfile" ]; then
    if grep -q "EXPOSE 8000" Dockerfile; then
        echo -e "${GREEN}✓${NC} Dockerfile exists and exposes port 8000"
    else
        echo -e "${YELLOW}⚠${NC} Dockerfile exists but doesn't expose port 8000"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗${NC} Dockerfile missing"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 7: Client Directory
echo "7️⃣ Checking Client Directory..."
if [ -d "client" ]; then
    if [ -f "client/package.json" ]; then
        echo -e "${GREEN}✓${NC} client/ directory with package.json found"
    else
        echo -e "${RED}✗${NC} client/package.json not found"
        ERRORS=$((ERRORS + 1))
    fi
    
    if [ -f "client/vite.config.js" ]; then
        echo -e "${GREEN}✓${NC} Vite config found"
    else
        echo -e "${RED}✗${NC} Vite config missing"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗${NC} client/ directory not found"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 8: Required routes
echo "8️⃣ Checking API Routes..."
if [ -f "routes/api.php" ]; then
    if grep -q "health\|status" routes/api.php; then
        echo -e "${GREEN}✓${NC} Health check route exists"
    else
        echo -e "${YELLOW}⚠${NC} Health check route not found (add for monitoring)"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗${NC} routes/api.php not found"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 9: Database migrations
echo "9️⃣ Checking Database Migrations..."
if [ -d "database/migrations" ]; then
    MIGRATION_COUNT=$(ls database/migrations/*.php 2>/dev/null | wc -l)
    if [ "$MIGRATION_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✓${NC} Found $MIGRATION_COUNT migration files"
    else
        echo -e "${YELLOW}⚠${NC} No migrations found"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗${NC} database/migrations directory not found"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 10: GitHub Actions
echo "🔟 Checking GitHub Actions..."
if [ -d ".github/workflows" ]; then
    WORKFLOW_COUNT=$(ls .github/workflows/*.yml 2>/dev/null | wc -l)
    if [ "$WORKFLOW_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✓${NC} Found $WORKFLOW_COUNT workflow files"
    else
        echo -e "${RED}✗${NC} No workflows found"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗${NC} .github/workflows directory not found"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Summary
echo "=========================================="
echo "📊 Validation Summary"
echo "=========================================="
echo -e "Errors: ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Ready for deployment!${NC}"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Create accounts on Azure, Vercel, and Render"
    echo "   2. Follow DEPLOYMENT_GUIDE.md step by step"
    echo "   3. Test connections after deployment"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Fix errors before deployment${NC}"
    echo ""
    exit 1
fi
