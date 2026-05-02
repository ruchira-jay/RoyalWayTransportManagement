#!/bin/bash

echo "🧹 Cleaning Mobile App Cache..."

cd /Users/admin/RoyalWay/MobileApp

# Kill any running Metro bundler
echo "Stopping any running processes..."
pkill -f "expo start" || true
pkill -f "react-native" || true

# Clear watchman
echo "Clearing watchman..."
watchman watch-del-all 2>/dev/null || true

# Clear Metro bundler cache
echo "Clearing Metro bundler cache..."
rm -rf .expo
rm -rf node_modules/.cache

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force 2>/dev/null || true

echo "✅ Cache cleared!"
echo ""
echo "🚀 Starting Expo with clean cache..."
echo ""

npx expo start -c
