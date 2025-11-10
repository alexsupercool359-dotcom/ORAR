# 🎯 Ghid de Utilizare - Sistem Orar Personalizat

## 📝 Prezentare Generală

Acest sistem te ajută să:
1. **Configurezi prezențele din săptămânile 1-7** (trecute)
2. **Calculezi automat ce ore trebuie să mergi** în săptămânile 8-14 (viitoare)
3. **Primești notificări Telegram** cu 1h înainte de ore

---

## 🚀 Pași de Configurare

### Pasul 1: Pornește Serverul

```bash
cd /Users/mirautaalexandru/Desktop/ORAR
npm start
```

Server pornește pe: **http://localhost:3000**

---

### Pasul 2: Configurează Prezențele (Săptămâni 1-7)

1. **Deschide în browser**: http://localhost:3000/config.html

2. **Vei vedea 7 săptămâni** (de la săptămâna 1 la 7)
   - Săptămână 1, 3, 5, 7 = **IMPARĂ (SI)**
   - Săptămână 2, 4, 6 = **PARĂ (SP)**

3. **Pentru fiecare săptămână**:
   - Bifează DOAR orele la care **ai fost prezent efectiv**
   - Nu bifa orele la care nu ai fost

4. **Materii afișate**:
   - **ELECTRONICA (E)** - Săptămânal
   - **TEORIA SISTEMELOR (TS)** - Săptămânal
   - **MATERIALE ELECTROTEHNICE (ME)** - Săptămânal
   - **CALITATE ȘI FIABILITATE (CF)** - O dată la 2 săptămâni
   - **METODE NUMERICE (MN)** - O dată la 2 săptămâni
   - **TCE1** - O dată la 2 săptămâni
   - **TEHNOLOGII WEB (TW)** - O dată la 2 săptămâni
   - **MATEMATICI SPECIALE (MS)** - Săptămânal

5. **Click "📊 Calculează Statistici"**:
   - Vezi câte prezențe ai la fiecare materie
   - Vezi procentajul de completare

6. **Click "💾 Salvează și Vezi Recomandări"**:
   - Salvează prezențele tale
   - Redirecționează către pagina de recomandări

---

### Pasul 3: Vezi Recomandările

După salvare, vei vedea automat pagina de **Recomandări** cu:

#### 📊 Pentru fiecare materie:

**✅ Status COMPLET** (verde):
- Ai toate prezențele necesare
- Nu mai trebuie să mergi obligatoriu

**⚠️ Status APROAPE** (portocaliu):
- Mai ai nevoie de 1-3 prezențe
- Recomandare: mergi în următoarele săptămâni

**❌ Status CRITIC** (roșu):
- Mai ai nevoie de 4+ prezențe
- **URGENT**: Trebuie să mergi în următoarele săptămâni!

#### 📅 Pentru fiecare materie vezi:
- Prezențe până acum
- Total necesar
- Câte mai rămân
- Progres (%)
- **Ore disponibile** în săptămânile viitoare

---

## 📖 Reguli de Prezență

### 🔄 Materii SĂPTĂMÂNALE (TS, ME, E, MS)
- **Obligatoriu**: 1 prezență/săptămână = **14 prezențe în total**
- **Poți alege**: Grupa SI sau SP în aceeași săptămână
- **Amânare**: Dacă nu mergi o săptămână, nu o poți recupera

**Exemplu**:
```
Săptămâna 7 (IMPARĂ):
- TS laborator E-302: 08:00-12:00 (disponibil)
- TS laborator E-302: 10:00-19:00 (disponibil)
→ Alegi pe oricare, dar TREBUIE să mergi în săptămâna 7!
```

### 📆 Materii LA 2 SĂPTĂMÂNI (CF, MN, TCE1, TW)
- **Obligatoriu**: 1 prezență la 2 săptămâni = **7 prezențe în total**
- **Poți alege**: Grupa SI sau SP când e disponibilă
- **Amânare**: Dacă nu mergi săptămâna asta, poți merge săptămâna viitoare

**Exemplu**:
```
CF (Calitate și Fiabilitate):
- Săptămâna 1 (SI): CF laborator disponibil → Poți merge
- Săptămâna 2 (SP): CF laborator disponibil → Poți merge
→ Trebuie să mergi LA UNA dintre ele (nu ambele obligatoriu)
→ Dacă nu mergi săpt. 1, TREBUIE să mergi săpt. 2
```

---

## 🎯 Exemple Concrete

### Exemplu 1: Ai fost la TOATE orele săptămânile 1-7

**Configurare**:
- Bifezi TOATE orele la care ai fost prezent
- Salvezi

**Rezultat Recomandări**:
```
✅ ELECTRONICA: 7/14 (50%) → Mai trebuie 7 prezențe
✅ TS: 7/14 (50%) → Mai trebuie 7 prezențe
✅ ME: 7/14 (50%) → Mai trebuie 7 prezențe
✅ CF: 3-4/7 (50-60%) → Mai trebuie 3-4 prezențe
✅ MN: 3-4/7 (50-60%) → Mai trebuie 3-4 prezențe
✅ TCE1: 3-4/7 (50-60%) → Mai trebuie 3-4 prezențe
✅ TW: 3-4/7 (50-60%) → Mai trebuie 3-4 prezențe
```

### Exemplu 2: Ai lipsit la unele ore

**Configurare**:
- Săptămâna 1: Ai fost la E, TS, ME (bifezi)
- Săptămâna 2: Ai lipsit la E (nu bifezi)
- Săptămâna 3: Ai fost la toate (bifezi)
- etc.

**Rezultat Recomandări**:
```
❌ ELECTRONICA: 5/14 (36%) → CRITIC! Mai trebuie 9 prezențe în 7 săptămâni
⚠️ TS: 6/14 (43%) → ATENȚIE! Mai trebuie 8 prezențe
✅ ME: 7/14 (50%) → OK, mai trebuie 7 prezențe
```

---

## 💡 Sfaturi de Utilizare

### 1. **Fii SINCER cu prezențele**
- Bifează DOAR ce ai făcut efectiv
- Sistemul calculează corect doar dacă datele sunt corecte

### 2. **Verifică statisticile ÎNAINTE de salvare**
- Click "📊 Calculează Statistici"
- Vezi dacă numerele sunt corecte
- Dacă nu, corectează prezențele

### 3. **Salvează când ești SIGUR**
- După salvare, datele sunt stocate
- Poți edita oricând dând click "✏️ Editează Prezențe"

### 4. **Planifică săptămânile viitoare**
- Basează-te pe recomandări
- Prioritizează materiile cu status CRITIC (roșu)
- Apoi cele cu status APROAPE (portocaliu)

---

## 🔔 Notificări Telegram (Viitor)

După ce configurezi prezențele, botul va:
1. **Trimite notificări cu 1h înainte** de orele obligatorii
2. **Specific dacă e OBLIGATORIU** sau opțional
3. **Permite amânare** prin comenzi

**Comenzi bot**:
```
/orar        - Orarul de astazi
/status      - Status prezențe (același ca pe web)
/obligatoriu - Ore obligatorii săptămâna asta
/aman CF     - Amână ora de CF
```

---

## 📂 Unde Se Salvează Datele?

- **Prezențe**: `/data/attendance_history.json`
- **Orar complet**: `/data/schedule_complete.json`
- **Database**: `/data/orar.db` (SQLite)

---

## 🐛 Troubleshooting

| Problemă | Soluție |
|----------|---------|
| Pagina config.html nu se încarcă | Verifică că serverul rulează pe :3000 |
| Nu văd toate materiile | Refresh page (Ctrl+R / Cmd+R) |
| Statistici greșite | Verifică ce ai bifat în fiecare săptămână |
| Recomandări nu se afișează | Verifică console (F12) pentru erori |
| Vreau să editez prezențele | Click "✏️ Editează Prezențe" |

---

## ✅ Checklist Final

- [ ] Server pornit (`npm start`)
- [ ] Acces la http://localhost:3000/config.html
- [ ] Configurat prezențe pentru săptămânile 1-7
- [ ] Verificat statistici
- [ ] Salvat prezențe
- [ ] Văzut recomandări
- [ ] Planificat săptămânile 8-14

**Gata!** 🎉 Acum știi exact la ce ore trebuie să mergi!

---

## 📞 Contact

Pentru întrebări sau probleme, verifică:
- `README.md` - Documentație tehnică
- `QUICK_START.md` - Ghid rapid pornire
- `DEPLOY_RAILWAY.md` - Deploy cloud
