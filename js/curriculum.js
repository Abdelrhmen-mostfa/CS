// Curriculum Rendering Engine

/**
 * Render all week cards to the DOM
 */
function renderWeeks() {
    const container = document.getElementById('weeks-container');
    
    if (!container || !curriculumData || !curriculumData.weeks) {
        console.error('Curriculum data not found');
        return;
    }
    
    container.innerHTML = '';
    
    curriculumData.weeks.forEach((week, index) => {
        const card = createWeekCard(week, index);
        container.appendChild(card);
    });
}

/**
 * Create a single week card element
 */
function createWeekCard(week, index) {
    const card = document.createElement('div');
    card.className = 'week-card bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-transparent hover:border-primary/20';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Color mapping for different weeks
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600'
    };
    
    const badgeColors = {
        blue: 'badge-blue',
        green: 'badge-green',
        purple: 'badge-purple',
        orange: 'badge-orange'
    };
    
    const gradientClass = colorClasses[week.color] || colorClasses.blue;
    const badgeClass = badgeColors[week.color] || badgeColors.blue;
    
    // Calculate progress for this week
    const completedTasks = week.tasks.filter(t => t.completed).length;
    const totalTasks = week.tasks.length;
    const progressPercent = Math.round((completedTasks / totalTasks) * 100);
    
    card.innerHTML = `
        <!-- Card Header -->
        <div class="bg-gradient-to-r ${gradientClass} p-6 text-white">
            <div class="flex items-center justify-between mb-4">
                <div class="text-5xl">${week.icon}</div>
                <span class="badge ${badgeClass}">${progressPercent}% مكتمل</span>
            </div>
            <h3 class="text-xl font-bold mb-2">${week.title}</h3>
            <p class="text-white/80 text-sm">${week.lesson.title}</p>
        </div>
        
        <!-- Card Body -->
        <div class="p-6">
            <!-- Lesson Section -->
            <div class="mb-6">
                <h4 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span>📖</span> درس الأسبوع
                </h4>
                <p class="text-gray-600 text-sm leading-relaxed mb-4">${week.lesson.explanation}</p>
                
                <!-- Concepts List -->
                <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-100">
                    <h5 class="font-semibold text-gray-700 mb-3 text-sm flex items-center gap-2">
                        <span class="text-lg">💡</span> المفاهيم الأساسية:
                    </h5>
                    <ul class="space-y-2">
                        ${week.lesson.concepts.map(concept => `
                            <li class="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg px-3 py-2 shadow-sm">
                                <span class="text-green-500 font-bold mt-0.5">✓</span>
                                <span>${concept}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            
            <!-- Tasks Table -->
            <div class="mb-6">
                <h4 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span>✅</span> جدول المهام الأسبوعي
                </h4>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="bg-gray-100 rounded-lg">
                                <th class="px-3 py-2 text-right font-semibold text-gray-700 rounded-r-lg">اليوم</th>
                                <th class="px-3 py-2 text-right font-semibold text-gray-700">المهمة</th>
                                <th class="px-3 py-2 text-right font-semibold text-gray-700">الأداة</th>
                                <th class="px-3 py-2 text-right font-semibold text-gray-700">الوقت</th>
                                <th class="px-3 py-2 text-center font-semibold text-gray-700 rounded-l-lg">إنجاز</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${week.tasks.map((task, taskIndex) => `
                                <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                                    <td class="px-3 py-3 font-medium text-gray-700">${task.day}</td>
                                    <td class="px-3 py-3 text-gray-600">${task.task}</td>
                                    <td class="px-3 py-3 text-gray-500 text-xs">${task.tool}</td>
                                    <td class="px-3 py-3 text-gray-500 text-xs">${task.time}</td>
                                    <td class="px-3 py-3 text-center">
                                        <input 
                                            type="checkbox" 
                                            class="task-checkbox"
                                            data-week-id="${week.id}"
                                            data-task-index="${taskIndex}"
                                            ${task.completed ? 'checked' : ''}
                                            onchange="toggleTaskCompletion(${week.id}, ${taskIndex})"
                                        />
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Computer Activity -->
            <div class="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 class="font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <span>💻</span> ${week.computerActivity.title}
                </h4>
                <p class="text-blue-700 text-sm mb-3">${week.computerActivity.description}</p>
                <ol class="space-y-2">
                    ${week.computerActivity.steps.map((step, i) => `
                        <li class="flex items-start gap-2 text-sm text-blue-600">
                            <span class="bg-blue-200 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">${i + 1}</span>
                            <span>${step}</span>
                        </li>
                    `).join('')}
                </ol>
            </div>
            
            <!-- Research Task & Creative Challenge -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <h4 class="font-bold text-purple-800 mb-2 flex items-center gap-2">
                        <span>🔍</span> ${week.researchTask.title}
                    </h4>
                    <p class="text-purple-700 text-sm mb-3">${week.researchTask.topic}</p>
                    <ul class="space-y-2">
                        ${week.researchTask.questions.map(q => `
                            <li class="flex items-start gap-2 text-xs text-purple-600">
                                <span>•</span>
                                <span>${q}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="bg-pink-50 rounded-xl p-4 border border-pink-200">
                    <h4 class="font-bold text-pink-800 mb-2 flex items-center gap-2">
                        <span>🎨</span> ${week.creativeChallenge.title}
                    </h4>
                    <p class="text-pink-700 text-sm">${week.creativeChallenge.description}</p>
                </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                    class="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                    style="width: ${progressPercent}%"
                ></div>
            </div>
            <p class="text-xs text-gray-500 mt-2 text-center">${completedTasks} من ${totalTasks} مهام مكتملة</p>
        </div>
    `;
    
    return card;
}

/**
 * Toggle task completion status
 */
function toggleTaskCompletion(weekId, taskIndex) {
    const week = curriculumData.weeks.find(w => w.id === weekId);
    
    if (week && week.tasks[taskIndex]) {
        // Toggle completion status
        week.tasks[taskIndex].completed = !week.tasks[taskIndex].completed;
        
        // Save to localStorage
        saveProgress(curriculumData);
        
        // Update UI
        updateProgressDisplay();
        renderWeeks();
        
        // Show celebration toast
        if (week.tasks[taskIndex].completed) {
            showToast('🎉 أحسنت! مهمة مكتملة!', 'success');
        }
    }
}

/**
 * Update progress display in header and parents section
 */
function updateProgressDisplay() {
    let totalTasks = 0;
    let completedTasks = 0;
    
    curriculumData.weeks.forEach(week => {
        week.tasks.forEach(task => {
            totalTasks++;
            if (task.completed) completedTasks++;
        });
    });
    
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Update header progress
    const headerProgress = document.getElementById('total-progress');
    if (headerProgress) {
        headerProgress.textContent = `${overallProgress}%`;
    }
    
    // Update parents section progress
    const parentProgress = document.getElementById('parent-progress');
    const parentProgressBar = document.getElementById('parent-progress-bar');
    if (parentProgress) {
        parentProgress.textContent = `${overallProgress}%`;
    }
    if (parentProgressBar) {
        parentProgressBar.style.width = `${overallProgress}%`;
    }
}

/**
 * Initialize curriculum on page load
 */
function initCurriculum() {
    // Load saved progress from localStorage
    const savedProgress = loadProgress();
    
    if (savedProgress && savedProgress.weeks) {
        // Merge saved progress with curriculum data
        savedProgress.weeks.forEach((savedWeek, index) => {
            if (curriculumData.weeks[index]) {
                savedWeek.tasks.forEach((savedTask, taskIndex) => {
                    if (curriculumData.weeks[index].tasks[taskIndex]) {
                        curriculumData.weeks[index].tasks[taskIndex].completed = savedTask.completed;
                    }
                });
            }
        });
    }
    
    // Render weeks
    renderWeeks();
    
    // Update progress display
    updateProgressDisplay();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initCurriculum);
