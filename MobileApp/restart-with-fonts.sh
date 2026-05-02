#!/bin/bash

echo "🧹 Cleaning cache..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf /tmp/metro-*
rm -rf /tmp/haste-*

echo "📦 Installing dependencies..."
npm install

echo "🚀 Starting Expo with cleared cache..."
npx expo start --clear
