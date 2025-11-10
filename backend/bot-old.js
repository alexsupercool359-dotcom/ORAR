const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const { getAllClasses, getClassAttendance, getCurrentWeekNumber, getWeekType, getRequiredClassesForWeek, recordAttendance, addPostponement, setSetting, getSetting } = require('./db');

// Initialize bot with polling
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Store user IDs (in production, use a database)
const userIds = new Set();

console.log('Telegram bot started');

// Commands
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    userIds.add(chatId);

    const text = `
🎓 Bun venit la Sistemul de Gestionare a Orarului Facultății!

Sunt aqui pentru a-ți ajuta cu:
✅ Notificări automate despre ore
🔄 Amânare ore
📊 Status prezențe
📅 Vizualizare orar

Comenzi disponibile:
/orar - Afișează orarul de astazi
/status - Statusul prezențelor
/obligatoriu - Ore obligatorii
/aman [materie] - Amână o oră
/ajutor - Ajutor detaliat

Accesează web app: http://localhost:3000
    `;

    bot.sendMessage(chatId, text);
});

// Orar command
bot.onText(/\/orar/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        const classes = await getAllClasses();
        const today = new Date().toLocaleString('ro-RO', { weekday: 'long' }).toUpperCase();

        const todayClasses = classes.filter(c => c.day === today);

        if (todayClasses.length === 0) {
            bot.sendMessage(chatId, `📅 Astazi (${today}) nu ai ore programate.`);
            return;
        }

        let text = `📚 Orarul de ${today}:\n\n`;
        todayClasses.forEach(cls => {
            text += `⏰ ${cls.time_start} - ${cls.time_end}\n`;
            text += `📖 ${cls.name} (${cls.type})\n`;
            text += `📍 ${cls.room || 'Online'}\n\n`;
        });

        bot.sendMessage(chatId, text);
    } catch (err) {
        console.error('Error in /orar command:', err);
        bot.sendMessage(chatId, '❌ Eroare la încărcarea datelor');
    }
});

// Status command
bot.onText(/\/status/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        const classes = await getAllClasses();
        let text = '📊 Status Prezențe:\n\n';

        const grouped = {};
        for (const cls of classes) {
            if (!grouped[cls.name]) {
                grouped[cls.name] = {
                    class: cls,
                    attendance: await getClassAttendance(cls.id)
                };
            }
        }

        for (const [name, data] of Object.entries(grouped)) {
            const count = data.attendance.filter(a => a.status === 'present').length;
            const requiredCount = data.class.frequency === 'weekly' ? 14 : 7;
            const percentage = Math.round((count / requiredCount) * 100);

            const emoji = percentage >= 80 ? '✅' : percentage >= 50 ? '⚠️' : '❌';
            text += `${emoji} ${name}: ${count}/${requiredCount} (${percentage}%)\n`;
        }

        bot.sendMessage(chatId, text);
    } catch (err) {
        console.error('Error in /status command:', err);
        bot.sendMessage(chatId, '❌ Eroare la încărcarea statusului');
    }
});

// Obligatoriu command
bot.onText(/\/obligatoriu/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        const startDate = await getSetting('START_DATE') || '2025-09-29';
        const weekNum = getCurrentWeekNumber(startDate);
        const required = await getRequiredClassesForWeek(weekNum);

        if (required.length === 0) {
            bot.sendMessage(chatId, `✅ Nu sunt ore obligatorii săptămâna asta (${getWeekType(weekNum)})`);
            return;
        }

        let text = `✅ Ore obligatorii săptămâna ${weekNum} (${getWeekType(weekNum)}):\n\n`;
        required.forEach(cls => {
            text += `📖 ${cls.name}\n`;
            text += `📍 ${cls.room || 'Online'}\n`;
            text += `🕐 ${cls.time_start} - ${cls.time_end} (${cls.day})\n\n`;
        });

        bot.sendMessage(chatId, text);
    } catch (err) {
        console.error('Error in /obligatoriu command:', err);
        bot.sendMessage(chatId, '❌ Eroare');
    }
});

// Aman command
bot.onText(/\/aman\s+(.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const materie = match[1].trim().toUpperCase();

    try {
        const classes = await getAllClasses();
        const matchingClasses = classes.filter(c => c.name.includes(materie));

        if (matchingClasses.length === 0) {
            bot.sendMessage(chatId, `❌ Nu am găsit materia "${materie}"`);
            return;
        }

        // For biweekly classes, postpone to next week
        // For weekly classes, change group
        let text = '✅ Opțiuni pentru amânare:\n\n';
        matchingClasses.forEach((cls, idx) => {
            if (cls.frequency === 'weekly') {
                text += `${idx + 1}. Schimbă grupa (${cls.week_type})\n`;
            } else {
                text += `${idx + 1}. Mută pe săptămâna viitoare\n`;
            }
        });

        bot.sendMessage(chatId, text + '\nReacționează cu numărul opțiunii dorite (command /confirm + număr)');
    } catch (err) {
        console.error('Error in /aman command:', err);
        bot.sendMessage(chatId, '❌ Eroare la amânare');
    }
});

// Ajutor command
bot.onText(/\/ajutor/, (msg) => {
    const chatId = msg.chat.id;

    const text = `
📖 Ghid Complet:

🎯 COMENZI PRINCIPALE:
/orar - Orarul de astazi
/status - Status prezențe
/obligatoriu - Ore obligatorii
/aman [materie] - Amână o oră

📋 INFORMAȚII:
- Frecvență: Unele ore sunt o dată/săptămână (obligatorii), altele o dată/2 săptămâni
- Săptămână Impară (SI) vs Pară (SP): Pentru orele care au 2 grupe
- Amânare: Weekely = schimbă grupa; Biweekly = săptămâna viitoare

🔔 NOTIFICĂRI:
Vei primi notificări cu 1h înainte de orele obligatorii.

💻 WEB APP:
Accesează http://localhost:3000 pentru configurare completă
    `;

    bot.sendMessage(chatId, text);
});

// Set webhook for scheduled notifications
async function startNotifications() {
    // Run every hour at minute 0 to check for upcoming classes
    cron.schedule('0 * * * *', async () => {
        try {
            const now = new Date();
            const classes = await getAllClasses();

            for (const cls of classes) {
                // Parse time
                const [classHour, classMinute] = cls.time_start.split(':').map(Number);
                const classTime = new Date();
                classTime.setHours(classHour, classMinute, 0);

                // Calculate time difference
                const timeDiff = classTime - now;
                const hoursDiff = timeDiff / (1000 * 60 * 60);

                // Notify 1 hour before
                if (hoursDiff > 0.9 && hoursDiff < 1.1) {
                    const startDate = await getSetting('START_DATE') || '2025-09-29';
                    const weekNum = getCurrentWeekNumber(startDate);
                    const weekType = getWeekType(weekNum);
                    const required = await getRequiredClassesForWeek(weekNum);
                    const isRequired = required.some(c => c.id === cls.id);

                    const requiredText = isRequired ? '⚠️ OBLIGATORIU' : '📌 Opțional';

                    const text = `
${requiredText}
📖 ${cls.name}
🕐 Începe peste 1h la ${cls.time_start}
📍 ${cls.room || 'Online'}
📅 ${cls.day}

Comenzi rapide:
/aman ${cls.name.split(' ')[0]} - Amână ora
/orar - Vezi orarul complet
                    `;

                    // Send to all registered users
                    for (const userId of userIds) {
                        bot.sendMessage(userId, text);
                    }
                }
            }
        } catch (err) {
            console.error('Error in notifications:', err);
        }
    });

    console.log('Notification system started');
}

// Start notifications when bot initializes
setTimeout(startNotifications, 2000);

module.exports = { bot, startNotifications };
