// Global state
let pageFlip;
let currentDate = new Date();
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let currentWeek = getWeekNumber(new Date());

// Data keys for localStorage
const DATA_KEYS = {
    DAILY: 'farhadPlanner_daily',
    HABITS: 'farhadPlanner_habits',
    TRAIN: 'farhadPlanner_train',
    ANNUAL: 'farhadPlanner_annual',
    PRIORITY: 'farhadPlanner_priority',
    FROGS: 'farhadPlanner_frogs',
    ELEPHANTS: 'farhadPlanner_elephants',
    PLANS: 'farhadPlanner_plans'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initPageFlip();
    initDateHandlers();
    initDailyPlanner();
    initHabitTracker();
    initTrainPrinciple();
    initAnnualPlan();
    initPriorityMatrix();
    initFrogs();
    initElephants();
    initPlans();
    
    // Load data from localStorage
    loadAllData();
    
    console.log('Farhad Planner initialized');
});

// Page flip initialization
function initPageFlip() {
    const bookElement = document.getElementById('book');
    
    pageFlip = new St.PageFlip(bookElement, {
        width: bookElement.offsetWidth,
        height: bookElement.offsetHeight,
        size: "stretch",
        minWidth: 320,
        maxWidth: 1200,
        minHeight: 400,
        maxHeight: 1000,
        showCover: false,
        mobileScrollSupport: false,
        clickEventForward: true,
        usePortrait: false,
        startPage: 0,
        drawShadow: true,
        flippingTime: 800,
        useMouseEvents: true,
        autoSize: true,
        maxShadowOpacity: 0.5,
        showPageCorners: true,
        disableFlipByClick: false
    });

    // Page flip event handlers
    pageFlip.on('flip', (e) => {
        updatePageIndicator(e.data + 1);
    });

    // Navigation buttons
    document.getElementById('prevBtn').addEventListener('click', () => {
        pageFlip.flipPrev();
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        pageFlip.flipNext();
    });

    // Update page indicator
    document.getElementById('totalPages').textContent = '10';
    updatePageIndicator(1);
}

function updatePageIndicator(pageNum) {
    document.getElementById('currentPage').textContent = pageNum;
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = pageNum === 1;
    nextBtn.disabled = pageNum === 10;
}

// Utility functions
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function parseDate(dateString) {
    return new Date(dateString + 'T00:00:00');
}

function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}

function getWeekRange(year, week) {
    const jan1 = new Date(year, 0, 1);
    const days = (week - 1) * 7;
    const startDate = new Date(jan1.getTime() + days * 24 * 60 * 60 * 1000);
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Monday
    const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000); // Sunday
    return { start: startDate, end: endDate };
}

// Data persistence
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
}

function loadAllData() {
    // Load and apply all saved data
    const dailyData = loadData(DATA_KEYS.DAILY);
    const habitsData = loadData(DATA_KEYS.HABITS);
    const trainData = loadData(DATA_KEYS.TRAIN);
    const annualData = loadData(DATA_KEYS.ANNUAL);
    const priorityData = loadData(DATA_KEYS.PRIORITY);
    const frogsData = loadData(DATA_KEYS.FROGS);
    const elephantsData = loadData(DATA_KEYS.ELEPHANTS);
    const plansData = loadData(DATA_KEYS.PLANS);

    // Apply data to respective components
    if (Object.keys(dailyData).length > 0) applyDailyData(dailyData);
    if (Object.keys(habitsData).length > 0) applyHabitsData(habitsData);
    if (Object.keys(trainData).length > 0) applyTrainData(trainData);
    if (Object.keys(annualData).length > 0) applyAnnualData(annualData);
    if (Object.keys(priorityData).length > 0) applyPriorityData(priorityData);
    if (Object.keys(frogsData).length > 0) applyFrogsData(frogsData);
    if (Object.keys(elephantsData).length > 0) applyElephantsData(elephantsData);
    if (Object.keys(plansData).length > 0) applyPlansData(plansData);
}

// Date handlers initialization
function initDateHandlers() {
    // Set current date
    document.getElementById('currentDate').value = formatDate(currentDate);
    document.getElementById('trainDate').value = formatDate(currentDate);
    
    // Daily planner date navigation
    document.getElementById('prevDay').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        document.getElementById('currentDate').value = formatDate(currentDate);
        loadDailyData(formatDate(currentDate));
    });

    document.getElementById('nextDay').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        document.getElementById('currentDate').value = formatDate(currentDate);
        loadDailyData(formatDate(currentDate));
    });

    document.getElementById('today').addEventListener('click', () => {
        currentDate = new Date();
        document.getElementById('currentDate').value = formatDate(currentDate);
        loadDailyData(formatDate(currentDate));
    });

    document.getElementById('currentDate').addEventListener('change', (e) => {
        currentDate = parseDate(e.target.value);
        loadDailyData(e.target.value);
    });

    // Train principle date navigation
    document.getElementById('trainPrevDay').addEventListener('click', () => {
        const trainDate = parseDate(document.getElementById('trainDate').value);
        trainDate.setDate(trainDate.getDate() - 1);
        document.getElementById('trainDate').value = formatDate(trainDate);
        loadTrainData(formatDate(trainDate));
    });

    document.getElementById('trainNextDay').addEventListener('click', () => {
        const trainDate = parseDate(document.getElementById('trainDate').value);
        trainDate.setDate(trainDate.getDate() + 1);
        document.getElementById('trainDate').value = formatDate(trainDate);
        loadTrainData(formatDate(trainDate));
    });

    document.getElementById('trainToday').addEventListener('click', () => {
        document.getElementById('trainDate').value = formatDate(new Date());
        loadTrainData(formatDate(new Date()));
    });

    document.getElementById('trainDate').addEventListener('change', (e) => {
        loadTrainData(e.target.value);
    });
}

// Daily Planner
function initDailyPlanner() {
    // Initialize urgent tasks (5 tasks)
    const urgentContainer = document.getElementById('urgentTasks');
    for (let i = 0; i < 5; i++) {
        const taskDiv = createTaskItem(`urgent_${i}`, '');
        urgentContainer.appendChild(taskDiv);
    }

    // Initialize hourly plans (6:00-22:00)
    const hourlyContainer = document.getElementById('hourlyPlans');
    for (let hour = 6; hour <= 22; hour++) {
        const hourDiv = document.createElement('div');
        hourDiv.className = 'hour-slot';
        
        const label = document.createElement('div');
        label.className = 'hour-label';
        label.textContent = `${hour}:00`;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'hour-input';
        input.id = `hour_${hour}`;
        input.placeholder = 'План на час...';
        input.addEventListener('change', saveDailyData);
        
        hourDiv.appendChild(label);
        hourDiv.appendChild(input);
        hourlyContainer.appendChild(hourDiv);
    }

    // Initialize flexible plans
    document.getElementById('addFlexiblePlan').addEventListener('click', addFlexiblePlan);

    // Initialize time tracking
    document.getElementById('addTimeEntry').addEventListener('click', addTimeEntry);

    // Initialize rating slider
    const ratingSlider = document.getElementById('dayRating');
    const ratingValue = document.getElementById('ratingValue');
    
    ratingSlider.addEventListener('input', (e) => {
        ratingValue.textContent = e.target.value;
        saveDailyData();
    });

    // Add event listeners for all text areas and checkboxes
    const dailyFields = [
        'affirmation', 'physicalArea', 'books', 'audio', 'video', 
        'goals', 'principles', 'successDiary', 'awareness', 
        'timeWasters', 'mistakes', 'solutions', 'ideas'
    ];
    
    dailyFields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.addEventListener('change', saveDailyData);
            element.addEventListener('blur', saveDailyData);
        }
    });

    // Load today's data
    loadDailyData(formatDate(currentDate));
}

function createTaskItem(id, text = '', checked = false) {
    const div = document.createElement('div');
    div.className = 'task-item';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.checked = checked;
    checkbox.addEventListener('change', saveDailyData);
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = text;
    input.placeholder = 'Добавить задачу...';
    input.addEventListener('change', saveDailyData);
    input.addEventListener('blur', saveDailyData);
    
    div.appendChild(checkbox);
    div.appendChild(input);
    
    return div;
}

function addFlexiblePlan() {
    const container = document.getElementById('flexiblePlans');
    const flexiblePlans = container.querySelectorAll('.flexible-task');
    const newId = `flexible_${flexiblePlans.length}`;
    
    const taskDiv = document.createElement('div');
    taskDiv.className = 'flexible-task';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', saveDailyData);
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Гибкая задача...';
    input.addEventListener('change', saveDailyData);
    input.addEventListener('blur', saveDailyData);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => {
        taskDiv.remove();
        saveDailyData();
    });
    
    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(input);
    taskDiv.appendChild(deleteBtn);
    
    container.insertBefore(taskDiv, document.getElementById('addFlexiblePlan'));
    saveDailyData();
}

function addTimeEntry() {
    const container = document.getElementById('timeTracking');
    
    const entryDiv = document.createElement('div');
    entryDiv.className = 'time-entry';
    
    const startInput = document.createElement('input');
    startInput.type = 'time';
    startInput.placeholder = 'Начало';
    startInput.addEventListener('change', saveDailyData);
    
    const endInput = document.createElement('input');
    endInput.type = 'time';
    endInput.placeholder = 'Окончание';
    endInput.addEventListener('change', saveDailyData);
    
    const activityInput = document.createElement('input');
    activityInput.type = 'text';
    activityInput.placeholder = 'Вид работы';
    activityInput.style.minWidth = '150px';
    activityInput.addEventListener('change', saveDailyData);
    activityInput.addEventListener('blur', saveDailyData);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => {
        entryDiv.remove();
        saveDailyData();
    });
    
    entryDiv.appendChild(startInput);
    entryDiv.appendChild(endInput);
    entryDiv.appendChild(activityInput);
    entryDiv.appendChild(deleteBtn);
    
    container.insertBefore(entryDiv, document.getElementById('addTimeEntry'));
    saveDailyData();
}

function saveDailyData() {
    const dateKey = document.getElementById('currentDate').value;
    const data = loadData(DATA_KEYS.DAILY);
    
    if (!data[dateKey]) data[dateKey] = {};
    
    // Save urgent tasks
    const urgentTasks = [];
    for (let i = 0; i < 5; i++) {
        const checkbox = document.getElementById(`urgent_${i}`);
        const input = checkbox.nextElementSibling;
        urgentTasks.push({
            text: input.value,
            completed: checkbox.checked
        });
    }
    data[dateKey].urgentTasks = urgentTasks;
    
    // Save hourly plans
    const hourlyPlans = {};
    for (let hour = 6; hour <= 22; hour++) {
        const input = document.getElementById(`hour_${hour}`);
        if (input) hourlyPlans[hour] = input.value;
    }
    data[dateKey].hourlyPlans = hourlyPlans;
    
    // Save flexible plans
    const flexiblePlans = [];
    document.querySelectorAll('.flexible-task').forEach(task => {
        const checkbox = task.querySelector('input[type="checkbox"]');
        const input = task.querySelector('input[type="text"]');
        if (input && input.value.trim()) {
            flexiblePlans.push({
                text: input.value,
                completed: checkbox.checked
            });
        }
    });
    data[dateKey].flexiblePlans = flexiblePlans;
    
    // Save time tracking
    const timeEntries = [];
    document.querySelectorAll('.time-entry').forEach(entry => {
        const inputs = entry.querySelectorAll('input');
        if (inputs.length >= 3) {
            timeEntries.push({
                start: inputs[0].value,
                end: inputs[1].value,
                activity: inputs[2].value
            });
        }
    });
    data[dateKey].timeTracking = timeEntries;
    
    // Save all other fields
    const fields = [
        'dayRating', 'books', 'audio', 'video', 'affirmation', 
        'physicalArea', 'goals', 'principles', 'successDiary', 
        'awareness', 'timeWasters', 'mistakes', 'solutions', 'ideas'
    ];
    
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            if (element.type === 'checkbox') {
                data[dateKey][field] = element.checked;
            } else {
                data[dateKey][field] = element.value;
            }
        }
    });
    
    saveData(DATA_KEYS.DAILY, data);
}

function loadDailyData(dateKey) {
    const data = loadData(DATA_KEYS.DAILY);
    const dayData = data[dateKey] || {};
    
    // Load urgent tasks
    if (dayData.urgentTasks) {
        dayData.urgentTasks.forEach((task, i) => {
            const checkbox = document.getElementById(`urgent_${i}`);
            const input = checkbox?.nextElementSibling;
            if (checkbox && input) {
                checkbox.checked = task.completed;
                input.value = task.text;
            }
        });
    }
    
    // Load hourly plans
    if (dayData.hourlyPlans) {
        Object.entries(dayData.hourlyPlans).forEach(([hour, plan]) => {
            const input = document.getElementById(`hour_${hour}`);
            if (input) input.value = plan;
        });
    }
    
    // Load flexible plans
    const flexibleContainer = document.getElementById('flexiblePlans');
    const existingFlexible = flexibleContainer.querySelectorAll('.flexible-task');
    existingFlexible.forEach(task => task.remove());
    
    if (dayData.flexiblePlans) {
        dayData.flexiblePlans.forEach(plan => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'flexible-task';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = plan.completed;
            checkbox.addEventListener('change', saveDailyData);
            
            const input = document.createElement('input');
            input.type = 'text';
            input.value = plan.text;
            input.addEventListener('change', saveDailyData);
            input.addEventListener('blur', saveDailyData);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '×';
            deleteBtn.addEventListener('click', () => {
                taskDiv.remove();
                saveDailyData();
            });
            
            taskDiv.appendChild(checkbox);
            taskDiv.appendChild(input);
            taskDiv.appendChild(deleteBtn);
            
            flexibleContainer.insertBefore(taskDiv, document.getElementById('addFlexiblePlan'));
        });
    }
    
    // Load time tracking
    const timeContainer = document.getElementById('timeTracking');
    const existingEntries = timeContainer.querySelectorAll('.time-entry');
    existingEntries.forEach(entry => entry.remove());
    
    if (dayData.timeTracking) {
        dayData.timeTracking.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'time-entry';
            
            const startInput = document.createElement('input');
            startInput.type = 'time';
            startInput.value = entry.start;
            startInput.addEventListener('change', saveDailyData);
            
            const endInput = document.createElement('input');
            endInput.type = 'time';
            endInput.value = entry.end;
            endInput.addEventListener('change', saveDailyData);
            
            const activityInput = document.createElement('input');
            activityInput.type = 'text';
            activityInput.value = entry.activity;
            activityInput.style.minWidth = '150px';
            activityInput.addEventListener('change', saveDailyData);
            activityInput.addEventListener('blur', saveDailyData);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '×';
            deleteBtn.addEventListener('click', () => {
                entryDiv.remove();
                saveDailyData();
            });
            
            entryDiv.appendChild(startInput);
            entryDiv.appendChild(endInput);
            entryDiv.appendChild(activityInput);
            entryDiv.appendChild(deleteBtn);
            
            timeContainer.insertBefore(entryDiv, document.getElementById('addTimeEntry'));
        });
    }
    
    // Load all other fields
    const fields = [
        'dayRating', 'books', 'audio', 'video', 'affirmation', 
        'physicalArea', 'goals', 'principles', 'successDiary', 
        'awareness', 'timeWasters', 'mistakes', 'solutions', 'ideas'
    ];
    
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element && dayData[field] !== undefined) {
            if (element.type === 'checkbox') {
                element.checked = dayData[field];
            } else {
                element.value = dayData[field];
                if (field === 'dayRating') {
                    document.getElementById('ratingValue').textContent = dayData[field];
                }
            }
        }
    });
}

function applyDailyData(data) {
    loadDailyData(formatDate(currentDate));
}

// Continue with other sections...
// [Rest of the JavaScript functions for Habit Tracker, Train Principle, etc.]

// Habit Tracker
function initHabitTracker() {
    const directions = [
        'Физическая область',
        'Семья', 
        'Работа/Бизнес',
        'Самообразование/Духовность'
    ];
    
    // Initialize month selects for all 3 habit tracker pages
    for (let page = 1; page <= 3; page++) {
        initMonthSelect(page);
        initHabitTable(page, directions);
    }
}

function initMonthSelect(pageNum) {
    const monthSelect = document.getElementById(`monthSelect${pageNum}`);
    const yearSelect = document.getElementById(`yearSelect${pageNum}`);
    
    // Populate months
    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    
    monthSelect.innerHTML = '';
    months.forEach((month, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = month;
        if (i === currentMonth) option.selected = true;
        monthSelect.appendChild(option);
    });
    
    // Populate years
    yearSelect.innerHTML = '';
    for (let year = currentYear - 2; year <= currentYear + 2; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) option.selected = true;
        yearSelect.appendChild(option);
    }
    
    // Event listeners
    monthSelect.addEventListener('change', () => updateHabitTable(pageNum));
    yearSelect.addEventListener('change', () => updateHabitTable(pageNum));
    
    document.getElementById(`prevMonth${pageNum}`).addEventListener('click', () => {
        let month = parseInt(monthSelect.value);
        let year = parseInt(yearSelect.value);
        month--;
        if (month < 0) {
            month = 11;
            year--;
        }
        monthSelect.value = month;
        yearSelect.value = year;
        updateHabitTable(pageNum);
    });
    
    document.getElementById(`nextMonth${pageNum}`).addEventListener('click', () => {
        let month = parseInt(monthSelect.value);
        let year = parseInt(yearSelect.value);
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
        monthSelect.value = month;
        yearSelect.value = year;
        updateHabitTable(pageNum);
    });
}

function initHabitTable(pageNum, directions) {
    const table = document.getElementById(`habitTable${pageNum}`);
    generateHabitTable(table, pageNum, directions);
    updateHabitTable(pageNum);
}

function generateHabitTable(table, pageNum, directions) {
    table.innerHTML = '';
    
    // Header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Направление</th><th>Пункт</th>';
    
    // Days of month
    for (let day = 1; day <= 31; day++) {
        const th = document.createElement('th');
        th.className = 'day-header';
        th.textContent = day;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    
    // Direction rows
    directions.forEach((direction, dirIndex) => {
        const startRow = dirIndex === 0 ? 0 : dirIndex * 4 + dirIndex; // Account for spacing
        
        for (let itemIndex = 0; itemIndex < 4; itemIndex++) {
            const row = document.createElement('tr');
            
            // Direction header (only on first row)
            if (itemIndex === 0) {
                const dirCell = document.createElement('td');
                dirCell.className = 'direction-header';
                dirCell.textContent = direction;
                dirCell.rowSpan = 4;
                row.appendChild(dirCell);
            }
            
            // Item cell
            const itemCell = document.createElement('td');
            itemCell.className = 'item-cell';
            const itemInput = document.createElement('input');
            itemInput.type = 'text';
            itemInput.placeholder = 'Привычка...';
            itemInput.id = `habit_${pageNum}_${dirIndex}_${itemIndex}`;
            itemInput.addEventListener('change', () => saveHabitsData());
            itemCell.appendChild(itemInput);
            row.appendChild(itemCell);
            
            // Rating cells for each day
            for (let day = 1; day <= 31; day++) {
                const ratingCell = document.createElement('td');
                ratingCell.className = 'rating-cell';
                const ratingInput = document.createElement('input');
                ratingInput.type = 'number';
                ratingInput.min = '0';
                ratingInput.max = '5';
                ratingInput.id = `rating_${pageNum}_${dirIndex}_${itemIndex}_${day}`;
                ratingInput.addEventListener('change', () => saveHabitsData());
                ratingCell.appendChild(ratingInput);
                row.appendChild(ratingCell);
            }
            
            table.appendChild(row);
        }
    });
}

function updateHabitTable(pageNum) {
    const monthSelect = document.getElementById(`monthSelect${pageNum}`);
    const yearSelect = document.getElementById(`yearSelect${pageNum}`);
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearSelect.value);
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const table = document.getElementById(`habitTable${pageNum}`);
    
    // Hide/show day columns based on days in month
    const dayCells = table.querySelectorAll('th.day-header, td.rating-cell');
    dayCells.forEach((cell, index) => {
        const dayNum = (index % 31) + 1;
        cell.style.display = dayNum <= daysInMonth ? 'table-cell' : 'none';
    });
    
    loadHabitsData();
}

function saveHabitsData() {
    const data = loadData(DATA_KEYS.HABITS);
    
    for (let pageNum = 1; pageNum <= 3; pageNum++) {
        const monthSelect = document.getElementById(`monthSelect${pageNum}`);
        const yearSelect = document.getElementById(`yearSelect${pageNum}`);
        const month = monthSelect.value;
        const year = yearSelect.value;
        const key = `${year}-${month.padStart(2, '0')}-page${pageNum}`;
        
        if (!data[key]) data[key] = {};
        
        // Save habits and ratings
        for (let dirIndex = 0; dirIndex < 4; dirIndex++) {
            for (let itemIndex = 0; itemIndex < 4; itemIndex++) {
                const habitInput = document.getElementById(`habit_${pageNum}_${dirIndex}_${itemIndex}`);
                const habitKey = `habit_${dirIndex}_${itemIndex}`;
                
                if (habitInput) {
                    data[key][habitKey] = {
                        name: habitInput.value,
                        ratings: {}
                    };
                    
                    // Save ratings for each day
                    for (let day = 1; day <= 31; day++) {
                        const ratingInput = document.getElementById(`rating_${pageNum}_${dirIndex}_${itemIndex}_${day}`);
                        if (ratingInput && ratingInput.value) {
                            data[key][habitKey].ratings[day] = parseInt(ratingInput.value);
                        }
                    }
                }
            }
        }
    }
    
    saveData(DATA_KEYS.HABITS, data);
}

function loadHabitsData() {
    const data = loadData(DATA_KEYS.HABITS);
    
    for (let pageNum = 1; pageNum <= 3; pageNum++) {
        const monthSelect = document.getElementById(`monthSelect${pageNum}`);
        const yearSelect = document.getElementById(`yearSelect${pageNum}`);
        const month = monthSelect.value;
        const year = yearSelect.value;
        const key = `${year}-${month.padStart(2, '0')}-page${pageNum}`;
        const monthData = data[key] || {};
        
        // Load habits and ratings
        for (let dirIndex = 0; dirIndex < 4; dirIndex++) {
            for (let itemIndex = 0; itemIndex < 4; itemIndex++) {
                const habitInput = document.getElementById(`habit_${pageNum}_${dirIndex}_${itemIndex}`);
                const habitKey = `habit_${dirIndex}_${itemIndex}`;
                
                if (habitInput && monthData[habitKey]) {
                    habitInput.value = monthData[habitKey].name || '';
                    
                    // Load ratings
                    const ratings = monthData[habitKey].ratings || {};
                    for (let day = 1; day <= 31; day++) {
                        const ratingInput = document.getElementById(`rating_${pageNum}_${dirIndex}_${itemIndex}_${day}`);
                        if (ratingInput) {
                            ratingInput.value = ratings[day] || '';
                        }
                    }
                }
            }
        }
    }
}

function applyHabitsData(data) {
    loadHabitsData();
}

// Train Principle
function initTrainPrinciple() {
    const spheres = ['Физическая область', 'Семья', 'Работа/Бизнес', 'Самообразование/Духовность'];
    const timeBlocks = ['6-10', '10-14', '14-18', '18-22'];
    
    const trainGrid = document.getElementById('trainGrid');
    trainGrid.innerHTML = '';
    
    timeBlocks.forEach(timeBlock => {
        // Time block label
        const timeDiv = document.createElement('div');
        timeDiv.className = 'time-block';
        timeDiv.textContent = timeBlock;
        trainGrid.appendChild(timeDiv);
        
        // Cells for each sphere
        spheres.forEach((sphere, index) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'train-cell';
            
            const textarea = document.createElement('textarea');
            textarea.id = `train_${timeBlock.replace('-', '_')}_${index}`;
            textarea.placeholder = `${sphere} (${timeBlock})...`;
            textarea.addEventListener('change', saveTrainData);
            textarea.addEventListener('blur', saveTrainData);
            
            cellDiv.appendChild(textarea);
            trainGrid.appendChild(cellDiv);
        });
    });
    
    loadTrainData(formatDate(currentDate));
}

function saveTrainData() {
    const dateKey = document.getElementById('trainDate').value;
    const data = loadData(DATA_KEYS.TRAIN);
    
    if (!data[dateKey]) data[dateKey] = {};
    
    const timeBlocks = ['6_10', '10_14', '14_18', '18_22'];
    timeBlocks.forEach((timeBlock, timeIndex) => {
        for (let sphereIndex = 0; sphereIndex < 4; sphereIndex++) {
            const textarea = document.getElementById(`train_${timeBlock}_${sphereIndex}`);
            if (textarea) {
                data[dateKey][`${timeBlock}_${sphereIndex}`] = textarea.value;
            }
        }
    });
    
    saveData(DATA_KEYS.TRAIN, data);
}

function loadTrainData(dateKey) {
    const data = loadData(DATA_KEYS.TRAIN);
    const dayData = data[dateKey] || {};
    
    const timeBlocks = ['6_10', '10_14', '14_18', '18_22'];
    timeBlocks.forEach((timeBlock) => {
        for (let sphereIndex = 0; sphereIndex < 4; sphereIndex++) {
            const textarea = document.getElementById(`train_${timeBlock}_${sphereIndex}`);
            if (textarea) {
                const key = `${timeBlock}_${sphereIndex}`;
                textarea.value = dayData[key] || '';
            }
        }
    });
}

function applyTrainData(data) {
    loadTrainData(document.getElementById('trainDate').value);
}

// Annual Plan
function initAnnualPlan() {
    const yearSelect = document.getElementById('annualYearSelect');
    
    // Populate years
    yearSelect.innerHTML = '';
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) option.selected = true;
        yearSelect.appendChild(option);
    }
    
    // Event listeners
    yearSelect.addEventListener('change', updateAnnualPlan);
    
    document.getElementById('annualPrevYear').addEventListener('click', () => {
        const year = parseInt(yearSelect.value) - 1;
        yearSelect.value = year;
        updateAnnualPlan();
    });
    
    document.getElementById('annualNextYear').addEventListener('click', () => {
        const year = parseInt(yearSelect.value) + 1;
        yearSelect.value = year;
        updateAnnualPlan();
    });
    
    generateAnnualTable();
    updateAnnualPlan();
}

function generateAnnualTable() {
    const table = document.getElementById('annualTable');
    table.innerHTML = '';
    
    const months = [
        'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
        'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
    ];
    
    // Header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>День</th>';
    months.forEach(month => {
        const th = document.createElement('th');
        th.textContent = month;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    
    // Day rows
    for (let day = 1; day <= 31; day++) {
        const row = document.createElement('tr');
        
        // Day cell
        const dayCell = document.createElement('td');
        dayCell.className = 'day-cell';
        dayCell.textContent = day;
        row.appendChild(dayCell);
        
        // Month cells
        for (let month = 0; month < 12; month++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `annual_${month}_${day}`;
            input.addEventListener('change', saveAnnualData);
            input.addEventListener('blur', saveAnnualData);
            cell.appendChild(input);
            row.appendChild(cell);
        }
        
        table.appendChild(row);
    }
}

function updateAnnualPlan() {
    loadAnnualData();
}

function saveAnnualData() {
    const yearSelect = document.getElementById('annualYearSelect');
    const year = yearSelect.value;
    const data = loadData(DATA_KEYS.ANNUAL);
    
    if (!data[year]) data[year] = {};
    
    for (let month = 0; month < 12; month++) {
        for (let day = 1; day <= 31; day++) {
            const input = document.getElementById(`annual_${month}_${day}`);
            if (input) {
                const key = `${month}_${day}`;
                data[year][key] = input.value;
            }
        }
    }
    
    saveData(DATA_KEYS.ANNUAL, data);
}

function loadAnnualData() {
    const yearSelect = document.getElementById('annualYearSelect');
    const year = yearSelect.value;
    const data = loadData(DATA_KEYS.ANNUAL);
    const yearData = data[year] || {};
    
    for (let month = 0; month < 12; month++) {
        for (let day = 1; day <= 31; day++) {
            const input = document.getElementById(`annual_${month}_${day}`);
            if (input) {
                const key = `${month}_${day}`;
                input.value = yearData[key] || '';
                
                // Hide invalid days for each month
                const date = new Date(parseInt(year), month, day);
                if (date.getMonth() !== month) {
                    input.parentElement.style.display = 'none';
                } else {
                    input.parentElement.style.display = 'table-cell';
                }
            }
        }
    }
}

function applyAnnualData(data) {
    loadAnnualData();
}

// Priority Matrix (continues on next message due to length...)
function initPriorityMatrix() {
    updateCurrentWeek();
    
    document.getElementById('priorityPrevWeek').addEventListener('click', () => {
        currentWeek--;
        if (currentWeek < 1) {
            currentWeek = 52;
            currentYear--;
        }
        updateCurrentWeek();
        loadPriorityData();
    });
    
    document.getElementById('priorityNextWeek').addEventListener('click', () => {
        currentWeek++;
        if (currentWeek > 52) {
            currentWeek = 1;
            currentYear++;
        }
        updateCurrentWeek();
        loadPriorityData();
    });
    
    document.getElementById('priorityThisWeek').addEventListener('click', () => {
        const now = new Date();
        currentWeek = getWeekNumber(now);
        currentYear = now.getFullYear();
        updateCurrentWeek();
        loadPriorityData();
    });
    
    // Add task buttons
    document.querySelectorAll('.add-task-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const quadrant = e.target.dataset.quadrant;
            addPriorityTask(quadrant);
        });
    });
    
    loadPriorityData();
}

function updateCurrentWeek() {
    document.getElementById('currentWeek').textContent = `Неделя ${currentWeek}, ${currentYear}`;
}

function addPriorityTask(quadrant) {
    const container = document.getElementById(`quadrant${quadrant}`);
    
    const taskDiv = document.createElement('div');
    taskDiv.className = 'priority-task';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', savePriorityData);
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Новая задача...';
    input.addEventListener('change', savePriorityData);
    input.addEventListener('blur', savePriorityData);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => {
        taskDiv.remove();
        savePriorityData();
    });
    
    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(input);
    taskDiv.appendChild(deleteBtn);
    
    container.insertBefore(taskDiv, container.querySelector('.add-task-btn'));
    savePriorityData();
}

function savePriorityData() {
    const weekKey = `${currentYear}-W${currentWeek.toString().padStart(2, '0')}`;
    const data = loadData(DATA_KEYS.PRIORITY);
    
    if (!data[weekKey]) data[weekKey] = {};
    
    ['A', 'B', 'C', 'D'].forEach(quadrant => {
        const container = document.getElementById(`quadrant${quadrant}`);
        const tasks = [];
        
        container.querySelectorAll('.priority-task').forEach(taskDiv => {
            const checkbox = taskDiv.querySelector('input[type="checkbox"]');
            const input = taskDiv.querySelector('input[type="text"]');
            
            if (input && input.value.trim()) {
                tasks.push({
                    text: input.value,
                    completed: checkbox.checked
                });
            }
        });
        
        data[weekKey][quadrant] = tasks;
    });
    
    saveData(DATA_KEYS.PRIORITY, data);
}

function loadPriorityData() {
    const weekKey = `${currentYear}-W${currentWeek.toString().padStart(2, '0')}`;
    const data = loadData(DATA_KEYS.PRIORITY);
    const weekData = data[weekKey] || {};
    
    ['A', 'B', 'C', 'D'].forEach(quadrant => {
        const container = document.getElementById(`quadrant${quadrant}`);
        const existingTasks = container.querySelectorAll('.priority-task');
        existingTasks.forEach(task => task.remove());
        
        const tasks = weekData[quadrant] || [];
        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'priority-task';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', savePriorityData);
            
            const input = document.createElement('input');
            input.type = 'text';
            input.value = task.text;
            input.addEventListener('change', savePriorityData);
            input.addEventListener('blur', savePriorityData);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '×';
            deleteBtn.addEventListener('click', () => {
                taskDiv.remove();
                savePriorityData();
            });
            
            taskDiv.appendChild(checkbox);
            taskDiv.appendChild(input);
            taskDiv.appendChild(deleteBtn);
            
            container.insertBefore(taskDiv, container.querySelector('.add-task-btn'));
        });
    });
}

function applyPriorityData(data) {
    loadPriorityData();
}

// Frogs
function initFrogs() {
    initFrogsNavigation();
    
    document.getElementById('addFrog').addEventListener('click', addFrog);
    
    loadFrogsData();
}

function initFrogsNavigation() {
    const monthSelect = document.getElementById('frogsMonthSelect');
    const yearSelect = document.getElementById('frogsYearSelect');
    
    // Populate months
    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    
    monthSelect.innerHTML = '';
    months.forEach((month, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = month;
        if (i === currentMonth) option.selected = true;
        monthSelect.appendChild(option);
    });
    
    // Populate years
    yearSelect.innerHTML = '';
    for (let year = currentYear - 2; year <= currentYear + 2; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) option.selected = true;
        yearSelect.appendChild(option);
    }
    
    // Event listeners
    monthSelect.addEventListener('change', loadFrogsData);
    yearSelect.addEventListener('change', loadFrogsData);
    
    document.getElementById('frogsPrevMonth').addEventListener('click', () => {
        let month = parseInt(monthSelect.value);
        let year = parseInt(yearSelect.value);
        month--;
        if (month < 0) {
            month = 11;
            year--;
        }
        monthSelect.value = month;
        yearSelect.value = year;
        loadFrogsData();
    });
    
    document.getElementById('frogsNextMonth').addEventListener('click', () => {
        let month = parseInt(monthSelect.value);
        let year = parseInt(yearSelect.value);
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
        monthSelect.value = month;
        yearSelect.value = year;
        loadFrogsData();
    });
}

function addFrog() {
    const container = document.getElementById('activeFrogs');
    
    const frogDiv = document.createElement('div');
    frogDiv.className = 'frog-item';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            // Move to completed
            const completedContainer = document.getElementById('completedFrogs');
            frogDiv.classList.add('completed');
            completedContainer.appendChild(frogDiv);
        }
        saveFrogsData();
    });
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Новая лягушка...';
    input.addEventListener('change', saveFrogsData);
    input.addEventListener('blur', saveFrogsData);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => {
        frogDiv.remove();
        saveFrogsData();
    });
    
    frogDiv.appendChild(checkbox);
    frogDiv.appendChild(input);
    frogDiv.appendChild(deleteBtn);
    
    container.insertBefore(frogDiv, document.getElementById('addFrog'));
    saveFrogsData();
}

function saveFrogsData() {
    const monthSelect = document.getElementById('frogsMonthSelect');
    const yearSelect = document.getElementById('frogsYearSelect');
    const monthKey = `${yearSelect.value}-${monthSelect.value.padStart(2, '0')}`;
    
    const data = loadData(DATA_KEYS.FROGS);
    if (!data[monthKey]) data[monthKey] = { active: [], completed: [] };
    
    // Save active frogs
    const activeContainer = document.getElementById('activeFrogs');
    const activeFrogs = [];
    activeContainer.querySelectorAll('.frog-item').forEach(frogDiv => {
        const input = frogDiv.querySelector('input[type="text"]');
        if (input && input.value.trim()) {
            activeFrogs.push(input.value);
        }
    });
    data[monthKey].active = activeFrogs;
    
    // Save completed frogs
    const completedContainer = document.getElementById('completedFrogs');
    const completedFrogs = [];
    completedContainer.querySelectorAll('.frog-item').forEach(frogDiv => {
        const input = frogDiv.querySelector('input[type="text"]');
        if (input && input.value.trim()) {
            completedFrogs.push(input.value);
        }
    });
    data[monthKey].completed = completedFrogs;
    
    saveData(DATA_KEYS.FROGS, data);
}

function loadFrogsData() {
    const monthSelect = document.getElementById('frogsMonthSelect');
    const yearSelect = document.getElementById('frogsYearSelect');
    const monthKey = `${yearSelect.value}-${monthSelect.value.padStart(2, '0')}`;
    
    const data = loadData(DATA_KEYS.FROGS);
    const monthData = data[monthKey] || { active: [], completed: [] };
    
    // Clear existing
    const activeContainer = document.getElementById('activeFrogs');
    const completedContainer = document.getElementById('completedFrogs');
    
    activeContainer.querySelectorAll('.frog-item').forEach(item => item.remove());
    completedContainer.querySelectorAll('.frog-item').forEach(item => item.remove());
    
    // Load active frogs
    monthData.active.forEach(frogText => {
        const frogDiv = document.createElement('div');
        frogDiv.className = 'frog-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                frogDiv.classList.add('completed');
                completedContainer.appendChild(frogDiv);
            }
            saveFrogsData();
        });
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = frogText;
        input.addEventListener('change', saveFrogsData);
        input.addEventListener('blur', saveFrogsData);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', () => {
            frogDiv.remove();
            saveFrogsData();
        });
        
        frogDiv.appendChild(checkbox);
        frogDiv.appendChild(input);
        frogDiv.appendChild(deleteBtn);
        
        activeContainer.insertBefore(frogDiv, document.getElementById('addFrog'));
    });
    
    // Load completed frogs
    monthData.completed.forEach(frogText => {
        const frogDiv = document.createElement('div');
        frogDiv.className = 'frog-item completed';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.addEventListener('change', (e) => {
            if (!e.target.checked) {
                frogDiv.classList.remove('completed');
                activeContainer.insertBefore(frogDiv, document.getElementById('addFrog'));
            }
            saveFrogsData();
        });
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = frogText;
        input.addEventListener('change', saveFrogsData);
        input.addEventListener('blur', saveFrogsData);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', () => {
            frogDiv.remove();
            saveFrogsData();
        });
        
        frogDiv.appendChild(checkbox);
        frogDiv.appendChild(input);
        frogDiv.appendChild(deleteBtn);
        
        completedContainer.appendChild(frogDiv);
    });
}

function applyFrogsData(data) {
    loadFrogsData();
}

// Elephants
function initElephants() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchElephantTab(tab);
        });
    });
    
    document.getElementById('addElephant').addEventListener('click', addElephant);
    
    loadElephantsData();
}

function switchElephantTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}Elephants`).classList.add('active');
}

function addElephant() {
    const container = document.getElementById('activeElephants');
    
    const elephantDiv = document.createElement('div');
    elephantDiv.className = 'elephant-item';
    
    elephantDiv.innerHTML = `
        <div class="elephant-header">
            <input type="text" class="elephant-name" placeholder="Название проекта..." />
            <div class="elephant-actions">
                <button class="complete-btn">Завершить</button>
                <button class="delete-elephant-btn">Удалить</button>
            </div>
        </div>
        <div class="subtask-list">
            <button class="add-btn add-subtask-btn">+ Добавить подзадачу</button>
        </div>
    `;
    
    // Event listeners
    const nameInput = elephantDiv.querySelector('.elephant-name');
    nameInput.addEventListener('change', saveElephantsData);
    nameInput.addEventListener('blur', saveElephantsData);
    
    const completeBtn = elephantDiv.querySelector('.complete-btn');
    completeBtn.addEventListener('click', () => {
        const completedContainer = document.getElementById('completedElephants');
        completedContainer.appendChild(elephantDiv);
        
        // Remove action buttons
        elephantDiv.querySelector('.elephant-actions').style.display = 'none';
        
        saveElephantsData();
    });
    
    const deleteBtn = elephantDiv.querySelector('.delete-elephant-btn');
    deleteBtn.addEventListener('click', () => {
        elephantDiv.remove();
        saveElephantsData();
    });
    
    const addSubtaskBtn = elephantDiv.querySelector('.add-subtask-btn');
    addSubtaskBtn.addEventListener('click', () => addSubtask(elephantDiv));
    
    container.insertBefore(elephantDiv, document.getElementById('addElephant'));
    saveElephantsData();
}

function addSubtask(elephantDiv) {
    const subtaskList = elephantDiv.querySelector('.subtask-list');
    
    const subtaskDiv = document.createElement('div');
    subtaskDiv.className = 'subtask-item';
    
    subtaskDiv.innerHTML = `
        <input type="checkbox" />
        <input type="text" placeholder="Подзадача..." />
        <input type="text" placeholder="Ответственный" />
        <input type="date" />
        <button class="delete-btn">×</button>
    `;
    
    // Event listeners
    const inputs = subtaskDiv.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('change', saveElephantsData);
        if (input.type === 'text') {
            input.addEventListener('blur', saveElephantsData);
        }
    });
    
    const deleteBtn = subtaskDiv.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        subtaskDiv.remove();
        saveElephantsData();
    });
    
    subtaskList.insertBefore(subtaskDiv, subtaskList.querySelector('.add-subtask-btn'));
    saveElephantsData();
}

function saveElephantsData() {
    const data = loadData(DATA_KEYS.ELEPHANTS);
    data.active = [];
    data.completed = [];
    
    // Save active elephants
    const activeContainer = document.getElementById('activeElephants');
    activeContainer.querySelectorAll('.elephant-item').forEach(elephantDiv => {
        const elephant = extractElephantData(elephantDiv);
        if (elephant.name.trim()) {
            data.active.push(elephant);
        }
    });
    
    // Save completed elephants
    const completedContainer = document.getElementById('completedElephants');
    completedContainer.querySelectorAll('.elephant-item').forEach(elephantDiv => {
        const elephant = extractElephantData(elephantDiv);
        if (elephant.name.trim()) {
            data.completed.push(elephant);
        }
    });
    
    saveData(DATA_KEYS.ELEPHANTS, data);
}

function extractElephantData(elephantDiv) {
    const nameInput = elephantDiv.querySelector('.elephant-name');
    const subtasks = [];
    
    elephantDiv.querySelectorAll('.subtask-item').forEach(subtaskDiv => {
        const inputs = subtaskDiv.querySelectorAll('input');
        if (inputs.length >= 4) {
            subtasks.push({
                completed: inputs[0].checked,
                task: inputs[1].value,
                responsible: inputs[2].value,
                deadline: inputs[3].value
            });
        }
    });
    
    return {
        name: nameInput.value,
        subtasks: subtasks
    };
}

function loadElephantsData() {
    const data = loadData(DATA_KEYS.ELEPHANTS);
    
    // Clear existing
    document.getElementById('activeElephants').querySelectorAll('.elephant-item').forEach(item => item.remove());
    document.getElementById('completedElephants').querySelectorAll('.elephant-item').forEach(item => item.remove());
    
    // Load active elephants
    if (data.active) {
        data.active.forEach(elephant => {
            createElephantFromData(elephant, 'activeElephants', false);
        });
    }
    
    // Load completed elephants
    if (data.completed) {
        data.completed.forEach(elephant => {
            createElephantFromData(elephant, 'completedElephants', true);
        });
    }
}

function createElephantFromData(elephantData, containerId, isCompleted) {
    const container = document.getElementById(containerId);
    
    const elephantDiv = document.createElement('div');
    elephantDiv.className = 'elephant-item';
    
    elephantDiv.innerHTML = `
        <div class="elephant-header">
            <input type="text" class="elephant-name" value="${elephantData.name}" placeholder="Название проекта..." />
            <div class="elephant-actions" ${isCompleted ? 'style="display: none;"' : ''}>
                <button class="complete-btn">Завершить</button>
                <button class="delete-elephant-btn">Удалить</button>
            </div>
        </div>
        <div class="subtask-list">
            <button class="add-btn add-subtask-btn" ${isCompleted ? 'style="display: none;"' : ''}>+ Добавить подзадачу</button>
        </div>
    `;
    
    // Event listeners
    const nameInput = elephantDiv.querySelector('.elephant-name');
    nameInput.addEventListener('change', saveElephantsData);
    nameInput.addEventListener('blur', saveElephantsData);
    
    if (!isCompleted) {
        const completeBtn = elephantDiv.querySelector('.complete-btn');
        completeBtn.addEventListener('click', () => {
            const completedContainer = document.getElementById('completedElephants');
            completedContainer.appendChild(elephantDiv);
            elephantDiv.querySelector('.elephant-actions').style.display = 'none';
            elephantDiv.querySelector('.add-subtask-btn').style.display = 'none';
            saveElephantsData();
        });
        
        const deleteBtn = elephantDiv.querySelector('.delete-elephant-btn');
        deleteBtn.addEventListener('click', () => {
            elephantDiv.remove();
            saveElephantsData();
        });
        
        const addSubtaskBtn = elephantDiv.querySelector('.add-subtask-btn');
        addSubtaskBtn.addEventListener('click', () => addSubtask(elephantDiv));
    }
    
    // Add subtasks
    if (elephantData.subtasks) {
        const subtaskList = elephantDiv.querySelector('.subtask-list');
        elephantData.subtasks.forEach(subtask => {
            const subtaskDiv = document.createElement('div');
            subtaskDiv.className = 'subtask-item';
            
            subtaskDiv.innerHTML = `
                <input type="checkbox" ${subtask.completed ? 'checked' : ''} />
                <input type="text" value="${subtask.task}" placeholder="Подзадача..." />
                <input type="text" value="${subtask.responsible}" placeholder="Ответственный" />
                <input type="date" value="${subtask.deadline}" />
                <button class="delete-btn" ${isCompleted ? 'style="display: none;"' : ''}>×</button>
            `;
            
            // Event listeners
            const inputs = subtaskDiv.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('change', saveElephantsData);
                if (input.type === 'text') {
                    input.addEventListener('blur', saveElephantsData);
                }
            });
            
            if (!isCompleted) {
                const deleteBtn = subtaskDiv.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => {
                    subtaskDiv.remove();
                    saveElephantsData();
                });
            }
            
            subtaskList.insertBefore(subtaskDiv, subtaskList.querySelector('.add-subtask-btn'));
        });
    }
    
    if (containerId === 'activeElephants') {
        container.insertBefore(elephantDiv, document.getElementById('addElephant'));
    } else {
        container.appendChild(elephantDiv);
    }
}

function applyElephantsData(data) {
    loadElephantsData();
}

// Plans
function initPlans() {
    initPlansNavigation();
    
    document.getElementById('addWeeklyTask').addEventListener('click', addWeeklyTask);
    
    // Add event listeners for text areas
    const yearlyGoals = document.getElementById('yearlyGoals');
    const monthlyGoals = document.getElementById('monthlyGoals');
    
    yearlyGoals.addEventListener('change', savePlansData);
    yearlyGoals.addEventListener('blur', savePlansData);
    monthlyGoals.addEventListener('change', savePlansData);
    monthlyGoals.addEventListener('blur', savePlansData);
    
    loadPlansData();
}

function initPlansNavigation() {
    const monthSelect = document.getElementById('plansMonthSelect');
    const yearSelect = document.getElementById('plansYearSelect');
    
    // Populate months
    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    
    monthSelect.innerHTML = '';
    months.forEach((month, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = month;
        if (i === currentMonth) option.selected = true;
        monthSelect.appendChild(option);
    });
    
    // Populate years
    yearSelect.innerHTML = '';
    for (let year = currentYear - 2; year <= currentYear + 2; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) option.selected = true;
        yearSelect.appendChild(option);
    }
    
    // Event listeners
    monthSelect.addEventListener('change', loadPlansData);
    yearSelect.addEventListener('change', loadPlansData);
    
    document.getElementById('plansPrevMonth').addEventListener('click', () => {
        let month = parseInt(monthSelect.value);
        let year = parseInt(yearSelect.value);
        month--;
        if (month < 0) {
            month = 11;
            year--;
        }
        monthSelect.value = month;
        yearSelect.value = year;
        loadPlansData();
    });
    
    document.getElementById('plansNextMonth').addEventListener('click', () => {
        let month = parseInt(monthSelect.value);
        let year = parseInt(yearSelect.value);
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
        monthSelect.value = month;
        yearSelect.value = year;
        loadPlansData();
    });
    
    // Week navigation
    updatePlansCurrentWeek();
    
    document.getElementById('plansPrevWeek').addEventListener('click', () => {
        currentWeek--;
        if (currentWeek < 1) {
            currentWeek = 52;
            currentYear--;
        }
        updatePlansCurrentWeek();
        loadPlansData();
    });
    
    document.getElementById('plansNextWeek').addEventListener('click', () => {
        currentWeek++;
        if (currentWeek > 52) {
            currentWeek = 1;
            currentYear++;
        }
        updatePlansCurrentWeek();
        loadPlansData();
    });
}

function updatePlansCurrentWeek() {
    document.getElementById('plansCurrentWeek').textContent = `Неделя ${currentWeek}, ${currentYear}`;
}

function addWeeklyTask() {
    const container = document.getElementById('weeklyPlans');
    
    const taskDiv = document.createElement('div');
    taskDiv.className = 'weekly-task';
    
    const priorityIcon = document.createElement('span');
    priorityIcon.className = 'priority-icon';
    priorityIcon.textContent = '🔴'; // Default priority
    priorityIcon.title = 'Нажмите чтобы изменить приоритет';
    priorityIcon.addEventListener('click', cyclePriority);
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Недельная задача...';
    input.addEventListener('change', savePlansData);
    input.addEventListener('blur', savePlansData);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => {
        taskDiv.remove();
        savePlansData();
    });
    
    taskDiv.appendChild(priorityIcon);
    taskDiv.appendChild(input);
    taskDiv.appendChild(deleteBtn);
    
    container.insertBefore(taskDiv, document.getElementById('addWeeklyTask'));
    savePlansData();
}

function cyclePriority(e) {
    const priorities = ['🔴', '🟡', '🔵', '⚪'];
    const current = e.target.textContent;
    const currentIndex = priorities.indexOf(current);
    const nextIndex = (currentIndex + 1) % priorities.length;
    e.target.textContent = priorities[nextIndex];
    savePlansData();
}

function savePlansData() {
    const data = loadData(DATA_KEYS.PLANS);
    
    // Save yearly goals
    const yearlyGoals = document.getElementById('yearlyGoals');
    const yearKey = document.getElementById('plansYearSelect').value;
    data[`yearly_${yearKey}`] = yearlyGoals.value;
    
    // Save monthly goals
    const monthlyGoals = document.getElementById('monthlyGoals');
    const monthSelect = document.getElementById('plansMonthSelect');
    const monthYearSelect = document.getElementById('plansYearSelect');
    const monthKey = `${monthYearSelect.value}-${monthSelect.value.padStart(2, '0')}`;
    data[`monthly_${monthKey}`] = monthlyGoals.value;
    
    // Save weekly tasks
    const weekKey = `${currentYear}-W${currentWeek.toString().padStart(2, '0')}`;
    const weeklyTasks = [];
    
    document.querySelectorAll('.weekly-task').forEach(taskDiv => {
        const priorityIcon = taskDiv.querySelector('.priority-icon');
        const input = taskDiv.querySelector('input[type="text"]');
        
        if (input && input.value.trim()) {
            weeklyTasks.push({
                priority: priorityIcon.textContent,
                text: input.value
            });
        }
    });
    
    data[`weekly_${weekKey}`] = weeklyTasks;
    
    saveData(DATA_KEYS.PLANS, data);
}

function loadPlansData() {
    const data = loadData(DATA_KEYS.PLANS);
    
    // Load yearly goals
    const yearlyGoals = document.getElementById('yearlyGoals');
    const yearKey = document.getElementById('plansYearSelect').value;
    yearlyGoals.value = data[`yearly_${yearKey}`] || '';
    
    // Load monthly goals
    const monthlyGoals = document.getElementById('monthlyGoals');
    const monthSelect = document.getElementById('plansMonthSelect');
    const monthYearSelect = document.getElementById('plansYearSelect');
    const monthKey = `${monthYearSelect.value}-${monthSelect.value.padStart(2, '0')}`;
    monthlyGoals.value = data[`monthly_${monthKey}`] || '';
    
    // Load weekly tasks
    const weekKey = `${currentYear}-W${currentWeek.toString().padStart(2, '0')}`;
    const weeklyTasks = data[`weekly_${weekKey}`] || [];
    
    const container = document.getElementById('weeklyPlans');
    const existingTasks = container.querySelectorAll('.weekly-task');
    existingTasks.forEach(task => task.remove());
    
    weeklyTasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'weekly-task';
        
        const priorityIcon = document.createElement('span');
        priorityIcon.className = 'priority-icon';
        priorityIcon.textContent = task.priority;
        priorityIcon.title = 'Нажмите чтобы изменить приоритет';
        priorityIcon.addEventListener('click', cyclePriority);
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.addEventListener('change', savePlansData);
        input.addEventListener('blur', savePlansData);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', () => {
            taskDiv.remove();
            savePlansData();
        });
        
        taskDiv.appendChild(priorityIcon);
        taskDiv.appendChild(input);
        taskDiv.appendChild(deleteBtn);
        
        container.insertBefore(taskDiv, document.getElementById('addWeeklyTask'));
    });
}

function applyPlansData(data) {
    loadPlansData();
}