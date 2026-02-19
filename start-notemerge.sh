#!/bin/bash

# Kill existing processes
pkill -9 -f "metro|expo|node.*NoteMerge" 2>/dev/null

# Clear caches
rm -rf .expo node_modules/.cache 2>/dev/null

# Unset CI
unset CI

# Start Expo
npx expo start --web --clear
