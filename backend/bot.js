const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// Initialize bot with polling
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Store user IDs
const userIdsFile = path.join(__dirname, '../data/telegram_users.json');
let userIds = new Set();

// Load user IDs
if (fs.existsSync(userIdsFile)) {
    const data = JSON.parse(fs.readFileSync(userIdsFile, 'utf8'));
    userIds = new Set(data);
}

function saveUserIds() {
    fs.writeFileSync(userIdsFile, JSON.stringify([...userIds], null, 2));
}

console.log('✅ Telegram bot started');

// Load personal schedule and attendance
function loadData() {
    try {
        const scheduleFile = path.join(__dirname, '../data/personal_schedule.json');
        const attendanceFile = path.join(__dirname, '../data/attendance_grid.json');

        if (!fs.existsSync(scheduleFile)) {
            return { schedule: null, attendance: {} };
        }

        const schedule = JSON.parse(fs.readFileSync(scheduleFile, 'utf8'));
        let attendance = {};

        if (fs.existsSync(attendanceFile)) {
            attendance = JSON.parse(fs.readFileSync(attendanceFile, 'utf8'));
        }

        return { schedule, attendance };
    } catch (err) {
        console.error('Error loading data:', err);
        return { schedule: null, attendance: {} };
    }
}

// Get recommendations
function getRecommendations() {
    try {
        const { schedule, attendance } = loadData();

        if (!schedule) return null;

        const recommendations = {};

        Object.entries(schedule).forEach(([key, subject]) => {
            if (subject.classes.length === 0) return;

            // Count attendance
            const subjectAttendance = Object.keys(attendance).filter(cellId => {
                return attendance[cellId].subject === key && attendance[cellId].checked;
            }).length;

            const requiredCount = subject.frequency === 'weekly' ? 14 : 7;
            const remaining = requiredCount - subjectAttendance;

            recommendations[subject.name] = {
                acronym: subject.acronym,
                frequency: subject.frequency,
                required: requiredCount,
                attended: subjectAttendance,
                remaining: remaining,
                status: remaining <= 0 ? 'complete' : remaining <= 3 ? 'warning' : 'needed',
                classes: subject.classes
            };
        });

        return recommendations;
    } catch (err) {
        console.error('Error getting recommendations:', err);
        return null;
    }
}

// Commands

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userIds.add(chatId);
    saveUserIds();

    const text = `
🎓 Bun venit la Dashboard Orar!

Sunt aici pentru a-ți trimite notificări automate când ai ore obligatorii.

Comenzi disponibile:
/status - Status prezențe și recomandări
/orar - Orarul tău
/obligatoriu - Ce ore trebuie să mergi
/ajutor - Ghid complet

🌐 Dashboard Web: http://localhost:3000
    `;

    bot.sendMessage(chatId, text);
});

bot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;

    try {
        const recommendations = getRecommendations();

        if (!recommendations) {
            bot.sendMessage(chatId, '❌ Nu ai configurat orarul!\n\n👉 Mergi pe http://localhost:3000');
            return;
        }

        let text = '📊 Status Prezențe:\n\n';

        Object.entries(recommendations).forEach(([name, rec]) => {
            const percentage = Math.round((rec.attended / rec.required) * 100);
            let emoji = '✅';
            if (rec.status === 'warning') emoji = '⚠️';
            if (rec.status === 'needed') emoji = '❌';

            text += `${emoji} ${name}\n`;
            text += `   ${rec.attended}/${rec.required} (${percentage}%) | Rămân: ${rec.remaining}\n\n`;
        });

        bot.sendMessage(chatId, text);
    } catch (err) {
        console.error('Error:', err);
        bot.sendMessage(chatId, '❌ Eroare la încărcarea datelor');
    }
});

bot.onText(/\/orar/, (msg) => {
    const chatId = msg.chat.id;

    try {
        const { schedule } = loadData();

        if (!schedule) {
            bot.sendMessage(chatId, '❌ Nu ai configurat orarul!');
            return;
        }

        const today = getDayName(new Date());
        const currentWeek = getCurrentWeekNumber();
        const weekType = currentWeek % 2 === 1 ? 'SI' : 'SP';

        let text = `📅 Orar ${today} (Săptămâna ${currentWeek} - ${weekType}):\n\n`;
        let found = false;

        Object.entries(schedule).forEach(([key, subject]) => {
            subject.classes.forEach(cls => {
                if (cls.day === today) {
                    // Check if available this week
                    if (cls.week_type && cls.week_type !== weekType) return;

                    found = true;
                    text += `⏰ ${cls.time_start}-${cls.time_end}\n`;
                    text += `📖 ${subject.name} (${cls.type})\n`;
                    text += `📍 ${cls.room}\n\n`;
                }
            });
        });

        if (!found) {
            text += `Nu ai ore programate astăzi.`;
        }

        bot.sendMessage(chatId, text);
    } catch (err) {
        console.error('Error:', err);
        bot.sendMessage(chatId, '❌ Eroare');
    }
});

bot.onText(/\/obligatoriu/, (msg) => {
    const chatId = msg.chat.id;

    try {
        const recommendations = getRecommendations();

        if (!recommendations) {
            bot.sendMessage(chatId, '❌ Nu ai configurat orarul!');
            return;
        }

        const currentWeek = getCurrentWeekNumber();
        const weekType = currentWeek % 2 === 1 ? 'SI' : 'SP';

        let text = `✅ Ore OBLIGATORII Săptămâna ${currentWeek} (${weekType}):\n\n`;
        let found = false;

        Object.entries(recommendations).forEach(([name, rec]) => {
            // Skip if complete or optional
            if (rec.status === 'complete' || rec.remaining <= 0) return;

            // For weekly: always required
            // For biweekly: only if remaining > 0
            if (rec.frequency === 'weekly' || rec.remaining > 0) {
                found = true;
                const urgency = rec.status === 'needed' ? '🚨 CRITIC' : rec.status === 'warning' ? '⚠️ URGENT' : '📌';

                text += `${urgency} ${name}\n`;
                text += `   Mai trebuie: ${rec.remaining} prezențe\n\n`;
            }
        });

        if (!found) {
            text += `🎉 Nu ai ore obligatorii săptămâna aceasta!`;
        }

        bot.sendMessage(chatId, text);
    } catch (err) {
        console.error('Error:', err);
        bot.sendMessage(chatId, '❌ Eroare');
    }
});

bot.onText(/\/maine/, (msg) => {
    const chatId = msg.chat.id;

    try {
        const { schedule } = loadData();

        if (!schedule) {
            bot.sendMessage(chatId, '❌ Nu ai configurat orarul!');
            return;
        }

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDay = getDayName(tomorrow);
        const currentWeek = getCurrentWeekNumber();
        const weekType = currentWeek % 2 === 1 ? 'SI' : 'SP';

        let text = `📅 Orar MÂINE ${tomorrowDay} (Săptămâna ${currentWeek} - ${weekType}):\n\n`;
        let found = false;

        Object.entries(schedule).forEach(([key, subject]) => {
            subject.classes.forEach(cls => {
                if (cls.day === tomorrowDay) {
                    // Check if available this week
                    if (cls.week_type && cls.week_type !== weekType) return;

                    found = true;
                    text += `⏰ ${cls.time_start}-${cls.time_end}\n`;
                    text += `📖 ${subject.name} (${cls.type})\n`;
                    text += `📍 ${cls.room}\n\n`;
                }
            });
        });

        if (!found) {
            text += `🎉 Nu ai ore programate mâine!`;
        }

        bot.sendMessage(chatId, text);
    } catch (err) {
        console.error('Error:', err);
        bot.sendMessage(chatId, '❌ Eroare');
    }
});

bot.onText(/\/saptamana/, (msg) => {
    const chatId = msg.chat.id;

    try {
        const { schedule } = loadData();

        if (!schedule) {
            bot.sendMessage(chatId, '❌ Nu ai configurat orarul!');
            return;
        }

        const currentWeek = getCurrentWeekNumber();
        const weekType = currentWeek % 2 === 1 ? 'SI' : 'SP';
        const days = ['LUNI', 'MARTI', 'MIERCURI', 'JOI', 'VINERI'];

        let text = `📅 ORAR SĂPTĂMÂNA ${currentWeek} (${weekType}):\n\n`;

        days.forEach(day => {
            const dayClasses = [];

            Object.entries(schedule).forEach(([key, subject]) => {
                subject.classes.forEach(cls => {
                    if (cls.day === day) {
                        // Check if available this week
                        if (cls.week_type && cls.week_type !== weekType) return;

                        dayClasses.push({
                            time: cls.time_start,
                            name: subject.name,
                            room: cls.room,
                            type: cls.type
                        });
                    }
                });
            });

            if (dayClasses.length > 0) {
                text += `\n🗓️ ${day}:\n`;
                dayClasses.sort((a, b) => a.time.localeCompare(b.time));
                dayClasses.forEach(cls => {
                    text += `  ${cls.time} - ${cls.name} (${cls.type}) @ ${cls.room}\n`;
                });
            }
        });

        bot.sendMessage(chatId, text);
    } catch (err) {
        console.error('Error:', err);
        bot.sendMessage(chatId, '❌ Eroare');
    }
});

bot.onText(/\/viitor|\/next/, (msg) => {
    const chatId = msg.chat.id;

    try {
        const { schedule } = loadData();

        if (!schedule) {
            bot.sendMessage(chatId, '❌ Nu ai configurat orarul!');
            return;
        }

        const currentWeek = getCurrentWeekNumber();
        const nextWeek = currentWeek + 1;
        const nextWeekType = nextWeek % 2 === 1 ? 'SI' : 'SP';
        const days = ['LUNI', 'MARTI', 'MIERCURI', 'JOI', 'VINERI'];

        let text = `📅 ORAR SĂPTĂMÂNA VIITOARE ${nextWeek} (${nextWeekType}):\n\n`;

        days.forEach(day => {
            const dayClasses = [];

            Object.entries(schedule).forEach(([key, subject]) => {
                subject.classes.forEach(cls => {
                    if (cls.day === day) {
                        // Check if available next week
                        if (cls.week_type && cls.week_type !== nextWeekType) return;

                        dayClasses.push({
                            time: cls.time_start,
                            name: subject.name,
                            room: cls.room,
                            type: cls.type
                        });
                    }
                });
            });

            if (dayClasses.length > 0) {
                text += `\n🗓️ ${day}:\n`;
                dayClasses.sort((a, b) => a.time.localeCompare(b.time));
                dayClasses.forEach(cls => {
                    text += `  ${cls.time} - ${cls.name} (${cls.type}) @ ${cls.room}\n`;
                });
            }
        });

        bot.sendMessage(chatId, text);
    } catch (err) {
        console.error('Error:', err);
        bot.sendMessage(chatId, '❌ Eroare');
    }
});

bot.onText(/\/week/, (msg) => {
    const chatId = msg.chat.id;

    const currentWeek = getCurrentWeekNumber();
    const weekType = currentWeek % 2 === 1 ? 'SI (Impară)' : 'SP (Pară)';
    const nextWeek = currentWeek + 1;
    const nextWeekType = nextWeek % 2 === 1 ? 'SI (Impară)' : 'SP (Pară)';
    const weeksRemaining = 14 - currentWeek;

    const text = `
📆 INFO SĂPTĂMÂNĂ:

Săptămâna curentă: ${currentWeek}
Tip: ${weekType}

Săptămâna viitoare: ${nextWeek}
Tip: ${nextWeekType}

Săptămâni rămase: ${weeksRemaining}

💡 Folosește:
/saptamana - vezi orarul acestei săptămâni
/viitor - vezi orarul săptămânii viitoare
    `;

    bot.sendMessage(chatId, text);
});

bot.onText(/\/ajutor/, (msg) => {
    const chatId = msg.chat.id;

    const text = `
📖 Comenzi Disponibile:

📊 STATUS & ORAR:
/status - Status prezențe (câte ai, câte mai trebuie)
/orar - Orarul de ASTĂZI
/maine - Orarul de MÂINE
/saptamana - Orarul SĂPTĂMÂNII CURENTE
/viitor - Orarul SĂPTĂMÂNII VIITOARE
/week - Info despre săptămână (număr, tip SI/SP)

🎯 OBLIGATORII:
/obligatoriu - Ce ore TREBUIE să mergi săptămâna aceasta

🔔 NOTIFICĂRI AUTOMATE:
Primești notificări cu 1h înainte de TOATE orele din orar.
Mesajele arată clar prioritatea (OBLIGATORIU/Opțional).

📊 DASHBOARD WEB:
http://localhost:3000
- Vezi recomandări detaliate
- Editează orar (inclusiv ore CUSTOM!)
- Marchează prezențe

💡 TIPS:
- Materii săptămânale (E, TS, ME) = obligatoriu în fiecare săptămână
- Materii la 2 săptămâni (CF, MN) = poți amâna pe săptămâna viitoare
- Ore CUSTOM = tratate ca toate celelalte (obligatorii, cu prezențe)
    `;

    bot.sendMessage(chatId, text);
});

// Helper: Get current week number
function getCurrentWeekNumber() {
    const startDate = new Date('2025-09-29');
    const today = new Date();
    const diff = today - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return Math.floor(days / 7) + 1;
}

// Helper: Get day name in format used by schedule
// NOTE: Check personal_schedule.json for the exact format user is using
function getDayName(date) {
    const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayNames = {
        0: 'DUMINICA',
        1: 'LUNI',
        2: 'MARTI',    // Without diacritics - matches setup-schedule.html
        3: 'MIERCURI',
        4: 'JOI',
        5: 'VINERI',
        6: 'SAMBATA'
    };
    return dayNames[dayIndex] || '';
}

// Notification system
function startNotifications() {
    console.log('🔔 Notification system started');

    // Run every hour at minute 0
    cron.schedule('0 * * * *', () => {
        try {
            const now = new Date();
            const { schedule } = loadData();
            const recommendations = getRecommendations();

            if (!schedule || !recommendations) return;

            const today = getDayName(now);
            const currentWeek = getCurrentWeekNumber();
            const weekType = currentWeek % 2 === 1 ? 'SI' : 'SP';

            // Check each class
            Object.entries(schedule).forEach(([key, subject]) => {
                const rec = recommendations[subject.name];

                subject.classes.forEach(cls => {
                    // Only notify for classes today
                    if (cls.day !== today) return;

                    // Check if available this week
                    if (cls.week_type && cls.week_type !== weekType) return;

                    // Parse time
                    const [hour, minute] = cls.time_start.split(':').map(Number);
                    const classTime = new Date();
                    classTime.setHours(hour, minute, 0);

                    // Check if 1 hour before
                    const timeDiff = classTime - now;
                    const hoursDiff = timeDiff / (1000 * 60 * 60);

                    if (hoursDiff >= 0.9 && hoursDiff <= 1.1) {
                        // Determine if obligatory (but send for ALL classes)
                        const isObligatory = rec && rec.remaining > 0;
                        const urgency = rec && rec.status === 'needed' ? '🚨 CRITIC' : rec && rec.status === 'warning' ? '⚠️ URGENT' : '✅';

                        let priorityLabel = 'Opțional';
                        if (rec && rec.remaining > 0) {
                            if (rec.status === 'needed') priorityLabel = 'OBLIGATORIU - CRITIC';
                            else if (rec.status === 'warning') priorityLabel = 'OBLIGATORIU - URGENT';
                            else priorityLabel = 'OBLIGATORIU';
                        }

                        const message = `
${urgency} ${priorityLabel}

📖 ${subject.name}
🕐 Începe peste 1h la ${cls.time_start}
📍 ${cls.room}

${rec ? `Status: ${rec.attended}/${rec.required} | Rămân: ${rec.remaining}` : 'Oră din orarul tău'}

Dashboard: http://localhost:3000
                        `;

                        // Send to all users (FOR ALL HOURS, not just obligatory)
                        userIds.forEach(userId => {
                            bot.sendMessage(userId, message.trim()).catch(err => {
                                console.error(`Error sending to ${userId}:`, err.message);
                            });
                        });

                        console.log(`📬 Sent notification for ${subject.name} at ${cls.time_start} (${priorityLabel})`);
                    }
                });
            });
        } catch (err) {
            console.error('Error in notifications:', err);
        }
    });
}

// Start notifications after 2 seconds
setTimeout(startNotifications, 2000);

module.exports = { bot, startNotifications };
