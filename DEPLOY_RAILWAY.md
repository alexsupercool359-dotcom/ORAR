# 🚀 Deployment pe Railway

Ghid pas cu pas pentru deploy-ul aplicației pe Railway.

## Pasul 1: Setup Git (dacă nu e făcut)

```bash
cd /Users/mirautaalexandru/Desktop/ORAR
git init
git add .
git commit -m "Initial commit: Orar system with Telegram bot"
```

## Pasul 2: Creează Cont Railway

1. Mergi pe https://railway.app
2. Click "Start" și conectează-ți GitHub
3. Autorizează Railway să acceseze contul tău

## Pasul 3: Deploy Proiectul

### Opțiunea A: Din GitHub (Recomandat)

1. Push codul pe GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/ORAR.git
git branch -M main
git push -u origin main
```

2. În Railway Dashboard:
   - Click "New Project"
   - Click "Deploy from GitHub"
   - Selectează repository-ul "ORAR"
   - Click "Deploy"

### Opțiunea B: Directă pe Railway

1. Instalează Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login:
```bash
railway login
```

3. Inițializează proiect:
```bash
railway init
```

4. Deploy:
```bash
railway up
```

## Pasul 4: Configurează Environment Variables

1. Mergi în Railway Dashboard → Project Settings
2. Click "Variables"
3. Adaugă:

| Key | Value |
|-----|-------|
| `TELEGRAM_TOKEN` | Token-ul de la @BotFather |
| `NODE_ENV` | production |
| `PORT` | (Auto, lăsă gol) |

## Pasul 5: Verifică Deployment

1. Railway va afișa URL-ul public: `https://xxxx.railway.app`
2. Teste pe URL-ul public să vezi dacă merge

## Pasul 6: Conectează Botul Telegram

1. Mergi la @BotFather pe Telegram
2. Selectează botul tău
3. Click "Edit Bot"
4. Selectează "Webhook"
5. Setează webhook URL:
   ```
   https://xxxx.railway.app/api/webhook
   ```

Alternativ, botul va folosi polling (implicit) care funcționează fără webhook.

## Pasul 7: Test Bot

1. Găsește botul tău pe Telegram
2. Trimite `/start`
3. Ar trebui să primești confirmarea

## 🔧 Troubleshooting

### Eroare: "Build failed"
- Verifică Node version (trebuie 14+)
- Certifică-te că `package.json` este în root directory
- Verify `backend/index.js` is the entry point

### Bot nu răspunde
- Verifică TELEGRAM_TOKEN în Railway Variables
- Restart deployment
- Check Railway Logs

### Port errors
- Railway alocă port automat
- Don't hardcode PORT în server.js

### Database errors
- SQLite database se creează automat în `/data/orar.db`
- Verifică permisiuni în container

## 📊 Monitoring

1. Railway Dashboard → Logs
   - Vezi output aplicației în real-time
   - Căuta erori de deployment

2. Analytics
   - Monitorează CPU, memory, network
   - Railway te avertizează dacă se apropie limite

## 💡 Upgrade Plan (Optional)

Railway free tier include:
- 500 hours/month compute
- 5GB storage
- Suficient pentru aplicație

Pentru production mai mare:
- Upgrade la plan plătit
- Adaugă bază de date PostgreSQL
- Adaugă Redis pentru cache

## 🔄 Update Codul

După ce e deployed, pentru update:

1. Commit changes:
```bash
git add .
git commit -m "Update: New features"
```

2. Push pe GitHub:
```bash
git push origin main
```

3. Railway reface auto deployment

## 📱 Web App URL

După deploy, URL-ul web app-ului va fi:
```
https://xxxx.railway.app
```

Aceasta înlocuiește `http://localhost:3000` din development.

## ✅ Verificare Finală

- [ ] Aplicația se încarcă pe URL public
- [ ] Web dashboard se deschide
- [ ] Bot răspunde pe Telegram
- [ ] Notificările se trimit
- [ ] Database salvează date
