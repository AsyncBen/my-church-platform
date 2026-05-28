#!/bin/bash
echo "📋 Scripture Module Verification"
echo "=================================="

errors=0

# Check backend module files
echo ""
echo "Backend Module Files:"
files=(
  "backend/src/modules/scripture/scripture.routes.ts"
  "backend/src/modules/scripture/services/scripture.service.ts"
  "backend/src/modules/scripture/services/local-bible.service.ts"
  "backend/src/modules/scripture/services/api-bible.service.ts"
  "backend/src/modules/scripture/validators/scripture.validators.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (MISSING)"
    ((errors++))
  fi
done

# Check Bible data
echo ""
echo "Data Files:"
if [ -f "backend/kjv.json" ]; then
  size=$(du -h backend/kjv.json | cut -f1)
  echo "  ✅ backend/kjv.json ($size)"
else
  echo "  ❌ backend/kjv.json (MISSING)"
  ((errors++))
fi

# Check frontend files
echo ""
echo "Frontend Files:"
frontend_files=(
  "media-panel/src/services/scripture.service.ts"
  "media-panel/src/components/scripture/ScriptureSearch.tsx"
  "media-panel/src/components/scripture/ScripturePreview.tsx"
  "media-panel/src/components/scripture/RecentScriptures.tsx"
  "media-panel/src/components/scripture/ScriptureCard.tsx"
)

for file in "${frontend_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (MISSING)"
    ((errors++))
  fi
done

# Check configuration
echo ""
echo "Configuration:"
if grep -q "scriptureRoutes" backend/src/app.ts; then
  echo "  ✅ Scripture routes registered in app.ts"
else
  echo "  ❌ Scripture routes NOT registered"
  ((errors++))
fi

if grep -q "API_BIBLE_KEY" backend/src/config/env.ts; then
  echo "  ✅ API_BIBLE_KEY in env.ts"
else
  echo "  ❌ API_BIBLE_KEY NOT in env.ts"
  ((errors++))
fi

if grep -q "API_BIBLE_KEY=" backend/.env; then
  echo "  ✅ API_BIBLE_KEY in .env"
else
  echo "  ❌ API_BIBLE_KEY NOT in .env"
  ((errors++))
fi

# Summary
echo ""
echo "=================================="
if [ $errors -eq 0 ]; then
  echo "✅ All checks passed! Module is ready."
  exit 0
else
  echo "❌ $errors issue(s) found. Review above."
  exit 1
fi
