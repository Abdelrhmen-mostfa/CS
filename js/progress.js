// Progress Tracking Module

/**
 * Calculate overall progress statistics
 */
function calculateProgressStats() {
    if (!curriculumData || !curriculumData.weeks) {
        return {
            totalTasks: 0,
            completedTasks: 0,
            overallProgress: 0,
            weeksCompleted: 0,
            totalWeeks: 0
        };
    }
    
    let totalTasks = 0;
    let completedTasks = 0;
    let weeksCompleted = 0;
    
    curriculumData.weeks.forEach(week => {
        const weekTotal = week.tasks.length;
        const weekCompleted = week.tasks.filter(t => t.completed).length;
        
        totalTasks += weekTotal;
        completedTasks += weekCompleted;
        
        if (weekCompleted === weekTotal && weekTotal > 0) {
            weeksCompleted++;
        }
    });
    
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
        totalTasks,
        completedTasks,
        overallProgress,
        weeksCompleted,
        totalWeeks: curriculumData.weeks.length
    };
}

/**
 * Get progress breakdown by week
 */
function getWeeklyProgressBreakdown() {
    if (!curriculumData || !curriculumData.weeks) {
        return [];
    }
    
    return curriculumData.weeks.map(week => {
        const total = week.tasks.length;
        const completed = week.tasks.filter(t => t.completed).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return {
            weekId: week.id,
            weekTitle: week.title,
            icon: week.icon,
            color: week.color,
            totalTasks: total,
            completedTasks: completed,
            progress: percentage
        };
    });
}

/**
 * Get tasks due for a specific day
 */
function getTasksForDay(dayName) {
    if (!curriculumData || !curriculumData.weeks) {
        return [];
    }
    
    const tasks = [];
    
    curriculumData.weeks.forEach(week => {
        week.tasks.forEach((task, index) => {
            if (task.day === dayName) {
                tasks.push({
                    weekId: week.id,
                    weekTitle: week.title,
                    taskIndex: index,
                    task: task.task,
                    tool: task.tool,
                    time: task.time,
                    completed: task.completed
                });
            }
        });
    });
    
    return tasks;
}

/**
 * Get incomplete tasks
 */
function getIncompleteTasks() {
    if (!curriculumData || !curriculumData.weeks) {
        return [];
    }
    
    const tasks = [];
    
    curriculumData.weeks.forEach(week => {
        week.tasks.forEach((task, index) => {
            if (!task.completed) {
                tasks.push({
                    weekId: week.id,
                    weekTitle: week.title,
                    taskIndex: index,
                    task: task.task,
                    day: task.day
                });
            }
        });
    });
    
    return tasks;
}

/**
 * Get completed tasks
 */
function getCompletedTasks() {
    if (!curriculumData || !curriculumData.weeks) {
        return [];
    }
    
    const tasks = [];
    
    curriculumData.weeks.forEach(week => {
        week.tasks.forEach((task, index) => {
            if (task.completed) {
                tasks.push({
                    weekId: week.id,
                    weekTitle: week.title,
                    taskIndex: index,
                    task: task.task,
                    day: task.day,
                    completedAt: task.completedAt
                });
            }
        });
    });
    
    return tasks;
}

/**
 * Generate achievement badges based on progress
 */
function getAchievementBadges() {
    const stats = calculateProgressStats();
    const badges = [];
    
    // First Task Badge
    if (stats.completedTasks >= 1) {
        badges.push({
            name: '🌟 البداية الرائعة',
            description: 'أكملت مهمتك الأولى!',
            unlocked: true
        });
    }
    
    // Halfway Badge
    if (stats.overallProgress >= 50) {
        badges.push({
            name: '🚀 في منتصف الطريق',
            description: 'أكملت 50% من المهام!',
            unlocked: true
        });
    }
    
    // Week Champion Badge
    const weeklyProgress = getWeeklyProgressBreakdown();
    weeklyProgress.forEach(week => {
        if (week.progress === 100) {
            badges.push({
                name: `🏆 بطل ${week.weekTitle}`,
                description: 'أكملت جميع مهام هذا الأسبوع!',
                unlocked: true
            });
        }
    });
    
    // Completionist Badge
    if (stats.overallProgress === 100) {
        badges.push({
            name: '👑 الأسطورة الرقمية',
            description: 'أكملت جميع المهام في البرنامج!',
            unlocked: true
        });
    }
    
    // Consistency Badges
    const completedByDay = {};
    const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'];
    
    days.forEach(day => {
        const dayTasks = getTasksForDay(day);
        const completedDayTasks = dayTasks.filter(t => t.completed).length;
        if (completedDayTasks > 0) {
            completedByDay[day] = completedDayTasks;
        }
    });
    
    if (Object.keys(completedByDay).length >= 3) {
        badges.push({
            name: '⭐ المثابر',
            description: 'أنجزت مهام في 3 أيام مختلفة!',
            unlocked: true
        });
    }
    
    return badges;
}

/**
 * Render progress chart (simple text-based for static site)
 */
function renderProgressChart(containerId) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        return;
    }
    
    const weeklyProgress = getWeeklyProgressBreakdown();
    
    container.innerHTML = `
        <div class="space-y-4">
            ${weeklyProgress.map(week => `
                <div class="bg-white rounded-xl p-4 shadow-md">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <span class="text-2xl">${week.icon}</span>
                            <span class="font-bold text-gray-700 text-sm">${week.weekTitle}</span>
                        </div>
                        <span class="text-lg font-black text-${week.color}-600">${week.progress}%</span>
                    </div>
                    <div class="bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                            class="h-full bg-gradient-to-r from-${week.color}-500 to-${week.color}-600 rounded-full transition-all duration-500"
                            style="width: ${week.progress}%"
                        ></div>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">${week.completedTasks} من ${week.totalTasks} مهام</p>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Reset all progress (with confirmation)
 */
function resetAllProgress() {
    if (confirm('⚠️ هل أنت متأكد أنك تريد إعادة تعيين كل التقدم؟ لا يمكن التراجع عن هذا الإجراء!')) {
        curriculumData.weeks.forEach(week => {
            week.tasks.forEach(task => {
                task.completed = false;
            });
        });
        
        clearProgress();
        saveProgress(curriculumData);
        updateProgressDisplay();
        renderWeeks();
        
        showToast('تم إعادة تعيين التقدم بنجاح', 'info');
    }
}

/**
 * Export progress as JSON
 */
function exportProgress() {
    const stats = calculateProgressStats();
    const data = {
        exportDate: new Date().toISOString(),
        programName: curriculumData.programName,
        statistics: stats,
        weeklyProgress: getWeeklyProgressBreakdown(),
        achievements: getAchievementBadges()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('تم تصدير التقرير بنجاح!', 'success');
}

/**
 * Print progress report
 */
function printProgressReport() {
    window.print();
}

// Auto-save progress every 30 seconds
setInterval(() => {
    if (curriculumData) {
        saveProgress(curriculumData);
    }
}, 30000);
