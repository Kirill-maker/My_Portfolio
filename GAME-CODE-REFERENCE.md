# 🎮 Trash Runner - Полная документация кода

## 📁 Файл: `js/game.js`

## 📐 Основные координаты и размеры

### Canvas
```javascript
this.canvas.width = 800;   // Ширина игрового поля
this.canvas.height = 400;  // Высота игрового поля
```

### Земля
```javascript
this.groundY = 300;  // Координата Y линии земли
```

### Персонаж (Player)
```javascript
this.player = {
    x: 100,              // Позиция по X (не меняется)
    y: 220,              // Позиция по Y (верхняя точка персонажа)
    width: 32,           // Ширина hitbox
    height: 80,          // Высота hitbox (стоя)
    normalHeight: 80,    // Высота в обычном состоянии
    crouchHeight: 40,    // Высота при приседе
    velocityY: 0,        // Скорость по Y (для прыжка)
    jumpPower: -16,      // Сила прыжка (отрицательная = вверх)
    gravity: 0.8         // Гравитация (притягивает вниз)
}

// Расчет позиции на земле:
this.playerGroundY = this.groundY - this.player.height;
// = 300 - 80 = 220
```

### Мусорки (Obstacles)
```javascript
{
    x: 800,                          // Появляются справа
    y: this.groundY - trashHeight,   // = 300 - 40 = 260
    width: 32,                       // Ширина мусорки
    height: 40                       // Высота мусорки
}
```

### Птицы (Birds)
```javascript
{
    x: 800,                    // Появляются справа
    y: 100 + Math.random() * 60,  // Случайная высота 100-160
    width: 24,                 // Ширина птицы
    height: 12                 // Высота птицы
}
```

## ⚙️ Настройки геймплея

### Скорость
```javascript
this.baseSpeed = 4;           // Начальная скорость
this.speed = 4;               // Текущая скорость

// Увеличение скорости:
this.speed = this.baseSpeed + Math.floor(this.score / 150);
// Каждые 150 очков скорость +1
```

### Частота появления препятствий
```javascript
// Мусорки
this.obstacleInterval = 90;         // Базовый интервал (кадры)
obstacleFrequency = this.score >= 400 ? 50 : 70;  // Частота на разных уровнях
// Случайность: + Math.random() * 40

// Птицы (после 300 очков)
this.birdInterval = 150;
birdFrequency = this.score >= 400 ? 80 : 120;
// Случайность: + Math.random() * 60
```

### Физика прыжка
```javascript
jumpPower: -16,    // Начальная скорость прыжка (чем больше = выше)
gravity: 0.8       // Притяжение вниз (чем больше = быстрее падает)

// Каждый кадр:
this.player.velocityY += this.player.gravity;  // Ускорение вниз
this.player.y += this.player.velocityY;        // Применение скорости
```

## 🎨 Рисование персонажа

### Функция drawPlayer()

#### Параметры рисования:
```javascript
const s = 2;  // Размер одного "пикселя" (квадрат 2x2px)

const drawPixel = (x, y, color) => {
    ctx.fillRect(p.x + x * s, p.y + y * s, s, s);
};

// Пример:
drawPixel(5, 10, '#FF0000');  
// Рисует красный квадрат 2x2 на позиции (5*2, 10*2) относительно персонажа
```

### Структура персонажа (координаты Y):

```
Y=0-2:    Волосы (голубые)
Y=2-4:    Наушники (белые боковые части)
Y=3-7:    Лицо (кожа)
Y=4:      Глаза (темные точки)
Y=6:      Рот (темная линия)
Y=8:      Шея (кожа)
Y=9-18:   Тело (белая рубашка)
Y=10-16:  Руки (кожа, с анимацией)
Y=19-26:  Штаны (темные)
Y=27-36:  Ноги (с анимацией)
Y=37-38:  Обувь (черная)
```

### Анимация рук:
```javascript
const armSwing = run === 0 ? -2 : 2;  // -2 или +2 пикселя

// Левая рука
for (let y = 10; y <= 16; y++) {
    drawPixel(1, y + armSwing, c.skin);  // Двигается вверх-вниз
}
```

### Анимация ног:
```javascript
const legKick = run === 0 ? -1 : 1;  // -1 или +1 пиксель

// Левая нога
for (let y = 27; y <= 36; y++) {
    drawPixel(5 + legKick, y, c.pants);  // Двигается влево-вправо
}
```

### Персонаж при приседе:
```javascript
if (p.isCrouching) {
    // Рисуется укороченная версия (высота ~20 пикселей вместо 38)
    // Голова, тело, согнутые ноги
    // Обувь остается на той же Y координате (НА ЗЕМЛЕ!)
}
```

## 🗑️ Рисование мусорки

### Функция drawObstacle(obstacle)

```javascript
const s = 4;  // Размер пикселя мусорки (4x4px)

// Структура:
Y=0-1:   Крышка (серая)
Y=2-8:   Тело баки (темно-серое)
Y=4,5:   Ржавчина (коричневая)
Y=6,7:   Вмятины (темные)
```

### Цвета мусорки:
```javascript
body: '#4a4a4a',   // Основной серый
dark: '#2a2a2a',   // Темный серый
lid: '#3a3a3a',    // Крышка
rust: '#8B4513'    // Ржавчина (коричневый)
```

## 🐦 Рисование птицы

### Функция drawBird(bird)

```javascript
const s = 3;  // Размер пикселя птицы (3x3px)

// Структура:
Y=0-1:   Голова + клюв
Y=1-3:   Тело
Y=0-3:   Крылья (анимация!)
Y=2:     Хвост
```

### Анимация крыльев:
```javascript
const wingFlap = Math.floor((this.score * 2) % 8) < 4 ? 0 : 1;

if (wingFlap === 0) {
    // Крылья вверх (позиции Y=0-1)
} else {
    // Крылья вниз (позиции Y=2-3)
}
```

## 🎯 Система коллизий

### Функция checkCollision(player, obstacle)

```javascript
checkCollision(player, obstacle) {
    return player.x < obstacle.x + obstacle.width &&    // Левый край игрока < правого края препятствия
           player.x + player.width > obstacle.x &&      // Правый край игрока > левого края препятствия
           player.y < obstacle.y + obstacle.height &&   // Верх игрока < низа препятствия
           player.y + player.height > obstacle.y;       // Низ игрока > верха препятствия
}
```

**Визуализация:**
```
Коллизия ЕСТЬ если ВСЕ 4 условия TRUE:

Player:  [====]
            ↓ пересекается
Obstacle:   [====]
```

### Отладка hitbox:
```javascript
// В функции drawPlayer() раскомментируй:
ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
ctx.lineWidth = 2;
ctx.strokeRect(p.x, p.y, p.width, p.height);  // Красная рамка
```

## 🎮 Управление (код)

### Прыжок
```javascript
jump() {
    if (!this.player.isJumping && !this.gameOver && !this.player.isCrouching) {
        this.player.velocityY = this.player.jumpPower;  // -16 (вверх)
        this.player.isJumping = true;
    }
}
```

### Присед
```javascript
crouch() {
    this.player.isCrouching = true;
    this.player.height = this.player.crouchHeight;  // 80 → 40
    // Поднимаем Y чтобы низ остался на месте:
    this.player.y = this.playerGroundY + (this.player.normalHeight - this.player.crouchHeight);
    // = 220 + (80 - 40) = 260
}

standUp() {
    this.player.isCrouching = false;
    this.player.height = this.player.normalHeight;  // 40 → 80
    this.player.y = this.playerGroundY;  // = 220
}
```

## 🎨 Рисование фона

### Небо
```javascript
drawSky() {
    // Градиент голубой
    const gradient = ctx.createLinearGradient(0, 0, 0, this.groundY);
    gradient.addColorStop(0, '#87CEEB');   // Светло-голубой вверху
    gradient.addColorStop(1, '#B0C4DE');   // Темнее внизу
    
    // Облака (движутся медленно)
    const cloudX = (this.score * 0.5) % (this.canvas.width + 100);
}
```

### Земля
```javascript
drawGround() {
    ctx.fillStyle = '#8B7355';  // Коричневая земля
    ctx.fillRect(0, this.groundY, width, height);
    
    // Линия земли (темнее)
    ctx.fillStyle = '#6B5345';
    ctx.fillRect(0, this.groundY, width, 3);
    
    // Движущийся мусор
    const x = (i * 30 + this.score * 2) % this.canvas.width;
}
```

## 📊 Система очков и уровней

### Начисление очков
```javascript
this.score += 0.1;  // Каждый кадр +0.1 очка
```

### Уровни сложности
```javascript
// Level 1: 0-299
if (this.score < 300) {
    // Только мусорки
}

// Level 2: 300-399
if (this.score >= 300 && this.score < 400) {
    // + Птицы начинают появляться
    console.log('🔥 Уровень 2! Появляются птицы!');
}

// Level 3: 400+
if (this.score >= 400) {
    // Максимальная сложность
    console.log('🔥 Уровень 3! Максимальная сложность!');
}
```

### Сохранение рекорда
```javascript
// Сохранение
localStorage.setItem('trashRunnerHighScore', this.highScore);

// Загрузка
this.highScore = parseInt(localStorage.getItem('trashRunnerHighScore')) || 0;
```

## 🔄 Игровой цикл

### Структура gameLoop()
```javascript
gameLoop() {
    if (!this.isRunning) return;  // Если игра остановлена - выход
    
    this.update();  // 1. Обновление физики и логики
    this.draw();    // 2. Отрисовка кадра
    
    requestAnimationFrame(() => this.gameLoop());  // 3. Следующий кадр
}
```

### Функция update()
```javascript
update() {
    // 1. Обновление счета
    this.score += 0.1;
    
    // 2. Физика игрока
    this.player.velocityY += this.player.gravity;
    this.player.y += this.player.velocityY;
    
    // 3. Проверка земли
    if (this.player.y >= this.playerGroundY) {
        this.player.y = this.playerGroundY;
        this.player.isJumping = false;
    }
    
    // 4. Создание мусорок
    if (this.obstacleTimer > this.obstacleInterval) {
        this.obstacles.push({...});
    }
    
    // 5. Движение мусорок
    this.obstacles[i].x -= this.speed;
    
    // 6. Проверка коллизий
    if (this.checkCollision(...)) {
        this.gameOver = true;
    }
}
```

### Функция draw()
```javascript
draw() {
    this.drawSky();        // 1. Небо с облаками
    this.drawGround();     // 2. Земля с мусором
    this.obstacles.forEach(...);  // 3. Мусорки
    this.birds.forEach(...);      // 4. Птицы
    this.drawPlayer();     // 5. Персонаж (поверх всего)
}
```

## 🛠️ Как изменить параметры

### Изменить сложность

**Сделать легче:**
```javascript
this.baseSpeed = 3;        // Было 4 (медленнее)
this.player.jumpPower = -18;  // Было -16 (прыгает выше)
this.gravity = 0.6;        // Было 0.8 (медленнее падает)
```

**Сделать сложнее:**
```javascript
this.baseSpeed = 6;        // Быстрее
this.obstacleInterval = 60;   // Чаще препятствия (было 90)
```

### Изменить размеры

**Персонаж больше (легче):**
```javascript
width: 32,   // Было 32 (hitbox шире)
height: 80   // Было 80 (hitbox выше)
```

**Персонаж меньше (сложнее):**
```javascript
width: 24,   // Уже
height: 60   // Ниже
```

**Мусорки меньше (легче):**
```javascript
height: 30   // Было 40 (легче перепрыгнуть)
```

### Изменить частоту появления

**Реже препятствия:**
```javascript
this.obstacleInterval = 120;  // Было 90 (больше времени между мусорками)
this.birdInterval = 200;      // Было 150 (реже птицы)
```

**Чаще препятствия:**
```javascript
this.obstacleInterval = 60;   // Меньше = чаще
this.birdInterval = 100;
```

### Изменить уровни

**Птицы появляются раньше:**
```javascript
if (this.score >= 200) {  // Было 300
    // Спавн птиц
}
```

**Птицы появляются позже:**
```javascript
if (this.score >= 500) {  // Было 300
    // Спавн птиц
}
```

## 🎨 Изменение графики

### Цвета неба
```javascript
gradient.addColorStop(0, '#FF69B4');  // Розовое небо
gradient.addColorStop(1, '#FFB6C1');
```

### Цвета земли
```javascript
ctx.fillStyle = '#228B22';  // Зеленая трава вместо коричневой
```

### Цвета персонажа
```javascript
const c = {
    cyan: '#FF1493',    // Розовые волосы вместо голубых
    skin: '#8B4513',    // Темная кожа
    white: '#FF0000',   // Красная рубашка
    pants: '#0000FF',   // Синие штаны
    // ...
}
```

## 🐛 Отладка

### Показать hitbox всех объектов
```javascript
// В draw() добавь:

// Персонаж
ctx.strokeStyle = 'red';
ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height);

// Мусорки
this.obstacles.forEach(obs => {
    ctx.strokeStyle = 'green';
    ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
});

// Птицы
this.birds.forEach(bird => {
    ctx.strokeStyle = 'blue';
    ctx.strokeRect(bird.x, bird.y, bird.width, bird.height);
});
```

### Вывод координат
```javascript
// В update() добавь:
if (Math.floor(this.score) % 10 === 0) {
    console.log('Player Y:', this.player.y, 'Height:', this.player.height);
    console.log('Ground Y:', this.groundY);
    console.log('Player bottom:', this.player.y + this.player.height);
}
```

### Бесконечная жизнь (для тестирования)
```javascript
// Закомментируй в update():
// if (this.checkCollision(...)) {
//     this.gameOver = true;
// }
```

## 📝 Быстрые фиксы

### Персонаж летает
```javascript
// Проверь:
this.playerGroundY = this.groundY - this.player.height;
// Должно быть: 300 - 80 = 220
```

### Урны летают
```javascript
// В spawn obstacles:
y: this.groundY - trashHeight,  // Должно: 300 - 40 = 260
```

### Персонаж слишком высоко/низко
```javascript
// Измени начальную позицию:
y: 220,  // Подбери значение
```

### Присед не работает
```javascript
// Проверь что обе функции вызываются:
crouch() { ... }  // При нажатии клавиши
standUp() { ... }  // При отпускании клавиши
```

### Персонаж рисуется странно
```javascript
// Проверь что все координаты в drawPixel положительные
// Проверь что размер s = 2 (не 0, не отрицательный)
```

## 🔢 Формулы

### Позиция низа объекта:
```javascript
bottom = y + height
```

### Проверка на землю:
```javascript
if (bottom >= groundY) {
    // Объект на земле
}
```

### Позиция объекта НА земле:
```javascript
y = groundY - height
```

### Центр объекта:
```javascript
centerX = x + width / 2
centerY = y + height / 2
```

## 📋 Чеклист для фикса

- [ ] Проверь `this.groundY` (должно быть ~300)
- [ ] Проверь `this.playerGroundY = groundY - height`
- [ ] Проверь что `player.y = playerGroundY` при reset()
- [ ] Проверь что урны: `y = groundY - trashHeight`
- [ ] Проверь размеры hitbox (width и height)
- [ ] Включи отладку hitbox (красные рамки)
- [ ] Проверь что `drawPixel` использует правильный size (s=2)

## 💡 Советы по отладке

1. **Включи визуализацию hitbox** - увидишь где проблема
2. **Выведи координаты в console.log** - проверь числа
3. **Используй бесконечную жизнь** - тестируй без game over
4. **Измени цвета** - легче увидеть что где рисуется

---

**Файлы игры:**
- `js/game.js` - основной код игры
- `js/pixel-art.js` - рендерер персонажа (НЕ используется в игре сейчас)

Удачи с фиксом! 🎮✨

