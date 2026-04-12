// Main Application Logic

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
    
    // Add animation on scroll
    initScrollAnimations();
    
    console.log('🎓 Kids Learning Platform initialized successfully!');
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close menu when clicking on a link
        const links = mobileMenu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

/**
 * Generate Story Function (AI Lab)
 */
function generateStory() {
    const topicInput = document.getElementById('story-topic');
    const storyResult = document.getElementById('story-result');
    const storyContent = document.getElementById('story-content');
    
    const topic = topicInput.value.trim();
    
    if (!topic) {
        alert('⚠️ الرجاء إدخال موضوع للقصة!');
        return;
    }
    
    // Simulate AI story generation with templates
    const stories = [
        `كان يا ما كان، في عالم رقمي بعيد، lived ${topic}. كان هذا ${topic} يحب مساعدة الأطفال على التعلم. كل يوم، يكتشف ${topic} مغامرة جديدة ويتعلم مهارات رقمية رائعة. وفي نهاية كل مغامرة، يصبح ${topic} أكثر ذكاءً وسعادة!`,
        
        `في يوم من الأيام، قرر ${topic} أن يبدأ رحلة تعلم مثيرة. التقى بالعديد من الأصدقاء الرقباء الذين علموه عن الحاسوب والإنترنت والبرمجة. معاً، بنوا مشاريع رائعة واستمتعوا بوقتهم!`,
        
        `🌟 قصة ${topic} 🌟\n\nبدأت القصة عندما اكتشف ${topic} عالماً جديداً مليئاً بالتقنية والإبداع. تعلم ${topic} كيف يستخدم الحاسوب ببراعة، وكيف يتصفح الإنترنت بأمان، وحتى كيف يبرمج ألعابه الخاصة!\n\nوالنهاية كانت سعيدة، لأن ${topic} أصبح بطلاً رقمياً يُحتذى به! 🎉`,
        
        `مرة واحدة، كان هناك ${topic} شجاع ومحب للتعلم. واجه ${topic} تحديات كثيرة، لكن باستخدام المهارات الرقمية التي تعلمها، تمكن من حلها جميعاً. الدرس المستفاد: التعلم المستمر هو المفتاح للنجاح! 💪`
    ];
    
    // Pick a random story template
    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    
    // Show loading state
    storyContent.innerHTML = '<div class="spinner mx-auto"></div>';
    storyResult.classList.remove('hidden');
    
    // Simulate API delay
    setTimeout(() => {
        storyContent.textContent = randomStory;
        
        // Add celebration animation
        storyResult.classList.add('animate-pulse');
        setTimeout(() => storyResult.classList.remove('animate-pulse'), 1000);
    }, 1000);
    
    // Clear input
    topicInput.value = '';
}

/**
 * Get Learning Advice Function (AI Lab)
 */
function getAdvice() {
    const topicSelect = document.getElementById('advice-topic');
    const adviceResult = document.getElementById('advice-result');
    const adviceContent = document.getElementById('advice-content');
    
    const topic = topicSelect.value;
    
    if (!topic) {
        alert('⚠️ الرجاء اختيار موضوع للحصول على نصيحة!');
        return;
    }
    
    // Advice templates based on topic
    const advices = {
        computer: `💻 نصائح لتعلم الحاسوب:\n\n1. ابدأ بتعلم أجزاء الحاسوب الأساسية (الشاشة، لوحة المفاتيح، الفأرة)\n2. تدرب على استخدام البرامج البسيطة مثل Paint و Word\n3. خصص وقتاً يومياً للتدريب (20-30 دقيقة كافية)\n4. لا تخف من التجربة والخطأ - فهذا جزء من التعلم!\n5. شاهد فيديوهات تعليمية مخصصة للأطفال`,
        
        internet: `🌐 نصائح لاستخدام الإنترنت بأمان:\n\n1. لا تشارك معلوماتك الشخصية أبداً (الاسم، العنوان، رقم الهاتف)\n2. استخدم كلمات مرور قوية ومعقدة\n3. استشر والديك دائماً قبل زيارة مواقع جديدة\n4. لا تفتح روابط أو ملفات من مصادر مجهولة\n5. تذكر: ليس كل ما على الإنترنت صحيح - تحقق من المعلومات!`,
        
        programming: `🤖 نصائح لتعلم البرمجة:\n\n1. ابدأ بمنصات تعليمية مثل Scratch أو Code.org\n2. تعلّم التفكير البرمجي قبل كتابة الكود\n3. ابدأ بمشاريع صغيرة وبسيطة\n4. لا تستسلم عندما تواجه مشكلة - ابحث عن الحل!\n5. شارك مشاريعك مع الآخرين وتعلم منهم\n6. التدرب يومياً ولو لمدة قصيرة أفضل من التدرب مرة واحدة أسبوعياً`,
        
        ai: `🧠 نصائح لفهم الذكاء الاصطناعي:\n\n1. اعلم أن الذكاء الاصطناعي يتعلم من الأمثلة والبيانات\n2. جرب أدوات الذكاء الاصطناعي المخصصة للأطفال (مثل Quick Draw)\n3. فكّر في كيفية استخدام الذكاء الاصطناعي لحل مشاكل حقيقية\n4. تعلم الفرق بين الذكاء الاصطناعي والذكاء البشري\n5. استخدم الذكاء الاصطناعي كأداة مساعدة، وليس كبديل للتفكير`
    };
    
    const advice = advices[topic];
    
    // Show loading state
    adviceContent.innerHTML = '<div class="spinner mx-auto"></div>';
    adviceResult.classList.remove('hidden');
    
    // Simulate API delay
    setTimeout(() => {
        adviceContent.textContent = advice;
        
        // Add celebration animation
        adviceResult.classList.add('animate-pulse');
        setTimeout(() => adviceResult.classList.remove('animate-pulse'), 1000);
    }, 1000);
    
    // Reset select
    topicSelect.value = '';
}

/**
 * Save Progress to LocalStorage
 */
function saveProgress(progressData) {
    try {
        localStorage.setItem('kidsLearningProgress', JSON.stringify(progressData));
        return true;
    } catch (e) {
        console.error('Error saving progress:', e);
        return false;
    }
}

/**
 * Load Progress from LocalStorage
 */
function loadProgress() {
    try {
        const saved = localStorage.getItem('kidsLearningProgress');
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        console.error('Error loading progress:', e);
        return null;
    }
}

/**
 * Clear Progress (for reset)
 */
function clearProgress() {
    try {
        localStorage.removeItem('kidsLearningProgress');
        return true;
    } catch (e) {
        console.error('Error clearing progress:', e);
        return false;
    }
}

/**
 * Show Toast Notification
 */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 left-4 px-6 py-3 rounded-xl text-white font-bold shadow-lg transform transition-all duration-300 translate-y-20 opacity-0 z-50`;
    
    const colors = {
        success: 'bg-gradient-to-r from-green-500 to-emerald-500',
        error: 'bg-gradient-to-r from-red-500 to-rose-500',
        info: 'bg-gradient-to-r from-blue-500 to-indigo-500'
    };
    
    toast.classList.add(colors[type]);
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-y-20', 'opacity-0');
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
