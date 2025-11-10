require('dotenv').config();

// Start the server
require('./server');

// Start the Telegram bot
const { bot, startNotifications } = require('./bot');

console.log('Application started successfully');
console.log('Web server: http://localhost:3000');
console.log('Telegram bot token loaded from environment');
