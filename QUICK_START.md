# ⚡ Quick Start - Pornire Rapidă

## 1️⃣ Setup Local (5 minute)

```bash
# Ești deja în folder
cd /Users/mirautaalexandru/Desktop/ORAR

# Dependențele sunt instalate
npm install

# Editează .env cu token Telegram
TELEGRAM_TOKEN=TOKEN_TAU_AICI

# Pornește
npm start
```

**Acces**: http://localhost:3000

---

## 2️⃣ Configurare Inițială

1. **Deschide web app** → http://localhost:3000
2. **Tab "Configurare Inițială"** → marchează orele la care ai fost
3. **Salvează** → Click "💾 Salvează Prezențe"
4. **Verifica** → Tab "Status Prezențe"

---

## 3️⃣ Bot Telegram

1. **Contactează @BotFather** → `/newbot` → copiază token
2. **Pune token-ul** în `.env`
3. **Restart server**: `npm start`
4. **Find your bot** pe Telegram → `/start`

**Comenzi rapide**:
- `/orar` - Orarul de astazi
- `/status` - Status prezențe
- `/obligatoriu` - Ore obligatorii
- `/aman [materie]` - Amână o oră

---

## 4️⃣ Deploy pe Railway (10 minute)

1. **Push pe GitHub** (opțional):
```bash
git init
git add .
git commit -m "Init"
git push origin main
```

2. **Railway Dashboard**:
   - https://railway.app
   - "New Project"
   - "Deploy from GitHub" (sau "Deploy from CLI")
   - Selectează ORAR repo

3. **Environment Variables**:
   - `TELEGRAM_TOKEN` = TOKEN_TAU

4. **Done!** 🎉
   - URL public: `https://xxxx.railway.app`
   - Web app: la URL public
   - Bot: funcționează automat

---

## 📊 Ce Pot Face

### Configurare Prezențe
- ✅ Mark orele la care am fost
- ✅ Auto-save la refresh
- ✅ View status pe materie

### Bot Telegram (24/7)
- 🔔 Notificări 1h înainte
- 🔄 Amânare ore
- 📊 Status prezențe
- 📅 Vizualizare orar

### Web Dashboard
- 📈 Progress per materie
- ✅ Ore obligatorii săptămâna asta
- 🎯 Recomandări automatice

---

## 🎓 Sistem Prezențe

### Ore SĂPTĂMÂNALE (TS, ME, E)
- Trebuie **1 prezență/săptămână**
- Poti schimba grupa (SI ↔ SP)
- Dacă nu mergi → nu se marchează

### Ore la 2 SĂPTĂMÂNI (CF, MN, TCE, TW)
- Trebuie **7 prezențe în 14 săptămâni**
- Amânare → mută pe săptămâna viitoare
- Dacă nu mergi → nu se marchează

---

## 🔧 Troubleshooting

| Problem | Soluție |
|---------|---------|
| Port deja folosit | Schimbă PORT în .env |
| Bot nu merge | Verifica TELEGRAM_TOKEN |
| Database error | Șterge `data/orar.db` și restart |
| Web app blank | Verifica http://localhost:3000/api/classes |

---

## 📞 Resurse

- `README.md` - Documentație completă
- `DEPLOY_RAILWAY.md` - Detalii deployment
- `.env.example` - Template variabile
- `backend/bot.js` - Logica bot
- `frontend/app.js` - Logica web

---

## ✅ Checklist Final

- [ ] npm install OK
- [ ] Token Telegram în .env
- [ ] npm start rulează pe :3000
- [ ] Web app se încarcă
- [ ] Bot răspunde pe Telegram
- [ ] Notificări funcționează (teste la /obligatoriu)
- [ ] Deploy pe Railway

**Gata!** 🎉 Sistemul tău e ready to use!
