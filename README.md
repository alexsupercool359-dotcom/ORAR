# 📚 Sistem Gestionare Orar Facultate

Un sistem complet pentru gestionarea orarului și prezențelor universitare cu notificări Telegram automate.

## 🎯 Caracteristici

- ✅ Configurare simplă a prezențelor trecute
- 📊 Dashboard cu status prezențe
- 🔔 Notificări Telegram cu 1h înainte de ore
- 🔄 Sistem inteligent de amânare ore
- 📅 Tracking prezențe săptămânal și la 2 săptămâni
- 🌐 Interfață web responsivă

## 🛠️ Instalare

### Prerequisites
- Node.js 14+
- npm

### Setup Local

1. **Clonează / Descarcă proiectul**
```bash
cd ORAR
npm install
```

2. **Configurează .env**
```bash
cp .env.example .env
```

Editează `.env` și adaugă:
```env
TELEGRAM_TOKEN=YOUR_BOT_TOKEN_HERE
PORT=3000
```

3. **Obține token Telegram**
- Contactează @BotFather pe Telegram
- Creează un bot nou
- Copiază token-ul în `.env`

4. **Pornește aplicația**
```bash
npm start
```

5. **Accesează web app**
- Mergi pe http://localhost:3000
- Configurează-ți prezențele trecute
- Startează botul pe Telegram cu `/start`

## 📱 Comenzi Telegram

| Comandă | Descriere |
|---------|-----------|
| `/start` | Inițializează botul |
| `/orar` | Orarul de astazi |
| `/status` | Status prezențe |
| `/obligatoriu` | Ore obligatorii |
| `/aman [materie]` | Amână o oră |
| `/ajutor` | Ghid complet |

## 🎓 Reguli de Frecvență

### Ore Săptămânale (TS, ME, E)
- Trebuie efectuate în fiecare săptămână
- Pot schimba grupa (SI ↔ SP) în aceeași săptămână
- Dacă nu mergi, nu se marchează prezență

### Ore la 2 Săptămâni (CF, MN, TCE, TW)
- Trebuie 7 prezențe în 14 săptămâni (1 la 2 săptămâni)
- Amânare = mută pe săptămâna viitoare
- Nu pot alege în ce săptămână, doar amână

## 🗄️ Baza de Date

SQLite cu tabele:
- `classes` - Structura orarului
- `attendance` - Istoricul prezențelor
- `postponements` - Orele amânate
- `settings` - Configurări generale

## 🚀 Deploy (Railway)

1. **Conectează repo la Railway**
```bash
git push
```

2. **Configurează environment variables pe Railway**
- `TELEGRAM_TOKEN` - Token bot Telegram
- `PORT` - Default 3000

3. **Deploy**
- Railway va detecta automat și deploya

## 📦 Structură Proiect

```
ORAR/
├── backend/
│   ├── index.js - Entry point
│   ├── server.js - Express server
│   ├── bot.js - Telegram bot
│   └── db.js - Database module
├── frontend/
│   ├── index.html - HTML
│   ├── style.css - Styling
│   └── app.js - Frontend logic
├── data/
│   ├── schedule.json - Structura orarului
│   └── orar.db - SQLite database (creat automat)
└── package.json
```

## 🔒 Securitate

- Variabile de mediu pentru credențiale
- Niciun token salvat în git
- Validare input pe server

## 🐛 Troubleshooting

### Bot nu trimite notificări
- Verifica TELEGRAM_TOKEN în .env
- Verifica dacă ai executat `/start` cu botul
- Check console pentru erori

### Baza de date nu se creează
- Verifică permisiuni în `/data` folder
- Șterge `orar.db` și restartează

### Port deja în uz
```bash
# Port 3000 is busy, change in .env
PORT=3001
```

## 📞 Support

Pentru bug-uri și feature requests, contactează dezvoltatorul.

## 📝 Licență

MIT License - Folosit doar în scop educational
