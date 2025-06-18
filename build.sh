#!/bin/bash

# Build script for @dbcode/vscode-api

echo "🔧 Building @dbcode/vscode-api..."

# Clean previous build
echo "🧹 Cleaning previous build..."
npm run clean

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the types package
echo "🏗️  Building TypeScript..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Generated files are in ./dist/"
    ls -la dist/
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "📝 To publish:"
echo "   npm publish --access public"
echo ""
echo "📚 To test locally:"
echo "   npm pack"
echo "   # Then install the generated .tgz file in your test project"
