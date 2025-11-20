// Trash Runner Game
class TrashRunnerGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.modal = document.getElementById('gameModal');
        this.scoreElement = document.getElementById('gameScore');
        this.highScoreElement = document.getElementById('gameHighScore');
        
        // Canvas size
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        // Game state
        this.isRunning = false;
        this.gameOver = false;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('trashRunnerHighScore')) || 0;
        this.speed = 4;
        this.baseSpeed = 4;
        
        // Ground
        this.groundY = 300;  // Линия земли
        this.playerGroundY = 220;  // Y позиция персонажа на земле (300 - 80)
        
        // Player
        this.player = {
            x: 100,
            y: this.playerGroundY,
            width: 32,
            height: 80,  // Высота персонажа
            velocityY: 0,
            isJumping: false,
            isCrouching: false,
            jumpPower: -16,
            gravity: 0.8,
            normalHeight: 80,
            crouchHeight: 40  // Высота приседа (половина)
        };
        
        // Obstacles
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.obstacleInterval = 90;
        
        // Birds (новое препятствие)
        this.birds = [];
        this.birdTimer = 0;
        this.birdInterval = 150;
        
        this.setupEventListeners();
        this.updateHighScore();
    }
    
    setupEventListeners() {
        // Open game on character click
        const pixelCanvas = document.getElementById('pixelCanvas');
        pixelCanvas.addEventListener('click', () => this.openGame());
        
        // Close button
        document.getElementById('gameClose').addEventListener('click', () => this.closeGame());
        
        // Game controls
        document.addEventListener('keydown', (e) => {
            if (!this.isRunning) return;
            
            if (e.code === 'Space') {
                e.preventDefault();
                this.jump();
            }
            
            // Приседание (ArrowDown или S)
            if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                e.preventDefault();
                this.crouch();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (!this.isRunning) return;
            
            // Встать после приседания
            if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                this.standUp();
            }
        });
        
        // Touch controls
        this.canvas.addEventListener('click', () => {
            if (this.isRunning) this.jump();
        });
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.isRunning) {
                // Верхняя половина - прыжок, нижняя - присед
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                const touchY = touch.clientY - rect.top;
                
                if (touchY < this.canvas.height / 2) {
                    this.jump();
                } else {
                    this.crouch();
                }
            }
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            if (this.isRunning) {
                this.standUp();
            }
        });
    }
    
    crouch() {
        if (!this.player.isJumping && !this.gameOver) {
            this.player.isCrouching = true;
            this.player.height = this.player.crouchHeight;
            // Голова опускается вниз, ноги остаются на земле
            // Поднимаем Y координату чтобы низ персонажа остался на месте
            this.player.y = this.playerGroundY + (this.player.normalHeight - this.player.crouchHeight);
        }
    }
    
    standUp() {
        if (this.player.isCrouching) {
            this.player.isCrouching = false;
            this.player.height = this.player.normalHeight;
            if (!this.player.isJumping) {
                this.player.y = this.playerGroundY;
            }
        }
    }
    
    openGame() {
        this.modal.classList.add('active');
        this.reset();
        this.isRunning = true;
        this.gameLoop();
    }
    
    closeGame() {
        this.modal.classList.remove('active');
        this.isRunning = false;
    }
    
    reset() {
        this.gameOver = false;
        this.score = 0;
        this.speed = this.baseSpeed;
        this.obstacles = [];
        this.birds = [];
        this.obstacleTimer = 0;
        this.birdTimer = 0;
        this.player.y = this.playerGroundY;
        this.player.velocityY = 0;
        this.player.isJumping = false;
        this.player.isCrouching = false;
        this.player.height = this.player.normalHeight;
        this.updateScore();
    }
    
    jump() {
        if (!this.player.isJumping && !this.gameOver && !this.player.isCrouching) {
            this.player.velocityY = this.player.jumpPower;
            this.player.isJumping = true;
            this.player.height = this.player.normalHeight;
        }
    }
    
    updateScore() {
        this.scoreElement.textContent = Math.floor(this.score);
        if (this.score > this.highScore) {
            this.highScore = Math.floor(this.score);
            localStorage.setItem('trashRunnerHighScore', this.highScore);
            this.updateHighScore();
        }
    }
    
    updateHighScore() {
        this.highScoreElement.textContent = this.highScore;
    }
    
    drawPlayer() {
        const ctx = this.ctx;
        const p = this.player;
        const s = 2; // размер пикселя
        
        // Цвета
        const c = {
            cyan: '#4ECDC4',
            skin: '#FFE5D9',
            skinDark: '#F5D5C9',
            white: '#FFFFFF',
            dark: '#2C3E50',
            pants: '#34495E',
            pantsDark: '#2a3a4a',
            shoe: '#2a2a2a',
            black: '#000000'
        };
        
        const drawPixel = (x, y, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(p.x + x * s, p.y + y * s, s, s);
        };
        
        // Анимация
        const run = Math.floor(this.score * 0.5) % 2;
        const armSwing = p.isJumping ? 0 : (run === 0 ? -2 : 2);
        const legKick = p.isJumping ? 0 : (run === 0 ? -1 : 1);
        
        if (p.isCrouching) {
            // ПРИСЕВШИЙ персонаж - голова опущена к ногам
            // Волосы (сверху)
            for (let x = 4; x <= 11; x++) drawPixel(x, 0, c.cyan);
            for (let x = 3; x <= 12; x++) drawPixel(x, 1, c.cyan);
            
            // Наушники
            drawPixel(2, 2, c.white);
            drawPixel(13, 2, c.white);
            
            // Лицо
            for (let y = 2; y <= 5; y++) {
                for (let x = 3; x <= 12; x++) drawPixel(x, y, c.skin);
            }
            
            // Глаза
            drawPixel(5, 3, c.dark);
            drawPixel(9, 3, c.dark);
            
            // Рот
            for (let x = 6; x <= 9; x++) drawPixel(x, 5, c.dark);
            
            // Тело согнутое (горизонтальное)
            for (let y = 6; y <= 11; y++) {
                for (let x = 2; x <= 13; x++) drawPixel(x, y, c.white);
            }
            
            // Руки вперед (при приседе)
            for (let y = 7; y <= 10; y++) {
                drawPixel(0, y, c.skin);
                drawPixel(1, y, c.skin);
                drawPixel(14, y, c.skin);
                drawPixel(15, y, c.skin);
            }
            
            // Ноги согнуты (подтянуты)
            for (let y = 12; y <= 17; y++) {
                drawPixel(4, y, c.pants);
                drawPixel(5, y, c.pants);
                drawPixel(10, y, c.pants);
                drawPixel(11, y, c.pants);
            }
            
            // Обувь внизу (НА ЗЕМЛЕ - не меняется!)
            for (let x = 3; x <= 6; x++) {
                drawPixel(x, 18, c.shoe);
                drawPixel(x, 19, c.black);
            }
            for (let x = 9; x <= 12; x++) {
                drawPixel(x, 18, c.shoe);
                drawPixel(x, 19, c.black);
            }
            
        } else {
            // ОБЫЧНЫЙ персонаж
            // Волосы
            for (let x = 4; x <= 11; x++) drawPixel(x, 0, c.cyan);
            for (let x = 3; x <= 12; x++) drawPixel(x, 1, c.cyan);
            for (let x = 2; x <= 13; x++) drawPixel(x, 2, c.cyan);
            
            // Наушники
            drawPixel(1, 3, c.white);
            drawPixel(14, 3, c.white);
            drawPixel(1, 4, c.white);
            drawPixel(14, 4, c.white);
            
            // Лицо
            for (let y = 3; y <= 7; y++) {
                for (let x = 2; x <= 13; x++) drawPixel(x, y, c.skin);
            }
            
            // Глаза
            drawPixel(5, 4, c.dark);
            drawPixel(6, 4, c.dark);
            drawPixel(9, 4, c.dark);
            drawPixel(10, 4, c.dark);
            
            // Рот
            for (let x = 5; x <= 10; x++) drawPixel(x, 6, c.dark);
            
            // Шея
            for (let x = 5; x <= 10; x++) drawPixel(x, 8, c.skin);
            
            // Тело (рубашка)
            for (let y = 9; y <= 18; y++) {
                for (let x = 3; x <= 12; x++) drawPixel(x, y, c.white);
            }
            
            // Руки с анимацией
            for (let y = 10; y <= 16; y++) {
                drawPixel(1, y + armSwing, c.skin);
                drawPixel(2, y + armSwing, c.skin);
                drawPixel(13, y - armSwing, c.skin);
                drawPixel(14, y - armSwing, c.skin);
            }
            
            // Штаны
            for (let y = 19; y <= 26; y++) {
                for (let x = 3; x <= 12; x++) {
                    drawPixel(x, y, y % 2 === 0 ? c.pants : c.pantsDark);
                }
            }
            
            // Пояс
            for (let x = 3; x <= 12; x++) drawPixel(x, 19, c.dark);
            
            // Ноги с анимацией бега
            // Левая нога
            for (let y = 27; y <= 36; y++) {
                drawPixel(5 + legKick, y, c.pants);
                drawPixel(6 + legKick, y, c.pantsDark);
            }
            
            // Правая нога
            for (let y = 27; y <= 36; y++) {
                drawPixel(8 - legKick, y, c.pants);
                drawPixel(9 - legKick, y, c.pantsDark);
            }
            
            // Обувь (внизу на земле) - строка 37-38 чтобы персонаж был ниже
            for (let x = 4; x <= 7; x++) {
                drawPixel(x + legKick, 37, c.shoe);
                drawPixel(x + legKick, 38, c.black);
            }
            for (let x = 7; x <= 10; x++) {
                drawPixel(x - legKick, 37, c.shoe);
                drawPixel(x - legKick, 38, c.black);
            }
        }
        
        // Отладка hitbox (раскомментируй чтобы увидеть границы)
        // ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
        // ctx.lineWidth = 2;
        // ctx.strokeRect(p.x, p.y, p.width, p.height);
    }
    
    drawObstacle(obstacle) {
        const ctx = this.ctx;
        const s = 4;
        
        // Trash can colors
        const colors = {
            body: '#4a4a4a',
            dark: '#2a2a2a',
            lid: '#3a3a3a',
            rust: '#8B4513'
        };
        
        const drawPixel = (x, y, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(obstacle.x + x * s, obstacle.y + y * s, s, s);
        };
        
        // Trash can body
        for (let y = 2; y <= 8; y++) {
            for (let x = 1; x <= 6; x++) {
                drawPixel(x, y, colors.body);
            }
        }
        
        // Lid
        for (let x = 0; x <= 7; x++) {
            drawPixel(x, 0, colors.lid);
            drawPixel(x, 1, colors.lid);
        }
        
        // Details and rust
        drawPixel(2, 4, colors.rust);
        drawPixel(5, 5, colors.rust);
        drawPixel(3, 7, colors.dark);
        drawPixel(4, 6, colors.dark);
    }
    
    drawBird(bird) {
        const ctx = this.ctx;
        const s = 3;
        
        // Bird colors
        const colors = {
            body: '#2C3E50',
            wing: '#34495E',
            beak: '#F39C12',
            eye: '#ECF0F1'
        };
        
        const drawPixel = (x, y, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(bird.x + x * s, bird.y + y * s, s, s);
        };
        
        // Wing animation
        const wingFlap = Math.floor((this.score * 2) % 8) < 4 ? 0 : 1;
        
        // Body
        for (let x = 2; x <= 5; x++) {
            for (let y = 1; y <= 3; y++) {
                drawPixel(x, y, colors.body);
            }
        }
        
        // Head
        drawPixel(5, 0, colors.body);
        drawPixel(6, 0, colors.body);
        drawPixel(6, 1, colors.body);
        
        // Beak
        drawPixel(7, 0, colors.beak);
        drawPixel(7, 1, colors.beak);
        
        // Eye
        drawPixel(5, 1, colors.eye);
        
        // Wings
        if (wingFlap === 0) {
            // Wings up
            drawPixel(1, 0, colors.wing);
            drawPixel(2, 0, colors.wing);
            drawPixel(0, 1, colors.wing);
            drawPixel(1, 1, colors.wing);
        } else {
            // Wings down
            drawPixel(1, 2, colors.wing);
            drawPixel(2, 2, colors.wing);
            drawPixel(0, 3, colors.wing);
            drawPixel(1, 3, colors.wing);
        }
        
        // Tail
        drawPixel(0, 2, colors.body);
        drawPixel(1, 2, colors.body);
    }
    
    drawGround() {
        const ctx = this.ctx;
        
        // Ground - wasteland style with layers
        // Земля коричневая
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);
        
        // Линия земли (темнее)
        ctx.fillStyle = '#6B5345';
        ctx.fillRect(0, this.groundY, this.canvas.width, 3);
        
        // Trash scattered on ground (движущийся мусор)
        for (let i = 0; i < 50; i++) {
            const x = (i * 30 + this.score * 2) % this.canvas.width;
            ctx.fillStyle = ['#666', '#888', '#4a4a4a'][i % 3];
            ctx.fillRect(x, this.groundY + 5 + (i % 10), 5, 3);
        }
    }
    
    drawSky() {
        const ctx = this.ctx;
        
        // Polluted sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, this.groundY);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#B0C4DE');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.groundY);
        
        // Clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        const cloudX = (this.score * 0.5) % (this.canvas.width + 100);
        ctx.beginPath();
        ctx.arc(cloudX, 50, 20, 0, Math.PI * 2);
        ctx.arc(cloudX + 25, 50, 25, 0, Math.PI * 2);
        ctx.arc(cloudX + 50, 50, 20, 0, Math.PI * 2);
        ctx.fill();
    }
    
    update() {
        if (this.gameOver) return;
        
        // Update score
        this.score += 0.1;
        
        // Постепенное увеличение скорости (медленнее)
        this.speed = this.baseSpeed + Math.floor(this.score / 150);
        
        // Усложнения на разных этапах
        if (this.score >= 300 && this.score < 301) {
            console.log('🔥 Уровень 2! Появляются птицы!');
        }
        if (this.score >= 400 && this.score < 401) {
            console.log('🔥 Уровень 3! Максимальная сложность!');
        }
        
        this.updateScore();
        
        // Update player
        this.player.velocityY += this.player.gravity;
        this.player.y += this.player.velocityY;
        
        // Ground collision
        if (this.player.y >= this.playerGroundY) {
            this.player.y = this.playerGroundY;
            this.player.velocityY = 0;
            this.player.isJumping = false;
        }
        
        // Spawn obstacles (мусорки на земле)
        this.obstacleTimer++;
        const obstacleFrequency = this.score >= 400 ? 50 : 70;
        if (this.obstacleTimer > this.obstacleInterval) {
            const trashHeight = 40;
            this.obstacles.push({
                x: this.canvas.width,
                y: this.groundY - trashHeight,  // Урна стоит НА земле
                width: 32,
                height: trashHeight
            });
            this.obstacleTimer = 0;
            this.obstacleInterval = obstacleFrequency + Math.random() * 40;
        }
        
        // Spawn birds (после 300 очков) - летают над головой
        if (this.score >= 300) {
            this.birdTimer++;
            const birdFrequency = this.score >= 400 ? 80 : 120;
            if (this.birdTimer > this.birdInterval) {
                // Птицы летают на высоте головы присевшего персонажа
                const birdHeight = 100 + Math.random() * 60;
                this.birds.push({
                    x: this.canvas.width,
                    y: birdHeight,
                    width: 24,
                    height: 12
                });
                this.birdTimer = 0;
                this.birdInterval = birdFrequency + Math.random() * 60;
            }
        }
        
        // Update obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].x -= this.speed;
            
            // Remove off-screen obstacles
            if (this.obstacles[i].x + this.obstacles[i].width < 0) {
                this.obstacles.splice(i, 1);
                continue;
            }
            
            // Collision detection
            if (this.checkCollision(this.player, this.obstacles[i])) {
                this.gameOver = true;
                this.showGameOver();
            }
        }
        
        // Update birds
        for (let i = this.birds.length - 1; i >= 0; i--) {
            this.birds[i].x -= this.speed * 1.2;
            
            // Remove off-screen birds
            if (this.birds[i].x + this.birds[i].width < 0) {
                this.birds.splice(i, 1);
                continue;
            }
            
            // Collision detection
            if (this.checkCollision(this.player, this.birds[i])) {
                this.gameOver = true;
                this.showGameOver();
            }
        }
    }
    
    checkCollision(player, obstacle) {
        return player.x < obstacle.x + obstacle.width &&
               player.x + player.width > obstacle.x &&
               player.y < obstacle.y + obstacle.height &&
               player.y + player.height > obstacle.y;
    }
    
    showGameOver() {
        const ctx = this.ctx;
        
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Game Over text
        ctx.fillStyle = '#ff4444';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        // Restart hint
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Arial';
        ctx.fillText('Click to restart', this.canvas.width / 2, this.canvas.height / 2 + 30);
        
        // Wait for click to restart
        const restartHandler = () => {
            this.reset();
            this.canvas.removeEventListener('click', restartHandler);
        };
        this.canvas.addEventListener('click', restartHandler, { once: true });
    }
    
    draw() {
        this.drawSky();
        this.drawGround();
        
        // Draw obstacles
        this.obstacles.forEach(obstacle => this.drawObstacle(obstacle));
        
        // Draw birds
        this.birds.forEach(bird => this.drawBird(bird));
        
        // Draw player
        this.drawPlayer();
        
        // Draw difficulty indicators
        if (this.score >= 300 && this.score < 320) {
            this.ctx.fillStyle = '#F39C12';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('⚡ LEVEL 2! BIRDS!', this.canvas.width / 2, 50);
        }
        
        if (this.score >= 400 && this.score < 420) {
            this.ctx.fillStyle = '#E74C3C';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🔥 LEVEL 3! INSANE!', this.canvas.width / 2, 50);
        }
        
        // Draw game over
        if (this.gameOver) {
            this.showGameOver();
        }
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TrashRunnerGame();
});

