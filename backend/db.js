const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/orar.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

// Initialize database tables
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Classes table
      db.run(`CREATE TABLE IF NOT EXISTS classes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        day TEXT NOT NULL,
        time_start TEXT NOT NULL,
        time_end TEXT NOT NULL,
        room TEXT,
        frequency TEXT NOT NULL,
        week_type TEXT,
        required BOOLEAN DEFAULT true,
        description TEXT
      )`, (err) => {
        if (err) console.error('Error creating classes table:', err);
      });

      // Attendance table
      db.run(`CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        class_id TEXT NOT NULL,
        date DATE NOT NULL,
        status TEXT DEFAULT 'present',
        notes TEXT,
        FOREIGN KEY(class_id) REFERENCES classes(id)
      )`, (err) => {
        if (err) console.error('Error creating attendance table:', err);
      });

      // Settings table
      db.run(`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )`, (err) => {
        if (err) console.error('Error creating settings table:', err);
      });

      // Postponement history table
      db.run(`CREATE TABLE IF NOT EXISTS postponements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        class_id TEXT NOT NULL,
        original_date DATE NOT NULL,
        new_date DATE,
        reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(class_id) REFERENCES classes(id)
      )`, (err) => {
        if (err) console.error('Error creating postponements table:', err);
        else resolve();
      });
    });
  });
}

// Insert class into database
function insertClass(classData) {
  return new Promise((resolve, reject) => {
    const { id, name, type, day, time_start, time_end, room, frequency, week_type, required, description } = classData;
    db.run(
      `INSERT OR REPLACE INTO classes (id, name, type, day, time_start, time_end, room, frequency, week_type, required, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, type, day, time_start, time_end, room, frequency, week_type, required, description],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// Get all classes
function getAllClasses() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM classes ORDER BY day, time_start`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

// Record attendance
function recordAttendance(classId, date, status = 'present', notes = '') {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO attendance (class_id, date, status, notes) VALUES (?, ?, ?, ?)`,
      [classId, date, status, notes],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

// Get attendance for a class
function getClassAttendance(classId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM attendance WHERE class_id = ? ORDER BY date`,
      [classId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

// Get setting
function getSetting(key) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT value FROM settings WHERE key = ?`,
      [key],
      (err, row) => {
        if (err) reject(err);
        else resolve(row ? row.value : null);
      }
    );
  });
}

// Set setting
function setSetting(key, value) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
      [key, value],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// Get current week number
function getCurrentWeekNumber(startDate = '2025-09-29') {
  const start = new Date(startDate);
  const today = new Date();
  const diff = today - start;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(days / 7) + 1;
  return weekNumber;
}

// Check if week is SI (odd) or SP (even)
function getWeekType(weekNumber) {
  return weekNumber % 2 === 1 ? 'SI' : 'SP';
}

// Get required classes for this week
async function getRequiredClassesForWeek(weekNumber) {
  const weekType = getWeekType(weekNumber);
  const classes = await getAllClasses();

  const required = classes.filter(cls => {
    if (cls.frequency === 'weekly') {
      return true;
    } else if (cls.frequency === 'biweekly') {
      // For biweekly classes, check if this is the right week
      if (cls.week_type === weekType) {
        return true;
      }
    }
    return false;
  });

  return required;
}

// Add postponement
function addPostponement(classId, originalDate, newDate, reason = '') {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO postponements (class_id, original_date, new_date, reason) VALUES (?, ?, ?, ?)`,
      [classId, originalDate, newDate, reason],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

module.exports = {
  db,
  initializeDatabase,
  insertClass,
  getAllClasses,
  recordAttendance,
  getClassAttendance,
  getSetting,
  setSetting,
  getCurrentWeekNumber,
  getWeekType,
  getRequiredClassesForWeek,
  addPostponement
};
