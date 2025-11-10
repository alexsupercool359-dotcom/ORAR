const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase, insertClass, getAllClasses, recordAttendance, getClassAttendance, getSetting, setSetting, getCurrentWeekNumber, getWeekType, getRequiredClassesForWeek } = require('./db');
const schedule = require('../data/schedule.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/data', express.static(path.join(__dirname, '../data')));

// Initialize database and load schedule on startup
async function startup() {
  try {
    await initializeDatabase();
    console.log('Database initialized');

    // Load schedule into database
    for (const cls of schedule.classes) {
      await insertClass(cls);
    }
    console.log('Schedule loaded into database');

    // Set initial settings if not present
    const startDate = await getSetting('START_DATE');
    if (!startDate) {
      await setSetting('START_DATE', schedule.metadata.start_date);
    }

    const currentWeek = await getSetting('CURRENT_WEEK');
    if (!currentWeek) {
      const weekNum = getCurrentWeekNumber(schedule.metadata.start_date);
      await setSetting('CURRENT_WEEK', weekNum.toString());
    }
  } catch (err) {
    console.error('Startup error:', err);
  }
}

// Routes

// Get all classes
app.get('/api/classes', async (req, res) => {
  try {
    const classes = await getAllClasses();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get class details with attendance
app.get('/api/classes/:id', async (req, res) => {
  try {
    const classes = await getAllClasses();
    const classData = classes.find(c => c.id === req.params.id);

    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const attendance = await getClassAttendance(req.params.id);
    res.json({ ...classData, attendance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record attendance
app.post('/api/attendance', async (req, res) => {
  try {
    const { classId, date, status, notes } = req.body;

    if (!classId || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const attendanceId = await recordAttendance(classId, date, status || 'present', notes || '');
    res.json({ id: attendanceId, message: 'Attendance recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current week info
app.get('/api/week-info', async (req, res) => {
  try {
    const startDate = await getSetting('START_DATE') || schedule.metadata.start_date;
    const currentWeek = getCurrentWeekNumber(startDate);
    const weekType = getWeekType(currentWeek);

    res.json({
      currentWeek,
      weekType,
      startDate,
      isOddWeek: weekType === 'SI',
      isEvenWeek: weekType === 'SP'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get required classes for current week
app.get('/api/required-classes', async (req, res) => {
  try {
    const startDate = await getSetting('START_DATE') || schedule.metadata.start_date;
    const currentWeek = getCurrentWeekNumber(startDate);
    const required = await getRequiredClassesForWeek(currentWeek);

    res.json({
      week: currentWeek,
      weekType: getWeekType(currentWeek),
      classes: required
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get attendance status
app.get('/api/attendance-status', async (req, res) => {
  try {
    const classes = await getAllClasses();
    const status = {};

    for (const cls of classes) {
      const attendance = await getClassAttendance(cls.id);
      status[cls.id] = {
        class: cls,
        attendanceCount: attendance.filter(a => a.status === 'present').length,
        totalAttendance: attendance
      };
    }

    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk attendance save (for weeks 1-7 configuration)
app.post('/api/attendance/bulk', async (req, res) => {
  try {
    const { attendance } = req.body;
    const fs = require('fs');
    const attendanceFile = path.join(__dirname, '../data/attendance_history.json');

    // Save attendance to file
    fs.writeFileSync(attendanceFile, JSON.stringify(attendance, null, 2));

    res.json({ message: 'Attendance saved successfully', count: Object.keys(attendance).length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save personal schedule
app.post('/api/schedule/personal', async (req, res) => {
  try {
    const schedule = req.body;
    const fs = require('fs');
    const scheduleFile = path.join(__dirname, '../data/personal_schedule.json');

    // Save to file
    fs.writeFileSync(scheduleFile, JSON.stringify(schedule, null, 2));

    res.json({ message: 'Schedule saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get personal schedule
app.get('/api/schedule/personal', async (req, res) => {
  try {
    const fs = require('fs');
    const scheduleFile = path.join(__dirname, '../data/personal_schedule.json');

    if (!fs.existsSync(scheduleFile)) {
      return res.status(404).json({ error: 'No personal schedule found' });
    }

    const schedule = JSON.parse(fs.readFileSync(scheduleFile, 'utf8'));
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save attendance grid
app.post('/api/attendance/grid', async (req, res) => {
  try {
    const { attendance } = req.body;
    const fs = require('fs');
    const attendanceFile = path.join(__dirname, '../data/attendance_grid.json');

    // Save to file
    fs.writeFileSync(attendanceFile, JSON.stringify(attendance, null, 2));

    res.json({ message: 'Attendance saved successfully', count: Object.keys(attendance).length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get recommendations for future weeks
app.get('/api/recommendations', async (req, res) => {
  try {
    const fs = require('fs');
    const attendanceFile = path.join(__dirname, '../data/attendance_grid.json');
    const scheduleFile = path.join(__dirname, '../data/personal_schedule.json');

    // Check if files exist
    if (!fs.existsSync(scheduleFile)) {
      return res.status(404).json({ error: 'No personal schedule found. Create your schedule first.' });
    }

    if (!fs.existsSync(attendanceFile)) {
      return res.status(404).json({ error: 'No attendance data found. Mark your attendance first.' });
    }

    // Load attendance history
    const attendance = JSON.parse(fs.readFileSync(attendanceFile, 'utf8'));

    // Load personal schedule
    const personalSchedule = JSON.parse(fs.readFileSync(scheduleFile, 'utf8'));

    // Calculate statistics per subject
    const recommendations = {};

    for (const [key, subject] of Object.entries(personalSchedule)) {
      if (subject.classes.length === 0) continue;

      // Count attendance for this subject
      const subjectAttendance = Object.keys(attendance).filter(cellId => {
        return attendance[cellId].subject === key && attendance[cellId].checked;
      }).length;

      // Calculate required count
      const requiredCount = subject.frequency === 'weekly' ? 14 : 7;
      const remaining = requiredCount - subjectAttendance;

      recommendations[subject.name] = {
        acronym: subject.acronym,
        frequency: subject.frequency,
        required: requiredCount,
        attended: subjectAttendance,
        remaining: remaining,
        status: remaining <= 0 ? 'complete' : remaining <= 3 ? 'warning' : 'needed',
        weeksRemaining: 7, // 7 weeks remaining (8-14)
        classes: subject.classes
      };
    }

    res.json({
      currentWeek: 7,
      weeksRemaining: 7,
      recommendations
    });
  } catch (err) {
    console.error('Error in recommendations:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  startup();
});

module.exports = app;
