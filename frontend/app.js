// API Base URL
const API_URL = '/api';

// State
let allClasses = [];
let selectedClasses = new Set();
let weekInfo = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadWeekInfo();
    await loadClasses();
    await loadStatus();
    await loadRequiredClasses();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchTab(tabName);
        });
    });

    // Save button
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveAttendance);
    }

    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            selectedClasses.clear();
            renderClasses();
        });
    }
}

// Switch between tabs
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active from buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Load week information
async function loadWeekInfo() {
    try {
        const response = await fetch(`${API_URL}/week-info`);
        weekInfo = await response.json();

        const weekTypeText = weekInfo.isOddWeek ? 'SĂPTĂMÂNĂ IMPARĂ (SI)' : 'SĂPTĂMÂNĂ PARĂ (SP)';
        document.getElementById('weekNumber').textContent = `Săptămâna ${weekInfo.currentWeek}`;
        document.getElementById('weekType').textContent = weekTypeText;
    } catch (err) {
        console.error('Error loading week info:', err);
    }
}

// Load all classes
async function loadClasses() {
    try {
        const response = await fetch(`${API_URL}/classes`);
        allClasses = await response.json();
        renderClasses();
    } catch (err) {
        console.error('Error loading classes:', err);
        document.getElementById('classesGrid').innerHTML = '<div class="empty-state"><h3>Eroare la încărcarea datelor</h3></div>';
    }
}

// Render classes
function renderClasses() {
    const grid = document.getElementById('classesGrid');

    if (allClasses.length === 0) {
        grid.innerHTML = '<div class="empty-state"><h3>Nu sunt date disponibile</h3></div>';
        return;
    }

    // Group by name
    const grouped = {};
    allClasses.forEach(cls => {
        if (!grouped[cls.name]) {
            grouped[cls.name] = [];
        }
        grouped[cls.name].push(cls);
    });

    let html = '';
    Object.entries(grouped).forEach(([name, classes]) => {
        classes.forEach((cls, idx) => {
            const isChecked = selectedClasses.has(cls.id);
            const frequencyLabel = cls.frequency === 'weekly' ? 'o dată/săptămână' : 'o dată/2 săptămâni';
            const weekTypeLabel = cls.week_type ? ` (${cls.week_type})` : '';

            html += `
                <div class="class-card">
                    <div class="class-header">
                        <input type="checkbox" class="class-checkbox"
                               data-class-id="${cls.id}"
                               ${isChecked ? 'checked' : ''}
                               onchange="toggleClass('${cls.id}')">
                        <div>
                            <div class="class-title">${cls.name}</div>
                            <div class="class-details">
                                <div class="detail-item">
                                    <strong>📍</strong> ${cls.room || 'Online'}
                                </div>
                                <div class="detail-item">
                                    <strong>🕐</strong> ${cls.time_start} - ${cls.time_end}
                                </div>
                                <div class="detail-item">
                                    <strong>📅</strong> ${cls.day}
                                </div>
                                <div class="detail-item">
                                    <strong>🔄</strong> <span class="class-frequency">${frequencyLabel}${weekTypeLabel}</span>
                                </div>
                            </div>
                        </div>
                        <div class="class-type">${cls.type}</div>
                    </div>
                </div>
            `;
        });
    });

    grid.innerHTML = html;
}

// Toggle class selection
function toggleClass(classId) {
    if (selectedClasses.has(classId)) {
        selectedClasses.delete(classId);
    } else {
        selectedClasses.add(classId);
    }
}

// Save attendance
async function saveAttendance() {
    try {
        const today = new Date().toISOString().split('T')[0];

        for (const classId of selectedClasses) {
            await fetch(`${API_URL}/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    classId,
                    date: today,
                    status: 'present',
                    notes: 'Initial setup'
                })
            });
        }

        alert('✅ Prezențe salvate cu succes! Bot-ul Telegram va fi notificat.');
        selectedClasses.clear();
        renderClasses();
        await loadStatus();
    } catch (err) {
        console.error('Error saving attendance:', err);
        alert('❌ Eroare la salvare. Încearcă din nou.');
    }
}

// Load and display attendance status
async function loadStatus() {
    try {
        const response = await fetch(`${API_URL}/attendance-status`);
        const status = await response.json();

        const container = document.getElementById('statusContainer');
        let html = '';

        const classNames = Object.values(status)
            .map(item => item.class.name)
            .filter((val, idx, arr) => arr.indexOf(val) === idx)
            .sort();

        if (classNames.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>Nu sunt date de prezență</h3><p>Configurează-ți prezențele mai întâi</p></div>';
            return;
        }

        classNames.forEach(name => {
            const classItems = Object.values(status).filter(item => item.class.name === name);
            const totalAttendance = classItems.reduce((sum, item) => sum + item.attendanceCount, 0);

            // Determine required attendance count
            let requiredCount = 7; // Default for biweekly (1 per 2 weeks = 7 for 14 weeks)
            const exampleClass = classItems[0].class;
            if (exampleClass.frequency === 'weekly') {
                requiredCount = 14; // All weeks
            }

            const percentage = Math.round((totalAttendance / requiredCount) * 100);
            let badgeClass = 'status-badge';
            if (percentage < 30) badgeClass += ' critical';
            else if (percentage < 70) badgeClass += ' low';

            html += `
                <div class="status-item">
                    <div class="status-header">
                        <div>
                            <div class="status-title">${name}</div>
                            <div style="font-size: 12px; color: #666; margin-top: 4px;">
                                ${exampleClass.frequency === 'weekly' ? 'Obligatoriu săptămânal' : 'Obligatoriu o dată la 2 săptămâni'}
                            </div>
                        </div>
                        <div class="${badgeClass}">${totalAttendance}/${requiredCount}</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                    <div style="font-size: 12px; color: #666; margin-top: 8px; text-align: right;">
                        ${percentage}% completat
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    } catch (err) {
        console.error('Error loading status:', err);
        document.getElementById('statusContainer').innerHTML = '<div class="empty-state"><h3>Eroare la încărcarea datelor</h3></div>';
    }
}

// Load required classes for current week
async function loadRequiredClasses() {
    try {
        const response = await fetch(`${API_URL}/required-classes`);
        const data = await response.json();

        const container = document.getElementById('requiredContainer');
        let html = '';

        if (data.classes.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>Nu sunt ore obligatorii în această săptămână</h3></div>';
            return;
        }

        // Group by name
        const grouped = {};
        data.classes.forEach(cls => {
            if (!grouped[cls.name]) {
                grouped[cls.name] = [];
            }
            grouped[cls.name].push(cls);
        });

        Object.entries(grouped).forEach(([name, classes]) => {
            classes.forEach(cls => {
                const weekLabel = cls.week_type ? ` - ${cls.week_type}` : '';
                html += `
                    <div class="required-item">
                        <div class="required-class">✅ ${name}${weekLabel}</div>
                        <div class="required-details">
                            <span>📍 ${cls.room || 'Online'}</span>
                            <span>🕐 ${cls.time_start} - ${cls.time_end}</span>
                            <span>📅 ${cls.day}</span>
                            <span>🏷️ ${cls.type}</span>
                        </div>
                    </div>
                `;
            });
        });

        container.innerHTML = html;
    } catch (err) {
        console.error('Error loading required classes:', err);
        document.getElementById('requiredContainer').innerHTML = '<div class="empty-state"><h3>Eroare la încărcarea datelor</h3></div>';
    }
}
