#!/bin/bash

# Frontend Application Verification Script
# Automatically checks the application health after each task completion

set -e  # Exit on error

echo "=================================="
echo "🔍 Frontend Application Verification"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
PASSED=0
FAILED=0

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $2"
        ((FAILED++))
    fi
}

echo "📦 1. Checking dependencies..."
if [ -d "node_modules" ]; then
    print_result 0 "Node modules installed"
else
    print_result 1 "Node modules missing - run 'npm install'"
    exit 1
fi

echo ""
echo "📝 2. TypeScript type checking..."
npx tsc --noEmit > /tmp/tsc_output.txt 2>&1
if [ $? -eq 0 ]; then
    print_result 0 "No TypeScript errors"
else
    print_result 1 "TypeScript errors found"
    echo ""
    echo "TypeScript errors:"
    cat /tmp/tsc_output.txt
fi

echo ""
echo "🔧 3. ESLint checking..."
npx eslint src --max-warnings 0 > /tmp/eslint_output.txt 2>&1
if [ $? -eq 0 ]; then
    print_result 0 "No ESLint errors"
else
    # ESLint may have warnings, check if they're critical
    if grep -q "error" /tmp/eslint_output.txt; then
        print_result 1 "ESLint errors found"
    else
        print_result 0 "ESLint passed (warnings ignored)"
    fi
fi

echo ""
echo "🏗️  4. Production build test..."
npm run build > /tmp/build_output.txt 2>&1
if [ $? -eq 0 ]; then
    print_result 0 "Production build successful"

    # Check if dist directory was created
    if [ -d "dist" ]; then
        print_result 0 "Build artifacts created"
    else
        print_result 1 "Build artifacts missing"
    fi
else
    print_result 1 "Production build failed"
    echo ""
    echo "Build errors:"
    tail -20 /tmp/build_output.txt
fi

echo ""
echo "📄 5. Checking critical files..."
REQUIRED_FILES=(
    "src/App.tsx"
    "src/main.tsx"
    "src/index.css"
    "vite.config.ts"
    "tsconfig.json"
    "tailwind.config.js"
    "package.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_result 0 "$file exists"
    else
        print_result 1 "$file missing"
    fi
done

echo ""
echo "📁 6. Checking page components..."
PAGES=(
    "src/pages/Dashboard.tsx"
    "src/pages/Analytics.tsx"
    "src/pages/KnowledgeGraph.tsx"
    "src/pages/DataCollection.tsx"
    "src/pages/ContentGeneration.tsx"
    "src/pages/ContentLibrary.tsx"
    "src/pages/Orders.tsx"
    "src/pages/Offers.tsx"
    "src/pages/Settings.tsx"
)

for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        print_result 0 "$(basename $page) exists"
    else
        print_result 1 "$(basename $page) missing"
    fi
done

echo ""
echo "🎨 7. Checking UI components..."
UI_COMPONENTS=(
    "src/components/ui/button.tsx"
    "src/components/ui/card.tsx"
    "src/components/ui/badge.tsx"
    "src/components/ui/table.tsx"
    "src/components/ui/input.tsx"
    "src/components/ui/textarea.tsx"
    "src/components/ui/tabs.tsx"
)

for component in "${UI_COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        print_result 0 "$(basename $component) exists"
    else
        print_result 1 "$(basename $component) missing"
    fi
done

echo ""
echo "📊 8. Checking dependencies..."
REQUIRED_DEPS=(
    "react"
    "react-dom"
    "react-router-dom"
    "reactflow"
    "recharts"
    "lucide-react"
    "tailwindcss"
)

for dep in "${REQUIRED_DEPS[@]}"; do
    if grep -q "\"$dep\"" package.json; then
        print_result 0 "$dep installed"
    else
        print_result 1 "$dep missing"
    fi
done

echo ""
echo "🌐 9. Checking dev server (optional)..."
if lsof -i :5173 > /dev/null 2>&1 || lsof -i :5174 > /dev/null 2>&1; then
    print_result 0 "Dev server is running"
else
    echo -e "${YELLOW}ℹ${NC} Dev server not running (run 'npm run dev' to start)"
fi

echo ""
echo "=================================="
echo "📊 Verification Summary"
echo "=================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Application is healthy.${NC}"
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Please review and fix issues.${NC}"
    exit 1
fi
