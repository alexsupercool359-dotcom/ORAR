# 🚀 START HERE - Sistem Orar Complet

## ⚡ Start Rapid (1 minut)

### Opțiunea 1: Script Automat
```bash
cd /Users/mirautaalexandru/Desktop/ORAR
./start.sh
```

### Opțiunea 2: npm
```bash
cd /Users/mirautaalexandru/Desktop/ORAR
npm run setup
```

### Opțiunea 3: Manual
```bash
cd /Users/mirautaalexandru/Desktop/ORAR
npm install  # Prima dată
npm start    # Pornește serverul
```

---

## 🎯 Ce Face Script-ul?

1. ✅ Verifică Node.js și npm
2. ✅ Creează `.env` cu Telegram Bot Token
3. ✅ Instalează dependențe (dacă nu există)
4. ✅ Oprește procese vechi
5. ✅ Pornește serverul
6. ✅ Afișează link-uri utile

---

## 📱 Setup Telegram Bot

### Pas 1: Creează Bot

1. Deschide Telegram
2. Caută `@BotFather`
3. Trimite: `/newbot`
4. Alege nume: `OrarFacultateBot` (sau ce vrei tu)
5. Alege username: `orar_facultate_bot` (trebuie să fie unic)
6. **Copiază token-ul**: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

### Pas 2: Configurează Token

**Când rulezi `./start.sh`**, vei fi întrebat:
```
Introdu Telegram Bot Token (de la @BotFather):
```

**Lipește token-ul** și apasă Enter.

Sau **editează manual** `.env`:
```bash
nano .env
# Apoi înlocuiește:
TELEGRAM_TOKEN=TOKEN_TAU_AICI
```

### Pas 3: Testează Bot

1. Găsește botul tău pe Telegram (username-ul ales)
2. Trimite: `/start`
3. Ar trebui să primești mesaj de bun venit!

---

## 🌐 Dashboard Web - Sursa Principală

### URL: http://localhost:3000

**Dashboard-ul afișează**:
- ✅ Status prezențe per materie (Verde/Portocaliu/Roșu)
- ✅ Câte prezențe ai / câte mai trebuie
- ✅ Ore disponibile pentru săptămânile viitoare
- ✅ Link-uri rapide către configurare

**Acesta e sursa principală** - toate datele se bazează pe:
1. Orarul tău personal (`personal_schedule.json`)
2. Prezențele marcate (`attendance_grid.json`)

---

## 📊 Cum Funcționează Sistemul

### 1. Creezi Orarul TĂU
**URL**: http://localhost:3000/setup-schedule.html

- Adaugi DOAR orele tale (nu toate grupele)
- Poți adăuga aceeași materie de 2 ori (ex: Marți + Joi)
- Salvezi → Merge automat la Pas 2

### 2. Marchezi Prezențele (Săptămâni 1-7)
**URL**: http://localhost:3000/attendance-grid.html

- Vezi tabel cu toate orele tale
- Bifezi checkbox-uri pentru orele la care AI FOST
- Calculezi statistici
- Salvezi → Merge automat la Dashboard

### 3. Vezi Dashboard-ul (Sursa Principală)
**URL**: http://localhost:3000

- Status per materie: ✅ Verde / ⚠️ Portocaliu / ❌ Roșu
- Recomandări pentru săptămânile 8-14
- **Aceasta e sursa aplicației!**

---

## 🔔 Notificări Telegram

### Cum Funcționează

Botul trimite notificări **automat cu 1h înainte** de ore.

**Criterii notificare**:
- ✅ E ora ta din orar (ziua + intervalul corect)
- ✅ E săptămâna corectă (SI/SP)
- ✅ E **OBLIGATORIU** (ai prezențe rămase)

**Exemplu notificare**:
```
🚨 CRITIC

📖 ELECTRONICA
🕐 Începe peste 1h la 08:00
📍 E2

Status: 5/14 | Rămân: 9

Dashboard: http://localhost:3000
```

### Comenzi Bot

| Comandă | Descriere |
|---------|-----------|
| `/start` | Pornește botul |
| `/status` | Status prezențe (dashboard condensat) |
| `/orar` | Orarul tău de astăzi |
| `/obligatoriu` | Ce ore TREBUIE să mergi săptămâna asta |
| `/ajutor` | Ghid complet |

---

## 🎓 Reguli de Prezență

### Materii SĂPTĂMÂNALE (E, TS, ME, MS)
- **Obligatoriu**: 1 prezență/săptămână
- **Total**: 14 prezențe (14 săptămâni)
- **Poți alege**: Dacă ai 2 ore (Marți + Joi), merge oricare
- **NU POȚI amâna** pe săptămâna viitoare

### Materii LA 2 SĂPTĂMÂNI (CF, MN, TCE1, TW)
- **Obligatoriu**: 1 prezență la 2 săptămâni
- **Total**: 7 prezențe (14 săptămâni)
- **Poți alege**: Orice săptămână
- **POȚI amâna** pe săptămâna viitoare

---

## 🛠️ Comenzi Utile

### Pornire
```bash
npm start          # Pornește serverul
npm run setup      # Script automat (verifică tot)
./start.sh         # Script bash direct
```

### Oprire
```bash
npm run stop       # Oprește serverul
# SAU
pkill -f 'node backend/index.js'
```

### Restart
```bash
npm run restart    # Oprește și repornește
```

### Verificare
```bash
curl http://localhost:3000   # Verifică dacă merge
```

---

## 📂 Structura Fișierelor

```
ORAR/
├── .env                       ← TOKEN TELEGRAM (IMPORTANT!)
├── start.sh                   ← Script de start automat
├── package.json               ← Comenzi npm
│
├── frontend/
│   ├── dashboard.html         ← DASHBOARD PRINCIPAL (index redirectează aici)
│   ├── setup-schedule.html    ← 1. Creează orar
│   ├── attendance-grid.html   ← 2. Marcă prezențe
│   └── recommendations.html   ← 3. Recomandări (vechi)
│
├── backend/
│   ├── index.js              ← Entry point
│   ├── server.js             ← API endpoints
│   └── bot.js                ← Telegram bot (ACTUALIZAT)
│
└── data/
    ├── personal_schedule.json    ← ORARUL TĂU (sursa #1)
    ├── attendance_grid.json      ← PREZENȚELE TALE (sursa #2)
    └── telegram_users.json       ← User IDs Telegram
```

---

## 🎯 Flow Complet

1. **Pornești serverul**: `./start.sh` sau `npm start`
2. **Configurezi Bot**: Token în `.env`
3. **Creezi orarul**: http://localhost:3000/setup-schedule.html
4. **Marchezi prezențe**: http://localhost:3000/attendance-grid.html
5. **Vezi dashboard**: http://localhost:3000 ← **SURSA PRINCIPALĂ**
6. **Primești notificări**: Telegram cu 1h înainte
7. **Verifici status**: `/status` pe Telegram

---

## 🐛 Probleme Frecvente

| Problemă | Soluție |
|----------|---------|
| Bot nu trimite notificări | Verifică token în `.env` + `/start` cu botul |
| Dashboard gol | Ai creat orarul + marcat prezențele? |
| Port 3000 ocupat | `npm run stop` apoi `npm start` |
| Dependențe lipsă | `npm install` |
| Script nu rulează | `chmod +x start.sh` |

---

## ✅ Checklist Final

- [ ] Node.js instalat (`node --version`)
- [ ] Token Telegram în `.env`
- [ ] Server pornit (`npm start` sau `./start.sh`)
- [ ] Orar creat (http://localhost:3000/setup-schedule.html)
- [ ] Prezențe marcate (http://localhost:3000/attendance-grid.html)
- [ ] Dashboard afișat (http://localhost:3000)
- [ ] Bot testat (`/start` pe Telegram)
- [ ] Notificări active (așteaptă 1h înainte de o oră)

---

## 🎉 GATA!

**Dashboard Principal**: http://localhost:3000
**Bot Telegram**: @YOUR_BOT_USERNAME

**Toate datele se bazează pe**:
- `personal_schedule.json` (orarul tău)
- `attendance_grid.json` (prezențele tale)

**Bot-ul trimite notificări automat** cu 1h înainte de ore obligatorii!

---

## 📞 Support

Pentru probleme:
1. Verifică log-uri în terminal
2. Verifică `.env` (token corect?)
3. Verifică dashboard (date corecte?)
4. Restart: `npm run restart`
