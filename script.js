// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }

    // Initialize page-specific functions
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage.includes('habit-tracker')) {
        initHabitTracker();
    } else if (currentPage.includes('water-calculator')) {
        initWaterCalculator();
    } else if (currentPage.includes('eco-tips')) {
        initEcoTips();
    } else if (currentPage.includes('daily-checklist')) {
        initDailyChecklist();
    } else if (currentPage.includes('contact')) {
        initContactForm();
    }
});

// ==================== HABIT TRACKER ====================
let waterCount = 0;
let handwashCount = 0;
const waterGoal = 8;
const handwashGoal = 6;

function initHabitTracker() {
    const dateEl = document.getElementById('currentDate');
    if (dateEl) {
        const today = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateEl.textContent = today;
    }

    const saved = localStorage.getItem('habitTracker');
    if (saved) {
        const data = JSON.parse(saved);
        const today = new Date().toDateString();
        if (data.date === today) {
            waterCount = data.water || 0;
            handwashCount = data.handwash || 0;
        }
    }

    updateHabitTracker();
}

function incrementWater() {
    if (waterCount < waterGoal * 2) waterCount++;
    updateHabitTracker();
}

function decrementWater() {
    if (waterCount > 0) waterCount--;
    updateHabitTracker();
}

function incrementHandwash() {
    if (handwashCount < handwashGoal * 2) handwashCount++;
    updateHabitTracker();
}

function decrementHandwash() {
    if (handwashCount > 0) handwashCount--;
    updateHabitTracker();
}

function updateHabitTracker() {
    const today = new Date().toDateString();
    localStorage.setItem('habitTracker', JSON.stringify({
        date: today,
        water: waterCount,
        handwash: handwashCount
    }));

    document.getElementById('waterCount').textContent = waterCount;
    document.getElementById('handwashCount').textContent = handwashCount;
    document.getElementById('waterProgress').textContent = waterCount;
    document.getElementById('handwashProgress').textContent = handwashCount;

    // Update progress segments
    updateProgressSegments('water', waterCount, waterGoal);
    updateProgressSegments('handwash', handwashCount, handwashGoal);

    // Update motivation
    const totalProgress = ((waterCount + handwashCount) / (waterGoal + handwashGoal)) * 100;
    const motivationText = document.getElementById('motivationText');
    if (motivationText) {
        if (totalProgress >= 100) {
            motivationText.textContent = 'Excellent! You have completed today.';
        } else if (totalProgress >= 75) {
            motivationText.textContent = 'Great progress! Keep going.';
        } else if (totalProgress >= 50) {
            motivationText.textContent = 'Halfway there. Continue your habits.';
        } else if (totalProgress > 0) {
            motivationText.textContent = 'Good start! Keep building habits.';
        } else {
            motivationText.textContent = 'Start your habits today.';
        }
    }

    // Update visual trackers
    updateVisualTracker('waterVisual', waterCount, waterGoal);
    updateVisualTracker('handwashVisual', handwashCount, handwashGoal);
}

function updateProgressSegments(type, count, goal) {
    for (let i = 1; i <= goal; i++) {
        const segment = document.getElementById(type + 'Segment' + i);
        if (segment) {
            if (i <= count) {
                segment.classList.add('filled');
            } else {
                segment.classList.remove('filled');
            }
        }
    }
}

function updateVisualTracker(elementId, count, goal) {
    const container = document.getElementById(elementId);
    if (!container) return;

    container.innerHTML = '';
    for (let i = 0; i < goal; i++) {
        const dot = document.createElement('div');
        dot.className = 'tracker-dot' + (i < count ? ' active' : '');
        container.appendChild(dot);
    }
}

// ==================== WATER CALCULATOR ====================
function initWaterCalculator() {
    calculateWater();
}

function calculateWater() {
    const bathTime = parseFloat(document.getElementById('bathTime')?.value || 10);
    const dishTime = parseFloat(document.getElementById('dishTime')?.value || 15);
    const laundryFreq = parseFloat(document.getElementById('laundryFreq')?.value || 3);
    const cookingWater = parseFloat(document.getElementById('cookingWater')?.value || 5);

    document.getElementById('bathValue').textContent = Math.round(bathTime);
    document.getElementById('dishValue').textContent = Math.round(dishTime);
    document.getElementById('laundryValue').textContent = Math.round(laundryFreq);
    document.getElementById('cookingValue').textContent = Math.round(cookingWater);

    const bathUsage = bathTime * 10;
    const dishUsage = dishTime * 5;
    const laundryUsage = (laundryFreq * 50) / 7;
    const cookingUsage = cookingWater;
    const dailyTotal = bathUsage + dishUsage + laundryUsage + cookingUsage;

    document.getElementById('bathUsage').textContent = Math.round(bathUsage);
    document.getElementById('dishUsage').textContent = Math.round(dishUsage);
    document.getElementById('laundryUsage').textContent = Math.round(laundryUsage);
    document.getElementById('cookingUsageDisplay').textContent = Math.round(cookingUsage);
    document.getElementById('totalUsage').textContent = Math.round(dailyTotal);

    const usageMessage = document.getElementById('usageMessage');
    if (usageMessage) {
        if (dailyTotal < 150) {
            usageMessage.textContent = 'Excellent efficiency. You are well below typical usage.';
        } else if (dailyTotal < 200) {
            usageMessage.textContent = 'Good usage. Average household uses 250–300L/day.';
        } else {
            usageMessage.textContent = 'Consider water-saving strategies. Opportunities exist to reduce.';
        }
    }
}

// ==================== ECO TIPS ====================
const ecoTips = [
    { text: 'Turn off the tap while brushing your teeth', impact: 'Save 6 liters per minute', category: 'Water' },
    { text: 'Use a bucket instead of running water for cleaning', impact: 'Save 50–100 liters daily', category: 'Water' },
    { text: 'Fix leaky taps immediately', impact: 'Prevent 20 liters waste per day', category: 'Water' },
    { text: 'Switch to LED bulbs', impact: 'Reduce energy by 75%', category: 'Energy' },
    { text: 'Unplug devices when not in use', impact: 'Cut standby power waste', category: 'Energy' },
    { text: 'Carry a reusable water bottle', impact: 'Eliminate 167 plastic bottles per year', category: 'Waste' },
    { text: 'Use cloth bags instead of plastic', impact: 'Prevent 500 plastic bags per year', category: 'Waste' },
];

let currentTipIndex = 0;
let currentCategory = 'All';

function initEcoTips() {
    displayTip(0);
}

function filterTips(category) {
    currentCategory = category;
    
    const buttons = document.querySelectorAll('.segmented-item');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === category) {
            btn.classList.add('active');
        }
    });

    const filteredTips = category === 'All' 
        ? ecoTips 
        : ecoTips.filter(t => t.category === category);
    
    if (filteredTips.length > 0) {
        displayTip(ecoTips.indexOf(filteredTips[0]));
    }
}

function generateNewTip() {
    const filteredTips = currentCategory === 'All' 
        ? ecoTips 
        : ecoTips.filter(t => t.category === currentCategory);
    
    const randomIndex = Math.floor(Math.random() * filteredTips.length);
    displayTip(ecoTips.indexOf(filteredTips[randomIndex]));
}

function displayTip(index) {
    const tip = ecoTips[index];
    document.getElementById('tipCategory').textContent = tip.category;
    document.getElementById('tipText').textContent = tip.text;
    document.getElementById('tipImpact').textContent = 'Impact: ' + tip.impact;
}

// ==================== DAILY CHECKLIST ====================
const checklistItems = [
    { id: 1, text: 'Drink sufficient water (8 glasses)' },
    { id: 2, text: 'Handwashing (6 times minimum)' },
    { id: 3, text: 'Avoid plastic bottles' },
    { id: 4, text: 'Save electricity' },
    { id: 5, text: 'Reduce water usage' },
    { id: 6, text: 'Use reusable bags' },
];

let checkedItems = [];

function initDailyChecklist() {
    const dateEl = document.getElementById('checklistDate');
    if (dateEl) {
        const today = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateEl.textContent = today;
    }

    const saved = localStorage.getItem('dailyChecklist');
    if (saved) {
        const data = JSON.parse(saved);
        const today = new Date().toDateString();
        if (data.date === today) {
            checkedItems = data.checked || [];
        }
    }

    renderChecklist();
}

function renderChecklist() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    taskList.innerHTML = '';
    checklistItems.forEach(item => {
        const isChecked = checkedItems.includes(item.id);
        const taskEl = document.createElement('div');
        taskEl.className = 'task-item' + (isChecked ? ' completed' : '');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isChecked;
        checkbox.addEventListener('change', () => toggleTask(item.id));
        
        const label = document.createElement('label');
        label.className = 'task-label';
        label.textContent = item.text;
        label.style.cursor = 'pointer';
        
        taskEl.appendChild(checkbox);
        taskEl.appendChild(label);
        taskList.appendChild(taskEl);
    });

    updateChecklistProgress();
}

function toggleTask(id) {
    if (checkedItems.includes(id)) {
        checkedItems = checkedItems.filter(item => item !== id);
    } else {
        checkedItems.push(id);
    }

    const today = new Date().toDateString();
    localStorage.setItem('dailyChecklist', JSON.stringify({
        date: today,
        checked: checkedItems
    }));

    renderChecklist();
}

function updateChecklistProgress() {
    const completionRate = Math.round((checkedItems.length / checklistItems.length) * 100);
    const percentageEl = document.getElementById('completionPercentage');
    if (percentageEl) {
        percentageEl.textContent = completionRate + '%';
    }

    // Update progress segments
    const segmentCount = 6;
    for (let i = 1; i <= segmentCount; i++) {
        const segment = document.getElementById('segment' + i);
        if (segment) {
            const filledCount = Math.round((completionRate / 100) * checklistItems.length);
            if (i <= filledCount) {
                segment.classList.add('filled');
            } else {
                segment.classList.remove('filled');
            }
        }
    }
}

// ==================== CONTACT FORM INITIALIZATION ====================
function initContactForm() {
    const starBtns = document.querySelectorAll('.star-btn');
    starBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const rating = this.dataset.rating;
            
            // Update star visuals
            starBtns.forEach((b, index) => {
                if (index < rating) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });
            
            // Update text
            const ratingText = document.getElementById('ratingText');
            if (ratingText) {
                ratingText.textContent = rating + ' star' + (rating > 1 ? 's' : '');
            }
        });
    });

    // Connect the submit button to our validation function
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', submitFeedback);
    }
}

// ==================== IMPROVED VALIDATION LOGIC ====================
function submitFeedback(e) {
    e.preventDefault();
    
    // Clear previous errors and reset styles
    document.querySelectorAll('.error-msg').forEach(el => el.remove());
    const fields = ['userName', 'userEmail', 'userFeedback'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.borderColor = '';
    });

    const nameField = document.getElementById('userName');
    const emailField = document.getElementById('userEmail');
    const messageField = document.getElementById('userFeedback');
    
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Helper to inject error messages
    const showError = (field, text) => {
        const error = document.createElement('div');
        error.className = 'error-msg';
        error.textContent = text;
        error.style.cssText = 'color: #ff4d4d; font-size: 12px; margin-top: 5px; font-family: sans-serif;';
        
        field.parentNode.insertBefore(error, field.nextSibling);
        field.style.borderColor = '#ff4d4d';
        field.focus();
    };

    // Validation checks
    if (name.length < 2) return showError(nameField, 'Please enter your name.');
    if (!emailPattern.test(email)) return showError(emailField, 'Please enter a valid email.');
    if (message.length < 10) return showError(messageField, 'Message must be 10+ characters.');

    // Success!
    alert('Thank you for your feedback, ' + name + '!');
    document.getElementById('contactForm').reset();
    
    // Clear rating text and stars after submission
    const ratingText = document.getElementById('ratingText');
    if (ratingText) ratingText.textContent = '';
    document.querySelectorAll('.star-btn').forEach(btn => btn.classList.remove('active'));
}

// Run the setup when the script loads
initContactForm();