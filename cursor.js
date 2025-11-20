// Custom Cursor - Ultra Smooth Follow
const cursor = document.querySelector('.cursor-arrow');
const gameModal = document.getElementById('gameModal');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let velocityX = 0;
let velocityY = 0;

// Настройки плавности (работает на любой чувствительности мыши)
const smoothness = 0.18; // Основная плавность
const damping = 0.85; // Затухание для инерции
const minSpeed = 0.01; // Минимальная скорость для остановки

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add('visible');
});

// Супер плавное следование с инерцией
function animateCursor() {
    // Рассчитываем расстояние до цели
    const distX = mouseX - cursorX;
    const distY = mouseY - cursorY;
    
    // Добавляем ускорение к скорости
    velocityX += distX * smoothness;
    velocityY += distY * smoothness;
    
    // Применяем затухание (damping) для плавности
    velocityX *= damping;
    velocityY *= damping;
    
    // Останавливаем если скорость очень маленькая
    if (Math.abs(velocityX) < minSpeed) velocityX = 0;
    if (Math.abs(velocityY) < minSpeed) velocityY = 0;
    
    // Обновляем позицию
    cursorX += velocityX;
    cursorY += velocityY;
    
    // Применяем трансформацию (быстрее чем left/top)
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Click effect
document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
});

document.addEventListener('mouseup', () => {
    cursor.classList.remove('click');
});

// Hide custom cursor when game modal is open
const checkGameModal = () => {
    if (gameModal.classList.contains('active')) {
        cursor.style.display = 'none';
    } else {
        cursor.style.display = 'block';
    }
};

// Check on modal changes
const observer = new MutationObserver(checkGameModal);
observer.observe(gameModal, { attributes: true, attributeFilter: ['class'] });

// Add hover effects
document.querySelectorAll('a, .letter, .experience-card, .tech-item, .filter-btn, .work-item, #pixelCanvas, .theme-toggle, .lang-toggle').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

