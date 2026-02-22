/* ===============================================
   FARHAD PLANNER - VANILLA JAVASCRIPT
   =============================================== */

class FarhadPlanner {
    constructor() {
        this.currentSection = 'daily';
        this.currentDate = new Date();
        this.sectionPages = {
            daily: { unit: 'day', current: new Date() },
            actions: { unit: 'month', current: new Date() },
            locomotive: { unit: 'day', current: new Date() },
            yearly: { unit: 'year', current: new Date() },
            priorities: { unit: 'week', current: this.getWeekNumber(new Date()) },
            frogs: { unit: 'month', current: new Date() },
            elephants: { unit: 'none', current: null },
            plans: { unit: 'week', current: this.getWeekNumber(new Date()) }
        };
        
        this.data = this.loadData();
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSection(this.currentSection);
        this.setupSchedule();
        this.setupActionsTable();
        this.setupLocomotiveGrid();
        this.setupYearlyTable();
        this.updateAllPages();
    }

    /* ===============================================
       EVENT LISTENERS
       =============================================== */

    setupEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.loadSection(section);
            });
        });

        // Page navigation
        document.getElementById('prevPage').addEventListener('click', () => this.navigatePage('prev'));
        document.getElementById('nextPage').addEventListener('click', () => this.navigatePage('next'));

        // Touch/swipe events
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

        // Auto-save on input changes
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.saveData();
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.matches('input[type="checkbox"], input[type="range"]')) {
                this.saveData();
            }
        });

        // Day rating display
        const dayRating = document.getElementById('dayRating');
        const ratingValue = document.getElementById('ratingValue');
        if (dayRating && ratingValue) {
            dayRating.addEventListener('input', () => {
                ratingValue.textContent = dayRating.value;
            });
        }

        // Elephant tabs
        document.addEventListener('click', (e) => {
            if (e.target.matches('.tab-btn')) {
                this.switchElephantTab(e.target.dataset.tab);
            }
        });

        // Month selector for plans
        const monthSelector = document.getElementById('monthSelector');
        if (monthSelector) {
            monthSelector.addEventListener('change', () => {
                this.loadMonthPlan();
            });
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchStartX - this.touchEndX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe left = next
                this.navigatePage('next');
            } else {
                // Swipe right = previous
                this.navigatePage('prev');
            }
        }
    }

    /* ===============================================
       NAVIGATION
       =============================================== */

    loadSection(section) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

        // Show selected section
        document.getElementById(section).classList.add('active');
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        this.currentSection = section;
        this.updatePageInfo();
        this.updatePageNavigation();
        this.loadSectionData();
    }

    navigatePage(direction) {
        const section = this.sectionPages[this.currentSection];
        if (section.unit === 'none') return;

        const currentPage = document.querySelector('.section.active .page-content');
        
        // Add flip animation
        if (direction === 'next') {
            currentPage.classList.add('page-flip-left');
        } else {
            currentPage.classList.add('page-flip-right');
        }

        // Remove animation class after animation completes
        setTimeout(() => {
            currentPage.classList.remove('page-flip-left', 'page-flip-right');
        }, 500);

        // Update the page
        if (section.unit === 'day') {
            const newDate = new Date(section.current);
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
            section.current = newDate;
        } else if (section.unit === 'month') {
            const newDate = new Date(section.current);
            newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
            section.current = newDate;
        } else if (section.unit === 'week') {
            section.current += (direction === 'next' ? 1 : -1);
        } else if (section.unit === 'year') {
            const newDate = new Date(section.current);
            newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
            section.current = newDate;
        }

        this.updatePageInfo();
        this.loadSectionData();
    }

    updatePageInfo() {
        const pageInfo = document.getElementById('pageInfo');
        const section = this.sectionPages[this.currentSection];

        let infoText = '';
        if (section.unit === 'day') {
            infoText = this.formatDate(section.current);
        } else if (section.unit === 'month') {
            infoText = this.formatMonth(section.current);
        } else if (section.unit === 'week') {
            infoText = `Неделя ${section.current}`;
        } else if (section.unit === 'year') {
            infoText = section.current.getFullYear().toString();
        } else {
            infoText = '';
        }

        pageInfo.textContent = infoText;
    }

    updatePageNavigation() {
        const pageNav = document.getElementById('pageNav');
        const section = this.sectionPages[this.currentSection];
        
        if (section.unit === 'none') {
            pageNav.style.display = 'none';
        } else {
            pageNav.style.display = 'flex';
        }
    }

    updateAllPages() {
        // Update all date headers
        const sections = ['daily', 'actions', 'locomotive', 'yearly', 'priorities', 'frogs', 'plans'];
        
        sections.forEach(section => {
            const element = document.getElementById(section + 'Date');
            if (element) {
                const sectionData = this.sectionPages[section];
                let dateText = '';
                
                if (sectionData.unit === 'day') {
                    dateText = this.formatDate(sectionData.current);
                } else if (sectionData.unit === 'month') {
                    dateText = this.formatMonth(sectionData.current);
                } else if (sectionData.unit === 'week') {
                    dateText = `Неделя ${sectionData.current}`;
                } else if (sectionData.unit === 'year') {
                    dateText = sectionData.current.getFullYear().toString();
                }
                
                element.textContent = dateText;
            }
        });

        this.updatePageInfo();
    }

    /* ===============================================
       DATA MANAGEMENT
       =============================================== */

    loadData() {
        try {
            const saved = localStorage.getItem('farhadPlannerData');
            return saved ? JSON.parse(saved) : this.getDefaultData();
        } catch (error) {
            console.error('Error loading data:', error);
            return this.getDefaultData();
        }
    }

    saveData() {
        try {
            localStorage.setItem('farhadPlannerData', JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    getDefaultData() {
        return {
            daily: {},
            actions: {},
            locomotive: {},
            yearly: {},
            priorities: {},
            frogs: {},
            elephants: { active: [], completed: [] },
            plans: { year: '', months: {}, weeks: {} }
        };
    }

    loadSectionData() {
        switch (this.currentSection) {
            case 'daily':
                this.loadDailyData();
                break;
            case 'actions':
                this.loadActionsData();
                break;
            case 'locomotive':
                this.loadLocomotiveData();
                break;
            case 'yearly':
                this.loadYearlyData();
                break;
            case 'priorities':
                this.loadPrioritiesData();
                break;
            case 'frogs':
                this.loadFrogsData();
                break;
            case 'elephants':
                this.loadElephantsData();
                break;
            case 'plans':
                this.loadPlansData();
                break;
        }
    }

    /* ===============================================
       DAILY SECTION
       =============================================== */

    setupSchedule() {
        const container = document.getElementById('scheduleContainer');
        if (!container) return;

        for (let hour = 6; hour <= 22; hour++) {
            const item = document.createElement('div');
            item.className = 'schedule-item';
            item.innerHTML = `
                <div class="time-slot">${hour}:00</div>
                <input type="text" id="schedule${hour}" placeholder="Планы на ${hour}:00">
            `;
            container.appendChild(item);
        }
    }

    loadDailyData() {
        const dateKey = this.getDateKey(this.sectionPages.daily.current);
        const dayData = this.data.daily[dateKey] || {};

        // Load urgent tasks
        for (let i = 0; i < 5; i++) {
            const checkbox = document.getElementById(`urgent${i}`);
            const input = checkbox ? checkbox.nextElementSibling : null;
            if (checkbox && input) {
                checkbox.checked = dayData[`urgent${i}Checked`] || false;
                input.value = dayData[`urgent${i}Text`] || '';
            }
        }

        // Load schedule
        for (let hour = 6; hour <= 22; hour++) {
            const input = document.getElementById(`schedule${hour}`);
            if (input) {
                input.value = dayData[`schedule${hour}`] || '';
            }
        }

        // Load flexible plans
        this.loadFlexiblePlans(dayData.flexiblePlans || []);

        // Load text areas
        const textFields = ['affirmation', 'physical', 'timeTracking', 'goals', 'principles', 
                          'successDiary', 'awareness', 'timeWasters', 'mistakes', 'improvements', 'ideas'];
        textFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.value = dayData[field] || '';
            }
        });

        // Load checkboxes and rating
        const checkboxFields = ['books', 'audio', 'video'];
        checkboxFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.checked = dayData[field] || false;
            }
        });

        const dayRating = document.getElementById('dayRating');
        const ratingValue = document.getElementById('ratingValue');
        if (dayRating && ratingValue) {
            dayRating.value = dayData.dayRating || 3;
            ratingValue.textContent = dayRating.value;
        }

        // Save current data when loaded
        this.saveDailyData();
    }

    saveDailyData() {
        const dateKey = this.getDateKey(this.sectionPages.daily.current);
        const dayData = {};

        // Save urgent tasks
        for (let i = 0; i < 5; i++) {
            const checkbox = document.getElementById(`urgent${i}`);
            const input = checkbox ? checkbox.nextElementSibling : null;
            if (checkbox && input) {
                dayData[`urgent${i}Checked`] = checkbox.checked;
                dayData[`urgent${i}Text`] = input.value;
            }
        }

        // Save schedule
        for (let hour = 6; hour <= 22; hour++) {
            const input = document.getElementById(`schedule${hour}`);
            if (input) {
                dayData[`schedule${hour}`] = input.value;
            }
        }

        // Save flexible plans
        dayData.flexiblePlans = this.getFlexiblePlansData();

        // Save text areas
        const textFields = ['affirmation', 'physical', 'timeTracking', 'goals', 'principles', 
                          'successDiary', 'awareness', 'timeWasters', 'mistakes', 'improvements', 'ideas'];
        textFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                dayData[field] = element.value;
            }
        });

        // Save checkboxes and rating
        const checkboxFields = ['books', 'audio', 'video'];
        checkboxFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                dayData[field] = element.checked;
            }
        });

        const dayRating = document.getElementById('dayRating');
        if (dayRating) {
            dayData.dayRating = parseInt(dayRating.value);
        }

        this.data.daily[dateKey] = dayData;
        this.saveData();
    }

    loadFlexiblePlans(plans) {
        const container = document.getElementById('flexiblePlans');
        if (!container) return;

        // Clear existing plans (except add button)
        const addBtn = container.querySelector('.add-btn');
        container.innerHTML = '';
        container.appendChild(addBtn);

        plans.forEach((plan, index) => {
            this.createFlexibleTask(plan.text, plan.completed, index);
        });
    }

    getFlexiblePlansData() {
        const container = document.getElementById('flexiblePlans');
        if (!container) return [];

        const plans = [];
        const tasks = container.querySelectorAll('.task-item');
        
        tasks.forEach(task => {
            const checkbox = task.querySelector('input[type="checkbox"]');
            const input = task.querySelector('input[type="text"]');
            if (checkbox && input) {
                plans.push({
                    text: input.value,
                    completed: checkbox.checked
                });
            }
        });

        return plans;
    }

    /* ===============================================
       ACTIONS SECTION
       =============================================== */

    setupActionsTable() {
        const tableBody = document.getElementById('actionsTableBody');
        if (!tableBody) return;

        const directions = ['Физическая область', 'Семья', 'Работа/Бизнес', 'Самообразование/Духовность'];
        
        directions.forEach((direction, dirIndex) => {
            // Direction row
            const dirRow = document.createElement('tr');
            dirRow.innerHTML = `<td class="direction-name" colspan="32">${direction}</td>`;
            tableBody.appendChild(dirRow);

            // Items rows (default 4)
            for (let itemIndex = 0; itemIndex < 4; itemIndex++) {
                const itemRow = document.createElement('tr');
                let html = `<td class="habit-item">
                    <input type="text" placeholder="Привычка/Действие ${itemIndex + 1}" 
                           data-dir="${dirIndex}" data-item="${itemIndex}">
                </td>`;
                
                // Add 31 day columns
                for (let day = 1; day <= 31; day++) {
                    html += `<td><input type="number" min="0" max="5" placeholder="0" 
                                data-dir="${dirIndex}" data-item="${itemIndex}" data-day="${day}"></td>`;
                }
                
                itemRow.innerHTML = html;
                tableBody.appendChild(itemRow);
            }
        });

        // Add header days after directions are set
        this.updateActionsTableHeader();
    }

    updateActionsTableHeader() {
        const table = document.getElementById('actionsTable');
        const headerRow = table.querySelector('thead tr');
        
        if (headerRow) {
            // Clear existing day headers
            while (headerRow.children.length > 1) {
                headerRow.removeChild(headerRow.lastChild);
            }
            
            // Add day headers
            for (let day = 1; day <= 31; day++) {
                const th = document.createElement('th');
                th.textContent = day;
                th.style.minWidth = '40px';
                headerRow.appendChild(th);
            }
        }
    }

    loadActionsData() {
        const monthKey = this.getMonthKey(this.sectionPages.actions.current);
        const actionsData = this.data.actions[monthKey] || {};

        // Load direction items
        const itemInputs = document.querySelectorAll('[data-dir][data-item]:not([data-day])');
        itemInputs.forEach(input => {
            const dir = input.dataset.dir;
            const item = input.dataset.item;
            const key = `item_${dir}_${item}`;
            input.value = actionsData[key] || '';
        });

        // Load day ratings
        const dayInputs = document.querySelectorAll('[data-dir][data-item][data-day]');
        dayInputs.forEach(input => {
            const dir = input.dataset.dir;
            const item = input.dataset.item;
            const day = input.dataset.day;
            const key = `rating_${dir}_${item}_${day}`;
            input.value = actionsData[key] || '';
        });
    }

    saveActionsData() {
        const monthKey = this.getMonthKey(this.sectionPages.actions.current);
        const actionsData = {};

        // Save direction items
        const itemInputs = document.querySelectorAll('[data-dir][data-item]:not([data-day])');
        itemInputs.forEach(input => {
            const dir = input.dataset.dir;
            const item = input.dataset.item;
            const key = `item_${dir}_${item}`;
            actionsData[key] = input.value;
        });

        // Save day ratings
        const dayInputs = document.querySelectorAll('[data-dir][data-item][data-day]');
        dayInputs.forEach(input => {
            const dir = input.dataset.dir;
            const item = input.dataset.item;
            const day = input.dataset.day;
            const key = `rating_${dir}_${item}_${day}`;
            actionsData[key] = input.value;
        });

        this.data.actions[monthKey] = actionsData;
        this.saveData();
    }

    /* ===============================================
       LOCOMOTIVE SECTION
       =============================================== */

    setupLocomotiveGrid() {
        const gridBody = document.getElementById('locomotiveGrid');
        if (!gridBody) return;

        const timeSlots = ['6-10', '10-14', '14-18', '18-22'];
        const directions = ['Физическая область', 'Семья', 'Работа/Бизнес', 'Самообразование/Духовность'];

        timeSlots.forEach((timeSlot, timeIndex) => {
            const row = document.createElement('div');
            row.className = 'grid-row';

            // Time column
            const timeCol = document.createElement('div');
            timeCol.className = 'time-col';
            timeCol.textContent = timeSlot;
            row.appendChild(timeCol);

            // Direction columns
            directions.forEach((direction, dirIndex) => {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.innerHTML = `<textarea data-time="${timeIndex}" data-dir="${dirIndex}" placeholder="Планы на ${timeSlot} - ${direction}"></textarea>`;
                row.appendChild(cell);
            });

            gridBody.appendChild(row);
        });
    }

    loadLocomotiveData() {
        const dateKey = this.getDateKey(this.sectionPages.locomotive.current);
        const locomotiveData = this.data.locomotive[dateKey] || {};

        const textareas = document.querySelectorAll('#locomotiveGrid textarea');
        textareas.forEach(textarea => {
            const time = textarea.dataset.time;
            const dir = textarea.dataset.dir;
            const key = `cell_${time}_${dir}`;
            textarea.value = locomotiveData[key] || '';
        });
    }

    saveLocomotiveData() {
        const dateKey = this.getDateKey(this.sectionPages.locomotive.current);
        const locomotiveData = {};

        const textareas = document.querySelectorAll('#locomotiveGrid textarea');
        textareas.forEach(textarea => {
            const time = textarea.dataset.time;
            const dir = textarea.dataset.dir;
            const key = `cell_${time}_${dir}`;
            locomotiveData[key] = textarea.value;
        });

        this.data.locomotive[dateKey] = locomotiveData;
        this.saveData();
    }

    /* ===============================================
       YEARLY SECTION
       =============================================== */

    setupYearlyTable() {
        const tableBody = document.getElementById('yearlyTableBody');
        if (!tableBody) return;

        for (let day = 1; day <= 31; day++) {
            const row = document.createElement('tr');
            let html = `<td>${day}</td>`;
            
            for (let month = 0; month < 12; month++) {
                html += `<td><input type="text" data-day="${day}" data-month="${month}"></td>`;
            }
            
            row.innerHTML = html;
            tableBody.appendChild(row);
        }
    }

    loadYearlyData() {
        const year = this.sectionPages.yearly.current.getFullYear();
        const yearlyData = this.data.yearly[year] || {};

        const inputs = document.querySelectorAll('#yearlyTable input');
        inputs.forEach(input => {
            const day = input.dataset.day;
            const month = input.dataset.month;
            const key = `day_${day}_month_${month}`;
            input.value = yearlyData[key] || '';
        });
    }

    saveYearlyData() {
        const year = this.sectionPages.yearly.current.getFullYear();
        const yearlyData = {};

        const inputs = document.querySelectorAll('#yearlyTable input');
        inputs.forEach(input => {
            const day = input.dataset.day;
            const month = input.dataset.month;
            const key = `day_${day}_month_${month}`;
            yearlyData[key] = input.value;
        });

        this.data.yearly[year] = yearlyData;
        this.saveData();
    }

    /* ===============================================
       PRIORITIES SECTION
       =============================================== */

    loadPrioritiesData() {
        const weekKey = this.sectionPages.priorities.current;
        const prioritiesData = this.data.priorities[weekKey] || { A: [], B: [], C: [], D: [] };

        ['A', 'B', 'C', 'D'].forEach(quadrant => {
            const taskList = document.querySelector(`[data-quadrant="${quadrant}"]`);
            if (taskList) {
                taskList.innerHTML = '';
                const tasks = prioritiesData[quadrant] || [];
                tasks.forEach((task, index) => {
                    this.createPriorityTask(quadrant, task.text, task.completed, index);
                });
            }
        });
    }

    savePrioritiesData() {
        const weekKey = this.sectionPages.priorities.current;
        const prioritiesData = { A: [], B: [], C: [], D: [] };

        ['A', 'B', 'C', 'D'].forEach(quadrant => {
            const taskList = document.querySelector(`[data-quadrant="${quadrant}"]`);
            if (taskList) {
                const tasks = taskList.querySelectorAll('.priority-task');
                tasks.forEach(task => {
                    const checkbox = task.querySelector('input[type="checkbox"]');
                    const input = task.querySelector('input[type="text"]');
                    if (checkbox && input) {
                        prioritiesData[quadrant].push({
                            text: input.value,
                            completed: checkbox.checked
                        });
                    }
                });
            }
        });

        this.data.priorities[weekKey] = prioritiesData;
        this.saveData();
    }

    createPriorityTask(quadrant, text = '', completed = false, index = null) {
        const taskList = document.querySelector(`[data-quadrant="${quadrant}"]`);
        if (!taskList) return;

        const taskDiv = document.createElement('div');
        taskDiv.className = 'priority-task';
        taskDiv.innerHTML = `
            <input type="checkbox" ${completed ? 'checked' : ''}>
            <input type="text" value="${text}" placeholder="Задача...">
            <button class="delete-btn" onclick="this.parentElement.remove(); farhadPlanner.savePrioritiesData();">×</button>
        `;

        taskList.appendChild(taskDiv);
    }

    /* ===============================================
       FROGS SECTION
       =============================================== */

    loadFrogsData() {
        const monthKey = this.getMonthKey(this.sectionPages.frogs.current);
        const frogsData = this.data.frogs[monthKey] || { active: [], completed: [] };

        this.renderFrogs('activeFrogs', frogsData.active);
        this.renderFrogs('completedFrogs', frogsData.completed);
    }

    renderFrogs(containerId, frogs) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        frogs.forEach((frog, index) => {
            this.createFrogElement(container, frog.text, frog.completed, index, containerId === 'completedFrogs');
        });
    }

    createFrogElement(container, text, completed, index, isCompleted) {
        const frogDiv = document.createElement('div');
        frogDiv.className = `frog-item ${completed ? 'completed' : ''}`;
        frogDiv.innerHTML = `
            <input type="checkbox" ${completed ? 'checked' : ''} 
                   onchange="farhadPlanner.toggleFrog(${index}, ${isCompleted})">
            <span class="frog-text">${text}</span>
            <button class="delete-btn" onclick="farhadPlanner.deleteFrog(${index}, ${isCompleted})">×</button>
        `;
        container.appendChild(frogDiv);
    }

    toggleFrog(index, isCompleted) {
        const monthKey = this.getMonthKey(this.sectionPages.frogs.current);
        const frogsData = this.data.frogs[monthKey] || { active: [], completed: [] };

        if (isCompleted) {
            // Move from completed back to active
            const frog = frogsData.completed[index];
            frog.completed = false;
            frogsData.active.push(frog);
            frogsData.completed.splice(index, 1);
        } else {
            // Move from active to completed
            const frog = frogsData.active[index];
            frog.completed = true;
            frogsData.completed.push(frog);
            frogsData.active.splice(index, 1);
        }

        this.data.frogs[monthKey] = frogsData;
        this.saveData();
        this.loadFrogsData();
    }

    deleteFrog(index, isCompleted) {
        const monthKey = this.getMonthKey(this.sectionPages.frogs.current);
        const frogsData = this.data.frogs[monthKey] || { active: [], completed: [] };

        if (isCompleted) {
            frogsData.completed.splice(index, 1);
        } else {
            frogsData.active.splice(index, 1);
        }

        this.data.frogs[monthKey] = frogsData;
        this.saveData();
        this.loadFrogsData();
    }

    /* ===============================================
       ELEPHANTS SECTION
       =============================================== */

    switchElephantTab(tab) {
        // Switch tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Switch content
        document.querySelectorAll('.elephant-tab-content').forEach(content => content.classList.remove('active'));
        document.querySelector(`.elephant-tab-content[data-tab="${tab}"]`).classList.add('active');
    }

    loadElephantsData() {
        this.renderElephants('activeElephants', this.data.elephants.active);
        this.renderElephants('completedElephants', this.data.elephants.completed);
    }

    renderElephants(containerId, elephants) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        elephants.forEach((elephant, index) => {
            this.createElephantElement(container, elephant, index, containerId === 'completedElephants');
        });
    }

    createElephantElement(container, elephant, index, isCompleted) {
        const elephantDiv = document.createElement('div');
        elephantDiv.className = 'elephant-item';
        
        let subtasksHtml = '';
        elephant.subtasks.forEach((subtask, subIndex) => {
            subtasksHtml += `
                <div class="subtask">
                    <input type="checkbox" ${subtask.completed ? 'checked' : ''} 
                           onchange="farhadPlanner.toggleSubtask(${index}, ${subIndex}, ${isCompleted})">
                    <input type="text" value="${subtask.text}" placeholder="Подзадача">
                    <input type="text" value="${subtask.responsible}" placeholder="Ответственный">
                    <input type="date" value="${subtask.deadline}">
                    <button class="delete-btn" onclick="farhadPlanner.deleteSubtask(${index}, ${subIndex}, ${isCompleted})">×</button>
                </div>
            `;
        });

        elephantDiv.innerHTML = `
            <div class="elephant-header">
                <div class="elephant-name">${elephant.name}</div>
                <div>
                    <button onclick="farhadPlanner.toggleElephant(${index}, ${isCompleted})">
                        ${isCompleted ? 'В активные' : 'Завершить'}
                    </button>
                    <button class="delete-btn" onclick="farhadPlanner.deleteElephant(${index}, ${isCompleted})">×</button>
                </div>
            </div>
            <div class="subtasks">
                ${subtasksHtml}
                <div class="subtask-input">
                    <input type="text" placeholder="Подзадача">
                    <input type="text" placeholder="Ответственный">
                    <input type="date">
                    <button onclick="farhadPlanner.addSubtask(${index}, ${isCompleted}, this.parentElement)">Добавить</button>
                </div>
            </div>
        `;

        container.appendChild(elephantDiv);
    }

    toggleElephant(index, isCompleted) {
        if (isCompleted) {
            const elephant = this.data.elephants.completed[index];
            elephant.completed = false;
            this.data.elephants.active.push(elephant);
            this.data.elephants.completed.splice(index, 1);
        } else {
            const elephant = this.data.elephants.active[index];
            elephant.completed = true;
            this.data.elephants.completed.push(elephant);
            this.data.elephants.active.splice(index, 1);
        }

        this.saveData();
        this.loadElephantsData();
    }

    deleteElephant(index, isCompleted) {
        if (confirm('Удалить проект?')) {
            if (isCompleted) {
                this.data.elephants.completed.splice(index, 1);
            } else {
                this.data.elephants.active.splice(index, 1);
            }
            this.saveData();
            this.loadElephantsData();
        }
    }

    toggleSubtask(elephantIndex, subtaskIndex, isCompleted) {
        const elephants = isCompleted ? this.data.elephants.completed : this.data.elephants.active;
        elephants[elephantIndex].subtasks[subtaskIndex].completed = 
            !elephants[elephantIndex].subtasks[subtaskIndex].completed;
        
        this.saveData();
        this.loadElephantsData();
    }

    deleteSubtask(elephantIndex, subtaskIndex, isCompleted) {
        const elephants = isCompleted ? this.data.elephants.completed : this.data.elephants.active;
        elephants[elephantIndex].subtasks.splice(subtaskIndex, 1);
        
        this.saveData();
        this.loadElephantsData();
    }

    addSubtask(elephantIndex, isCompleted, inputContainer) {
        const inputs = inputContainer.querySelectorAll('input');
        const text = inputs[0].value.trim();
        const responsible = inputs[1].value.trim();
        const deadline = inputs[2].value;

        if (!text) return;

        const elephants = isCompleted ? this.data.elephants.completed : this.data.elephants.active;
        elephants[elephantIndex].subtasks.push({
            text,
            responsible,
            deadline,
            completed: false
        });

        // Clear inputs
        inputs.forEach(input => input.value = '');

        this.saveData();
        this.loadElephantsData();
    }

    /* ===============================================
       PLANS SECTION
       =============================================== */

    loadPlansData() {
        const weekKey = this.sectionPages.plans.current;

        // Load year plan
        const yearPlan = document.getElementById('yearPlan');
        if (yearPlan) {
            yearPlan.value = this.data.plans.year || '';
        }

        // Load month plan
        this.loadMonthPlan();

        // Load weekly tasks
        const weeklyTasks = this.data.plans.weeks[weekKey] || [];
        this.renderWeeklyTasks(weeklyTasks);
    }

    loadMonthPlan() {
        const monthSelector = document.getElementById('monthSelector');
        const monthPlan = document.getElementById('monthPlan');
        
        if (monthSelector && monthPlan) {
            const monthIndex = monthSelector.value;
            monthPlan.value = this.data.plans.months[monthIndex] || '';
        }
    }

    renderWeeklyTasks(tasks) {
        const container = document.getElementById('weeklyTasks');
        if (!container) return;

        // Clear existing tasks (except add button)
        const addBtn = container.querySelector('.add-btn');
        container.innerHTML = '';
        container.appendChild(addBtn);

        tasks.forEach((task, index) => {
            this.createWeeklyTask(task.text, task.priority, index);
        });
    }

    createWeeklyTask(text = '', priority = '⚪', index = null) {
        const container = document.getElementById('weeklyTasks');
        const addBtn = container.querySelector('.add-btn');

        const taskDiv = document.createElement('div');
        taskDiv.className = 'weekly-task';
        taskDiv.innerHTML = `
            <span class="priority-icon" onclick="farhadPlanner.cyclePriority(this)">${priority}</span>
            <input type="text" value="${text}" placeholder="Задача недели...">
            <button class="delete-btn" onclick="farhadPlanner.deleteWeeklyTask(this.parentElement)">×</button>
        `;

        container.insertBefore(taskDiv, addBtn);
    }

    cyclePriority(iconElement) {
        const priorities = ['🔴', '🟡', '🔵', '⚪'];
        const current = iconElement.textContent;
        const currentIndex = priorities.indexOf(current);
        const nextIndex = (currentIndex + 1) % priorities.length;
        iconElement.textContent = priorities[nextIndex];
        
        this.savePlansData();
    }

    deleteWeeklyTask(taskElement) {
        taskElement.remove();
        this.savePlansData();
    }

    savePlansData() {
        // Save year plan
        const yearPlan = document.getElementById('yearPlan');
        if (yearPlan) {
            this.data.plans.year = yearPlan.value;
        }

        // Save month plan
        const monthSelector = document.getElementById('monthSelector');
        const monthPlan = document.getElementById('monthPlan');
        if (monthSelector && monthPlan) {
            this.data.plans.months[monthSelector.value] = monthPlan.value;
        }

        // Save weekly tasks
        const weekKey = this.sectionPages.plans.current;
        const weeklyTasks = [];
        const tasks = document.querySelectorAll('#weeklyTasks .weekly-task');
        
        tasks.forEach(task => {
            const icon = task.querySelector('.priority-icon');
            const input = task.querySelector('input[type="text"]');
            if (icon && input) {
                weeklyTasks.push({
                    text: input.value,
                    priority: icon.textContent
                });
            }
        });

        this.data.plans.weeks[weekKey] = weeklyTasks;
        this.saveData();
    }

    /* ===============================================
       UTILITY FUNCTIONS
       =============================================== */

    formatDate(date) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('ru-RU', options);
    }

    formatMonth(date) {
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('ru-RU', options);
    }

    getDateKey(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    getMonthKey(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }
}

/* ===============================================
   GLOBAL FUNCTIONS
   =============================================== */

function addFlexibleTask() {
    farhadPlanner.createFlexibleTask();
}

function addPriorityTask(quadrant) {
    farhadPlanner.createPriorityTask(quadrant);
}

function addFrog() {
    const input = document.getElementById('newFrogText');
    const text = input.value.trim();
    
    if (!text) return;

    const monthKey = farhadPlanner.getMonthKey(farhadPlanner.sectionPages.frogs.current);
    if (!farhadPlanner.data.frogs[monthKey]) {
        farhadPlanner.data.frogs[monthKey] = { active: [], completed: [] };
    }
    
    farhadPlanner.data.frogs[monthKey].active.push({
        text: text,
        completed: false
    });

    input.value = '';
    farhadPlanner.saveData();
    farhadPlanner.loadFrogsData();
}

function addElephant() {
    const input = document.getElementById('newElephantName');
    const name = input.value.trim();
    
    if (!name) return;

    farhadPlanner.data.elephants.active.push({
        name: name,
        subtasks: [],
        completed: false
    });

    input.value = '';
    farhadPlanner.saveData();
    farhadPlanner.loadElephantsData();
}

function addWeeklyTask() {
    farhadPlanner.createWeeklyTask();
}

// Add methods to the prototype for flexible tasks
FarhadPlanner.prototype.createFlexibleTask = function(text = '', completed = false, index = null) {
    const container = document.getElementById('flexiblePlans');
    const addBtn = container.querySelector('.add-btn');

    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    taskDiv.innerHTML = `
        <input type="checkbox" ${completed ? 'checked' : ''}>
        <input type="text" value="${text}" placeholder="Гибкая задача...">
        <button class="delete-btn" onclick="this.parentElement.remove(); farhadPlanner.saveDailyData();">×</button>
    `;

    container.insertBefore(taskDiv, addBtn);
};

/* ===============================================
   INITIALIZE APP
   =============================================== */

let farhadPlanner;

document.addEventListener('DOMContentLoaded', () => {
    farhadPlanner = new FarhadPlanner();
});

// Auto-save on page unload
window.addEventListener('beforeunload', () => {
    if (farhadPlanner) {
        farhadPlanner.saveData();
    }
});