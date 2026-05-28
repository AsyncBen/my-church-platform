#!/bin/bash
# Quick setup script for Scripture module

echo "🔍 Scripture Module Setup"
echo "========================"

# Check if backend exists
if [ ! -d "backend" ]; then
  echo "❌ Backend directory not found"
  exit 1
fi

# Check if kjv.json exists
if [ ! -f "backend/kjv.json" ]; then
  echo "⬇️  Downloading KJV Bible JSON..."
  curl -s https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json -o backend/kjv.json
  echo "✅ KJV Bible downloaded ($(du -h backend/kjv.json | cut -f1))"
else
  echo "✅ KJV Bible JSON already exists"
fi

# Check if axios is installed
cd backend
if ! npm ls axios > /dev/null 2>&1; then
  echo "📦 Installing axios..."
  npm install axios
fi
cd ..

# Check environment variables
if grep -q "API_BIBLE_KEY" backend/.env; then
  echo "✅ API_BIBLE_KEY already in .env"
else
  echo "⚙️  Adding API_BIBLE_KEY to backend/.env"
  echo "API_BIBLE_KEY=ua-wu0vWIw7j3uFU6LH23" >> backend/.env
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📖 Scripture Module Ready:"
echo "   - Local KJV Bible: ✅ Offline search available"
echo "   - API Bible: ✅ Fallback configured"
echo ""
echo "🚀 To start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "📚 For documentation, see: SCRIPTURE_MODULE.md"
