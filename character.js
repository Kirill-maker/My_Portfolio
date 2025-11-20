// Draw Animated Pixel Character using shared renderer
const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
let animFrame = 0;

function drawCharacter() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Use shared pixel character renderer
    pixelCharacterRenderer.draw(ctx, 0, 0, animFrame, 3);
    
    animFrame++;
    requestAnimationFrame(drawCharacter);
}

drawCharacter();

