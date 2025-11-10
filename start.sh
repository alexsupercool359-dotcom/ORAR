#!/bin/bash

# Script de start rapid pentru Sistemul Orar
echo "🚀 Pornire Sistem Orar..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js nu este instalat!"
    echo "Instalează Node.js de pe: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js găsit: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm nu este instalat!"
    exit 1
fi

echo "✅ npm găsit: $(npm --version)"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Fișierul .env nu există!"
    echo ""
    read -p "Introdu Telegram Bot Token (de la @BotFather): " BOT_TOKEN
    echo "TELEGRAM_TOKEN=$BOT_TOKEN" > .env
    echo "PORT=3000" >> .env
    echo "NODE_ENV=development" >> .env
    echo "✅ Fișier .env creat!"
    echo ""
fi

# Read .env to check token
source .env

if [ -z "$TELEGRAM_TOKEN" ] || [ "$TELEGRAM_TOKEN" == "YOUR_BOT_TOKEN_HERE" ]; then
    echo "⚠️  Token Telegram invalid în .env!"
    echo ""
    read -p "Introdu Telegram Bot Token (de la @BotFather): " BOT_TOKEN
    sed -i '' "s/TELEGRAM_TOKEN=.*/TELEGRAM_TOKEN=$BOT_TOKEN/" .env
    echo "✅ Token actualizat!"
    echo ""
fi

echo "✅ Telegram Token configurat"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Instalare dependențe..."
    npm install
    echo ""
fi

# Kill existing Node processes
echo "🔄 Oprire procese existente..."
pkill -f "node backend/index.js" 2>/dev/null
sleep 1

# Start the application
echo "🎯 Pornire aplicație..."
echo ""
npm start &

# Wait for server to start
sleep 3

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo ""
    echo "✅ ========================================="
    echo "✅  SISTEM PORNIT CU SUCCES!"
    echo "✅ ========================================="
    echo ""
    echo "📱 Dashboard: http://localhost:3000"
    echo "📅 Creează Orar: http://localhost:3000/setup-schedule.html"
    echo "📋 Marcă Prezențe: http://localhost:3000/attendance-grid.html"
    echo ""
    echo "💬 Bot Telegram: @YOUR_BOT_USERNAME"
    echo ""
    echo "🛑 Pentru a opri: pkill -f 'node backend/index.js'"
    echo ""
else
    echo ""
    echo "❌ Eroare la pornire!"
    echo "Verifică log-urile pentru detalii"
fi
