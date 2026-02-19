#!/bin/bash

echo "🧹 NoteMerge - Tam Temizlik ve Başlatma"
echo "========================================"

# Kill all processes
echo "1️⃣ Tüm processleri kapatıyorum..."
pkill -9 -f "expo" 2>/dev/null
pkill -9 -f "metro" 2>/dev/null
pkill -9 -f "react-native" 2>/dev/null
sleep 1

# Clear all caches
echo "2️⃣ Cache temizleniyor..."
rm -rf .expo 2>/dev/null
rm -rf node_modules/.cache 2>/dev/null
rm -rf ~/.expo/web-cache 2>/dev/null
rm -rf .next 2>/dev/null
rm -rf dist 2>/dev/null

# Clear watchman
echo "3️⃣ Watchman temizleniyor..."
watchman watch-del-all 2>/dev/null || echo "   Watchman yok, atlanıyor"

# Unset CI
echo "4️⃣ CI değişkeni kaldırılıyor..."
unset CI

# Start with verbose logging
echo "5️⃣ Expo başlatılıyor..."
echo ""
echo "🚀 Web tarayıcınızda açılacak: http://localhost:8081"
echo ""

# Start expo with web
npx expo start --web --clear --host localhost

