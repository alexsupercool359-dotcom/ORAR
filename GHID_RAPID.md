# 🚀 Ghid Rapid - Sistem Orar Personal

## ✨ Noul Sistem - 3 Pași Simpli

### 📅 Pasul 1: Creează Orarul TĂU

**URL**: http://localhost:3000/setup-schedule.html

**Ce faci aici**:
1. Vezi toate materiile tale (E, TS, ME, CF, MN, TCE1, TW, MS)
2. Pentru fiecare materie, click **"➕ Adaugă Oră"**
3. Completezi:
   - **Ziua**: Luni/Marți/etc.
   - **Ora Start**: Ex: 08:00
   - **Ora Sfârșit**: Ex: 10:00
   - **Sala**: Ex: E-302
   - **Tip**: Curs/Laborator/Seminar
   - **Semigrupă** (doar pentru materii la 2 săpt): SI/SP/Ambele

**Exemple**:

```
🔹 ELECTRONICA (Săptămânal):
  - Adaugi: Luni 08:00-10:00, E2, Curs
  - Adaugi: Luni 14:00-16:00, I-15, Laborator
  → Poți adăuga 2 ore pentru aceeași materie!

🔹 TS (Săptămânal):
  - Adaugi: Marți 08:00-12:00, E-302, Laborator
  - Adaugi: Joi 10:00-14:00, E-302, Laborator
  → Dacă nu mergi Marți, TREBUIE să mergi Joi (aceeași săptămână)!

🔹 CF (O dată la 2 săptămâni):
  - Adaugi: Marți 08:00-14:00, E402, Laborator, SI
  - Adaugi: Marți 08:00-14:00, E402, Laborator, SP
  → În săptămâna SI mergi la prima, în SP la a doua
```

**După ce termini**: Click **"💾 Salvează și Mergi la Prezențe"**

---

### 📋 Pasul 2: Marcă Prezențele (Săptămâni 1-7)

**URL**: http://localhost:3000/attendance-grid.html

**Ce vezi aici**:
- **Tabel cu toate orele tale**
- **7 coloane** (săptămânile 1-7)
- **Checkbox-uri** pentru fiecare oră

**Ce faci**:
1. Pentru fiecare oră la care **AI FOST PREZENT**, bifezi checkbox-ul
2. Pentru ore la care **AI LIPSIT**, lași nebifat
3. Click **"📊 Calculează Statistici"** să vezi statusul
4. Click **"💾 Salvează și Vezi Recomandări"**

**Exemplu**:
```
Săptămâna 1 (IMPARĂ):
✅ E Luni 08:00 - Am fost
✅ TS Marți 08:00 - Am fost
❌ CF Marți 08:00 - NU am fost (lasă nebifat)

Săptămâna 2 (PARĂ):
✅ E Luni 08:00 - Am fost
❌ TS Joi 10:00 - NU am fost (lasă nebifat)
✅ CF Marți 08:00 - Am fost (recuperez din săpt. 1)
```

---

### 🎯 Pasul 3: Vezi Recomandările

**URL**: http://localhost:3000/recommendations.html

**Ce vezi aici**:
- **Status per materie** (Verde/Portocaliu/Roșu)
- **Câte prezențe mai ai nevoie**
- **Ore disponibile** pentru săptămânile 8-14

**Statusuri**:

✅ **VERDE (Complet)**:
- Ai toate prezențele necesare
- Nu mai trebuie să mergi obligatoriu
- Exemplu: "7/14 prezențe → Mai trebuie 7 în 7 săptămâni = OK"

⚠️ **PORTOCALIU (Aproape)**:
- Mai ai nevoie de 1-3 prezențe
- Recomandare: Mergi în următoarele săptămâni
- Exemplu: "5/7 prezențe → Mai trebuie 2"

❌ **ROȘU (CRITIC)**:
- Mai ai nevoie de 4+ prezențe
- **URGENT**: Trebuie să mergi LA TOATE orele viitoare!
- Exemplu: "3/14 prezențe → Mai trebuie 11 în 7 săptămâni = IMPOSIBIL dacă lipsești"

---

## 🎓 Reguli Importante

### Materii SĂPTĂMÂNALE (E, TS, ME, MS)

**Regula**: TREBUIE 1 prezență/săptămână = **14 prezențe total**

**Ce înseamnă**:
- În fiecare săptămână TREBUIE să mergi
- Poți alege între orele pe care le-ai adăugat
- Dacă ai 2 ore (ex: Marți și Joi), poți alege oricare
- **NU poți amâna pe săptămâna viitoare!**

**Exemplu**:
```
Săptămâna 7 (curentă):
- TS Marți 08:00 (opțiune 1)
- TS Joi 10:00 (opțiune 2)

✅ Poți merge: La Marți SAU Joi (alegi tu)
❌ NU poți: Să nu mergi deloc săptămâna 7
```

---

### Materii LA 2 SĂPTĂMÂNI (CF, MN, TCE1, TW)

**Regula**: TREBUIE 1 prezență la 2 săptămâni = **7 prezențe total**

**Ce înseamnă**:
- În 14 săptămâni, trebuie 7 prezențe
- Poți alege când mergi (orice săptămână)
- **Poți amâna pe săptămâna viitoare**

**Exemplu**:
```
Săptămâna 7: CF Marți 08:00 (disponibil SI)
Săptămâna 8: CF Marți 08:00 (disponibil SP)

✅ Poți merge: Săpt. 7 SAU Săpt. 8 (sau ambele)
✅ Recomandare: Dacă ai 3/7 prezențe → Mergi în fiecare săptămână pară/impară alternativ
```

---

## 💡 Sfaturi Practice

### 1. Configurarea Orarului

**Ce ore să adaugi**:
- ✅ Adaugă DOAR orele la care POȚI merge (grupa ta)
- ✅ Adaugă variante multiple dacă ai opțiuni (ex: Marți și Joi)
- ❌ NU adăuga toate orele din PDF-ul oficial

**Exemplu bun**:
```
TS (grup meu):
- Marți 08:00-12:00 E-302 (opțiunea mea principală)
- Joi 10:00-14:00 E-302 (backup dacă lipsesc Marți)
```

**Exemplu rău**:
```
TS (TOATE grupele):
- Luni 08:00 E-302
- Marți 08:00 E-302
- Miercuri 10:00 E-302
- Joi 08:00 E-302
→ Prea multe opțiuni, confuz!
```

---

### 2. Marcarea Prezențelor

**Fii SINCER**:
- ✅ Bifează DOAR orele la care ai fost efectiv
- ❌ NU bifa ore la care nu ai fost

**De ce contează**:
- Sistemul calculează EXACT ce trebuie să faci
- Dacă minți → recomandări greșite → lipsești ore obligatorii

---

### 3. Planificarea Viitorului

**Bazează-te pe recomandări**:
1. **Prioritate 1**: Materii ROȘII (critice)
2. **Prioritate 2**: Materii PORTOCALII (aproape)
3. **Prioritate 3**: Materii VERZI (OK)

**Exemplu plan săptămâna 8**:
```
❌ E: 4/14 (CRITIC) → TREBUIE să merg
❌ TS: 5/14 (CRITIC) → TREBUIE să merg
⚠️ CF: 2/7 (APROAPE) → Recomandare să merg
✅ ME: 6/14 (OK) → Pot să merg sau nu
```

---

## 🔄 Editare și Actualizare

### Vreau să editez orarul:
1. Mergi la http://localhost:3000/setup-schedule.html
2. Șterge ore cu 🗑️ sau adaugă noi ore
3. Salvează din nou

### Vreau să editez prezențele:
1. Mergi la http://localhost:3000/attendance-grid.html
2. Bifează/Debifează checkbox-uri
3. Salvează din nou

---

## 📂 Unde Se Salvează

- **Orarul tău**: `/data/personal_schedule.json`
- **Prezențele tale**: `/data/attendance_grid.json`

---

## 🐛 Probleme Frecvente

| Problemă | Soluție |
|----------|---------|
| Nu văd orarul la Pasul 2 | Ai creat orarul la Pasul 1? |
| Recomandări nu se afișează | Ai marcat prezențele la Pasul 2? |
| Statistici greșite | Verifică prezențele bifate |
| Vreau să schimb orarul | Mergi la `/setup-schedule.html` |

---

## ✅ Checklist Final

- [ ] Server pornit: http://localhost:3000
- [ ] Pasul 1: Creat orarul personal
- [ ] Pasul 2: Marcat prezențele săptămâni 1-7
- [ ] Pasul 3: Văzut recomandări
- [ ] Planificat săptămânile 8-14

**GATA!** 🎉 Acum știi exact ce să faci!

---

## 🎯 Link-uri Rapide

- **Dashboard**: http://localhost:3000
- **1. Creează Orar**: http://localhost:3000/setup-schedule.html
- **2. Marcă Prezențe**: http://localhost:3000/attendance-grid.html
- **3. Vezi Recomandări**: http://localhost:3000/recommendations.html
