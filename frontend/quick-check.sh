#!/bin/bash
# Quick verification script - runs fast checks only

set -e
echo "🔍 Quick Frontend Check"
echo "======================="

# 1. TypeScript check
echo "1. TypeScript check..."
if npx tsc --noEmit 2>&1 | head -5 | grep -q "error"; then
    echo "❌ TypeScript errors found"
    npx tsc --noEmit 2>&1 | head -10
    exit 1
else
    echo "✅ TypeScript OK"
fi

# 2. Check critical files
echo "2. Checking files..."
ERRORS=0
for file in src/App.tsx src/main.tsx package.json vite.config.ts; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing: $file"
        ((ERRORS++))
    fi
done

if [ $ERRORS -eq 0 ]; then
    echo "✅ All critical files present"
fi

# 3. Check pages
echo "3. Checking pages..."
PAGE_COUNT=$(find src/pages -name "*.tsx" 2>/dev/null | wc -l)
echo "✅ Found $PAGE_COUNT page components"

# 4. Check if build artifacts exist
if [ -d "dist" ]; then
    echo "✅ Build artifacts exist"
else
    echo "ℹ️  No build artifacts (run 'npm run build')"
fi

echo ""
echo "✅ Quick check complete!"
exit 0
