// Theme Switcher
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';

// Apply saved theme on page load (синхронизируем html и body)
if (currentTheme === 'light') {
    document.documentElement.classList.add('light-theme');
    document.body.classList.add('light-theme');
    themeIcon.textContent = '☀️';
    console.log('✅ Светлая тема загружена из памяти');
} else {
    console.log('✅ Темная тема загружена из памяти');
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-theme');
    document.body.classList.toggle('light-theme');
    
    // Update icon and save preference
    if (document.body.classList.contains('light-theme')) {
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'light');
        console.log('💾 Светлая тема сохранена');
    } else {
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
        console.log('💾 Темная тема сохранена');
    }
});

